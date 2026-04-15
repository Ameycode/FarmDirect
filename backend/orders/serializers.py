from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem
from products.serializers import ProductSerializer


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'negotiated_price', 'subtotal']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total']

    def get_total(self, obj):
        return obj.get_total()


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.ReadOnlyField(source='product.display_image')
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'product_image', 'quantity', 'price', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    farm_name = serializers.CharField(source='farm.farm_name', read_only=True)
    buyer_name = serializers.CharField(source='buyer.name', read_only=True)
    buyer_phone = serializers.CharField(source='buyer.phone', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'buyer_name', 'buyer_phone', 'farm_name', 'status',
            'delivery_type', 'payment_method', 'delivery_address',
            'total', 'notes', 'scheduled_at', 'items', 'created_at',
        ]
        read_only_fields = ['id', 'buyer_name', 'buyer_phone', 'farm_name', 'created_at']


class PlaceOrderSerializer(serializers.Serializer):
    farm_id = serializers.IntegerField()
    delivery_type = serializers.ChoiceField(choices=['DELIVERY', 'PICKUP'])
    payment_method = serializers.ChoiceField(choices=['COD', 'UPI'], default='COD')
    delivery_address = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)
