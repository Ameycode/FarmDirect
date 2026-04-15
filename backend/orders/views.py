from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem, Order, OrderItem
from .serializers import CartSerializer, CartItemSerializer, OrderSerializer, PlaceOrderSerializer
from products.models import Product
from farms.models import FarmProfile


# ── CART ──────────────────────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart, _ = Cart.objects.get_or_create(buyer=request.user)
    return Response(CartSerializer(cart).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    quantity = float(request.data.get('quantity', 1))
    negotiated_price = request.data.get('negotiated_price')

    product = get_object_or_404(Product, id=product_id, is_available=True)
    cart, _ = Cart.objects.get_or_create(buyer=request.user)

    item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        item.quantity += quantity
    else:
        item.quantity = quantity

    if negotiated_price:
        item.negotiated_price = negotiated_price

    item.save()
    return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


@api_view(['PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def cart_item(request, item_id):
    item = get_object_or_404(CartItem, id=item_id, cart__buyer=request.user)

    if request.method == 'DELETE':
        item.delete()
        cart = Cart.objects.get(buyer=request.user)
        return Response(CartSerializer(cart).data)

    # PATCH — update quantity
    quantity = request.data.get('quantity')
    if quantity is not None:
        item.quantity = float(quantity)
        item.save()

    cart = Cart.objects.get(buyer=request.user)
    return Response(CartSerializer(cart).data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    try:
        cart = Cart.objects.get(buyer=request.user)
        cart.items.all().delete()
    except Cart.DoesNotExist:
        pass
    return Response({'message': 'Cart cleared'})


# ── ORDERS ────────────────────────────────────────────────────
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def orders(request):
    if request.method == 'GET':
        user_orders = Order.objects.filter(buyer=request.user).prefetch_related('items__product')
        return Response(OrderSerializer(user_orders, many=True).data)

    # POST — place order from cart
    serializer = PlaceOrderSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    farm = get_object_or_404(FarmProfile, id=serializer.validated_data['farm_id'])
    cart = get_object_or_404(Cart, buyer=request.user)
    cart_items = cart.items.filter(product__farm=farm)

    if not cart_items.exists():
        return Response({'error': 'No items from this farm in cart'}, status=status.HTTP_400_BAD_REQUEST)

    total = sum(item.subtotal for item in cart_items)
    order = Order.objects.create(
        buyer=request.user,
        farm=farm,
        total=total,
        delivery_type=serializer.validated_data['delivery_type'],
        payment_method=serializer.validated_data.get('payment_method', 'COD'),
        delivery_address=serializer.validated_data.get('delivery_address', ''),
        notes=serializer.validated_data.get('notes', ''),
    )

    for item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.negotiated_price or item.product.price,
        )
        item.delete()

    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_detail(request, order_id):
    order = get_object_or_404(Order, id=order_id, buyer=request.user)
    return Response(OrderSerializer(order).data)


# ── FARMER ORDER MANAGEMENT ───────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def farmer_orders(request):
    try:
        farm = request.user.farm_profile
    except FarmProfile.DoesNotExist:
        return Response({'error': 'No farm profile'}, status=status.HTTP_404_NOT_FOUND)

    farm_orders = Order.objects.filter(farm=farm).prefetch_related('items__product')
    status_filter = request.query_params.get('status')
    if status_filter:
        farm_orders = farm_orders.filter(status=status_filter)
    return Response(OrderSerializer(farm_orders, many=True).data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_order_status(request, order_id):
    try:
        farm = request.user.farm_profile
    except Exception:
        return Response({'error': 'Not a farmer'}, status=status.HTTP_403_FORBIDDEN)

    order = get_object_or_404(Order, id=order_id, farm=farm)
    new_status = request.data.get('status')
    valid = [s[0] for s in Order.STATUS_CHOICES]
    if new_status not in valid:
        return Response({'error': f'Invalid status. Choose from: {valid}'}, status=status.HTTP_400_BAD_REQUEST)

    order.status = new_status
    order.save()
    return Response(OrderSerializer(order).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def farmer_earnings(request):
    try:
        farm = request.user.farm_profile
    except Exception:
        return Response({'error': 'No farm profile'}, status=status.HTTP_404_NOT_FOUND)

    from django.db.models import Sum, Count
    stats = Order.objects.filter(farm=farm, status='DELIVERED').aggregate(
        total_earned=Sum('total'),
        total_orders=Count('id'),
    )
    pending = Order.objects.filter(farm=farm, status='PENDING').count()
    return Response({
        'total_earned': stats['total_earned'] or 0,
        'total_orders': stats['total_orders'] or 0,
        'pending_orders': pending,
    })
