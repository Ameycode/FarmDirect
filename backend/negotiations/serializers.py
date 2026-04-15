from rest_framework import serializers
from .models import Negotiation, NegotiationMessage


class NegotiationMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.name', read_only=True)
    sender_role = serializers.CharField(source='sender.role', read_only=True)

    class Meta:
        model = NegotiationMessage
        fields = [
            'id', 'sender', 'sender_name', 'sender_role',
            'message', 'price_offer', 'message_type', 'created_at',
        ]
        read_only_fields = ['id', 'sender', 'sender_name', 'sender_role', 'created_at']


class NegotiationListSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.ReadOnlyField(source='product.display_image')
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    product_unit = serializers.CharField(source='product.unit', read_only=True)
    product_min_price = serializers.DecimalField(source='product.min_price', max_digits=10, decimal_places=2, read_only=True)
    farm_name = serializers.CharField(source='product.farm.farm_name', read_only=True)
    farm_id = serializers.IntegerField(source='product.farm.id', read_only=True)
    buyer_name = serializers.CharField(source='buyer.name', read_only=True)
    buyer_phone = serializers.CharField(source='buyer.phone', read_only=True)
    farmer_name = serializers.CharField(source='product.farm.user.name', read_only=True)
    latest_offer = serializers.ReadOnlyField()
    last_message = serializers.SerializerMethodField()
    message_count = serializers.SerializerMethodField()

    class Meta:
        model = Negotiation
        fields = [
            'id', 'buyer_name', 'buyer_phone', 'farmer_name',
            'product_name', 'product_image', 'product_price', 'product_unit', 'product_min_price',
            'farm_name', 'farm_id',
            'status', 'initial_offer', 'final_price', 'latest_offer',
            'last_message', 'message_count',
            'created_at', 'updated_at',
        ]

    def get_last_message(self, obj):
        msg = obj.messages.order_by('-created_at').first()
        if msg:
            return {
                'message': msg.message,
                'sender_name': msg.sender.name,
                'message_type': msg.message_type,
                'price_offer': str(msg.price_offer) if msg.price_offer else None,
                'created_at': msg.created_at.isoformat(),
            }
        return None

    def get_message_count(self, obj):
        return obj.messages.count()


class NegotiationDetailSerializer(NegotiationListSerializer):
    messages = NegotiationMessageSerializer(many=True, read_only=True)

    class Meta(NegotiationListSerializer.Meta):
        fields = NegotiationListSerializer.Meta.fields + ['messages']


class StartNegotiationSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    message = serializers.CharField(required=False, allow_blank=True, default='')
    offer_price = serializers.DecimalField(max_digits=10, decimal_places=2)


class SendMessageSerializer(serializers.Serializer):
    message = serializers.CharField(required=False, allow_blank=True, default='')
    price_offer = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    message_type = serializers.ChoiceField(
        choices=['TEXT', 'OFFER', 'COUNTER'],
        default='TEXT',
    )
