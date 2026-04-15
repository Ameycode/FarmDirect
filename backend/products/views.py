from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product
from .serializers import ProductSerializer, ProductCreateSerializer


class ProductViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_organic', 'is_available', 'farm__district']
    search_fields = ['name', 'description', 'farm__farm_name']
    ordering_fields = ['price', 'created_at', 'harvest_date']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = Product.objects.select_related('farm', 'farm__user').filter(is_available=True)
        farm_id = self.request.query_params.get('farm_id')
        if farm_id:
            qs = qs.filter(farm_id=farm_id)
        return qs

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProductCreateSerializer
        return ProductSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        farm = self.request.user.farm_profile
        serializer.save(farm=farm)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def mine(self, request):
        """Get all products for the authenticated farmer."""
        try:
            farm = request.user.farm_profile
        except Exception:
            return Response({'detail': 'No farm profile found.'}, status=status.HTTP_404_NOT_FOUND)
        products = Product.objects.filter(farm=farm).order_by('-created_at')
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
