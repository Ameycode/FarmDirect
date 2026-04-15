from django.db import models
from farms.models import FarmProfile


class Product(models.Model):
    CATEGORY_CHOICES = [
        ('vegetables', 'Vegetables'),
        ('fruits', 'Fruits'),
        ('grains', 'Grains & Pulses'),
        ('dairy', 'Dairy'),
        ('herbs', 'Herbs & Spices'),
        ('other', 'Other'),
    ]
    UNIT_CHOICES = [
        ('kg', 'Kilogram'),
        ('g', 'Gram'),
        ('litre', 'Litre'),
        ('dozen', 'Dozen'),
        ('piece', 'Piece'),
        ('bunch', 'Bunch'),
        ('bag', 'Bag'),
    ]

    farm = models.ForeignKey(FarmProfile, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='vegetables')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_negotiable = models.BooleanField(default=True)
    min_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    quantity = models.FloatField()
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES, default='kg')
    harvest_date = models.DateField(null=True, blank=True)
    is_organic = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    image_url = models.URLField(blank=True)  # For Cloudinary URLs
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'products'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} — {self.farm.farm_name}"

    @property
    def display_image(self):
        if self.image_url:
            return self.image_url
        if self.image:
            return self.image.url
        return None
