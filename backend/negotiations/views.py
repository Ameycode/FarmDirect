from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q
from .models import Negotiation, NegotiationMessage
from .serializers import (
    NegotiationListSerializer,
    NegotiationDetailSerializer,
    NegotiationMessageSerializer,
    StartNegotiationSerializer,
    SendMessageSerializer,
)
from products.models import Product


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_negotiation(request):
    """Buyer starts a new negotiation for a product."""
    serializer = StartNegotiationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    product = get_object_or_404(Product, id=serializer.validated_data['product_id'], is_available=True)

    if not product.is_negotiable:
        return Response({'error': 'This product is not negotiable'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if buyer already has an active negotiation for this product
    existing = Negotiation.objects.filter(
        buyer=request.user, product=product, status='ACTIVE'
    ).first()
    if existing:
        return Response(
            NegotiationDetailSerializer(existing).data,
            status=status.HTTP_200_OK,
        )

    offer_price = serializer.validated_data['offer_price']
    message_text = serializer.validated_data.get('message', '')

    negotiation = Negotiation.objects.create(
        buyer=request.user,
        product=product,
        initial_offer=offer_price,
    )

    # Create the opening offer message
    offer_msg = f"I'd like to buy {product.name} at ₹{offer_price}/{product.unit}"
    if message_text:
        offer_msg += f". {message_text}"

    NegotiationMessage.objects.create(
        negotiation=negotiation,
        sender=request.user,
        message=offer_msg,
        price_offer=offer_price,
        message_type='OFFER',
    )

    return Response(
        NegotiationDetailSerializer(negotiation).data,
        status=status.HTTP_201_CREATED,
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_negotiations(request):
    """List negotiations for the current user (buyer or farmer)."""
    user = request.user
    status_filter = request.query_params.get('status')

    if user.role == 'FARMER':
        # For farmers, show negotiations on their products
        negotiations = Negotiation.objects.filter(product__farm__user=user)
    else:
        # For buyers, show their own negotiations
        negotiations = Negotiation.objects.filter(buyer=user)

    if status_filter:
        negotiations = negotiations.filter(status=status_filter)

    negotiations = negotiations.select_related(
        'buyer', 'product', 'product__farm', 'product__farm__user'
    ).prefetch_related('messages')

    return Response(NegotiationListSerializer(negotiations, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def negotiation_detail(request, negotiation_id):
    """Get full negotiation detail with all messages."""
    negotiation = get_object_or_404(Negotiation, id=negotiation_id)

    # Ensure user is either the buyer or the farmer
    if request.user != negotiation.buyer and request.user != negotiation.farmer:
        return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

    negotiation = Negotiation.objects.select_related(
        'buyer', 'product', 'product__farm', 'product__farm__user'
    ).prefetch_related('messages__sender').get(id=negotiation_id)

    return Response(NegotiationDetailSerializer(negotiation).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request, negotiation_id):
    """Send a message or offer in a negotiation."""
    negotiation = get_object_or_404(Negotiation, id=negotiation_id, status='ACTIVE')

    # Ensure user is either the buyer or the farmer
    if request.user != negotiation.buyer and request.user != negotiation.farmer:
        return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

    serializer = SendMessageSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    msg_type = serializer.validated_data['message_type']
    price_offer = serializer.validated_data.get('price_offer')
    message_text = serializer.validated_data.get('message', '')

    # Auto-set message type based on role
    if msg_type in ('OFFER', 'COUNTER') and request.user == negotiation.farmer:
        msg_type = 'COUNTER'
    elif msg_type in ('OFFER', 'COUNTER') and request.user == negotiation.buyer:
        msg_type = 'OFFER'

    # Build default message for offers
    if msg_type in ('OFFER', 'COUNTER') and price_offer and not message_text:
        action = 'offer' if msg_type == 'OFFER' else 'counter-offer'
        message_text = f"My {action}: ₹{price_offer}/{negotiation.product.unit}"

    msg = NegotiationMessage.objects.create(
        negotiation=negotiation,
        sender=request.user,
        message=message_text,
        price_offer=price_offer,
        message_type=msg_type,
    )

    # Update the negotiation timestamp
    negotiation.save(update_fields=['updated_at'])

    return Response(NegotiationMessageSerializer(msg).data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_negotiation(request, negotiation_id):
    """Farmer (or buyer) accepts the latest offer."""
    negotiation = get_object_or_404(Negotiation, id=negotiation_id, status='ACTIVE')

    if request.user != negotiation.buyer and request.user != negotiation.farmer:
        return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

    # Get the latest price offer
    latest_offer = negotiation.latest_offer
    if not latest_offer:
        return Response({'error': 'No offer to accept'}, status=status.HTTP_400_BAD_REQUEST)

    negotiation.status = 'ACCEPTED'
    negotiation.final_price = latest_offer
    negotiation.save()

    # Create system message
    NegotiationMessage.objects.create(
        negotiation=negotiation,
        sender=request.user,
        message=f"✅ Deal accepted at ₹{latest_offer}/{negotiation.product.unit}! Add to cart to complete your purchase.",
        message_type='ACCEPT',
    )

    return Response(NegotiationDetailSerializer(negotiation).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_negotiation(request, negotiation_id):
    """Either party rejects/closes the negotiation."""
    negotiation = get_object_or_404(Negotiation, id=negotiation_id, status='ACTIVE')

    if request.user != negotiation.buyer and request.user != negotiation.farmer:
        return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

    negotiation.status = 'REJECTED'
    negotiation.save()

    reason = request.data.get('reason', 'Negotiation closed')
    NegotiationMessage.objects.create(
        negotiation=negotiation,
        sender=request.user,
        message=f"❌ {reason}",
        message_type='REJECT',
    )

    return Response(NegotiationDetailSerializer(negotiation).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def poll_messages(request, negotiation_id):
    """Poll for new messages (supports ?after=<iso-timestamp>)."""
    negotiation = get_object_or_404(Negotiation, id=negotiation_id)

    if request.user != negotiation.buyer and request.user != negotiation.farmer:
        return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

    after = request.query_params.get('after')
    messages = negotiation.messages.select_related('sender')

    if after:
        from django.utils.dateparse import parse_datetime
        after_dt = parse_datetime(after)
        if after_dt:
            messages = messages.filter(created_at__gt=after_dt)

    return Response({
        'messages': NegotiationMessageSerializer(messages, many=True).data,
        'status': negotiation.status,
        'final_price': str(negotiation.final_price) if negotiation.final_price else None,
    })
