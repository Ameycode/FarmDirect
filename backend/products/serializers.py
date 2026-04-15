from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    farm_name = serializers.CharField(source='farm.farm_name', read_only=True)
    farm_id = serializers.IntegerField(source='farm.id', read_only=True)
    farmer_name = serializers.CharField(source='farm.user.name', read_only=True)
    farm_district = serializers.CharField(source='farm.district', read_only=True)
    display_image = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'farm_id', 'farm_name', 'farmer_name', 'farm_district',
            'name', 'description', 'category', 'price', 'is_negotiable',
            'min_price', 'quantity', 'unit', 'harvest_date', 'is_organic',
            'is_available', 'image_url', 'display_image', 'created_at',
        ]
        read_only_fields = ['id', 'farm_id', 'farm_name', 'farmer_name', 'farm_district', 'created_at']


class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'name', 'description', 'category', 'price', 'is_negotiable',
            'min_price', 'quantity', 'unit', 'harvest_date', 'is_organic',
            'is_available', 'image', 'image_url',
        ]
