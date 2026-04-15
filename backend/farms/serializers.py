from rest_framework import serializers
from .models import FarmProfile, Review
from users.serializers import UserSerializer


class FarmProfileSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='user.name', read_only=True)
    owner_phone = serializers.CharField(source='user.phone', read_only=True)
    distance_km = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = FarmProfile
        fields = [
            'id', 'farm_name', 'description', 'address', 'village',
            'district', 'state', 'pincode', 'latitude', 'longitude',
            'delivery_radius_km', 'phone', 'avatar', 'cover_image',
            'is_verified', 'is_active', 'rating', 'total_reviews',
            'owner_name', 'owner_phone', 'distance_km', 'product_count',
            'created_at',
        ]
        read_only_fields = ['id', 'rating', 'total_reviews', 'created_at']

    def get_distance_km(self, obj):
        request = self.context.get('request')
        if request:
            try:
                lat = float(request.query_params.get('lat', 0))
                lng = float(request.query_params.get('lng', 0))
                if lat and lng:
                    return round(obj.distance_from(lat, lng), 1)
            except (ValueError, TypeError):
                pass
        return None

    def get_product_count(self, obj):
        return obj.products.filter(is_available=True).count()


class ReviewSerializer(serializers.ModelSerializer):
    buyer_name = serializers.CharField(source='buyer.name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'buyer_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'buyer_name', 'created_at']

    def create(self, validated_data):
        validated_data['buyer'] = self.context['request'].user
        return super().create(validated_data)
