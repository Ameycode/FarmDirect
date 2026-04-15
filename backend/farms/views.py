from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import FarmProfile, Review
from .serializers import FarmProfileSerializer, ReviewSerializer
import math


class FarmProfileViewSet(viewsets.ModelViewSet):
    serializer_class = FarmProfileSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['district', 'state', 'is_active']
    search_fields = ['farm_name', 'district', 'village']
    ordering_fields = ['rating', 'created_at']
    ordering = ['-rating']

    def get_queryset(self):
        qs = FarmProfile.objects.filter(is_active=True)
        lat = self.request.query_params.get('lat')
        lng = self.request.query_params.get('lng')
        radius = self.request.query_params.get('radius', 50)

        if lat and lng:
            try:
                lat, lng, radius = float(lat), float(lng), float(radius)
                # Bounding box pre-filter (approx 1 degree lat ≈ 111 km)
                delta = radius / 111
                qs = qs.filter(
                    latitude__range=(lat - delta, lat + delta),
                    longitude__range=(lng - delta, lng + delta),
                )
                # Precise Haversine filter
                nearby = [f.id for f in qs if f.distance_from(lat, lng) <= radius]
                qs = qs.filter(id__in=nearby)
            except (ValueError, TypeError):
                pass

        return qs

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        farm = self.get_object()
        reviews = Review.objects.filter(farm=farm).order_by('-created_at')
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_review(self, request, pk=None):
        farm = self.get_object()
        data = {**request.data, 'farm': farm.id}
        serializer = ReviewSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save(farm=farm)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get', 'post', 'put'], permission_classes=[IsAuthenticated])
    def mine(self, request):
        """Get or create the authenticated farmer's own farm profile."""
        if request.method == 'GET':
            try:
                farm = FarmProfile.objects.get(user=request.user)
                return Response(FarmProfileSerializer(farm, context={'request': request}).data)
            except FarmProfile.DoesNotExist:
                return Response({'detail': 'No farm profile found.'}, status=status.HTTP_404_NOT_FOUND)

        # POST or PUT — create/update
        try:
            farm = FarmProfile.objects.get(user=request.user)
            serializer = FarmProfileSerializer(farm, data=request.data, partial=True, context={'request': request})
        except FarmProfile.DoesNotExist:
            serializer = FarmProfileSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
