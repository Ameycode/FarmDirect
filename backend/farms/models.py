from django.db import models
from users.models import User
import math


class FarmProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='farm_profile')
    farm_name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    address = models.TextField()
    village = models.CharField(max_length=100, blank=True)
    district = models.CharField(max_length=100)
    state = models.CharField(max_length=100, default='Maharashtra')
    pincode = models.CharField(max_length=10, blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    delivery_radius_km = models.FloatField(default=30.0)
    phone = models.CharField(max_length=15, blank=True)
    avatar = models.ImageField(upload_to='farms/', null=True, blank=True)
    cover_image = models.ImageField(upload_to='farms/covers/', null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    rating = models.FloatField(default=0.0)
    total_reviews = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'farm_profiles'

    def __str__(self):
        return f"{self.farm_name} — {self.district}"

    def distance_from(self, lat, lng):
        """Haversine formula to compute distance in km."""
        R = 6371
        lat1, lon1 = math.radians(self.latitude), math.radians(self.longitude)
        lat2, lon2 = math.radians(lat), math.radians(lng)
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c


class Review(models.Model):
    farm = models.ForeignKey(FarmProfile, on_delete=models.CASCADE, related_name='reviews')
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews_given')
    rating = models.PositiveSmallIntegerField()  # 1-5
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reviews'
        unique_together = ['farm', 'buyer']

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update farm average rating
        farm = self.farm
        reviews = Review.objects.filter(farm=farm)
        farm.rating = reviews.aggregate(models.Avg('rating'))['rating__avg'] or 0
        farm.total_reviews = reviews.count()
        farm.save(update_fields=['rating', 'total_reviews'])
