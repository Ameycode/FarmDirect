from django.db import models
from users.models import User
from products.models import Product
from farms.models import FarmProfile


class Cart(models.Model):
    buyer = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'carts'

    def get_total(self):
        return sum(item.subtotal for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.FloatField(default=1)
    negotiated_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        db_table = 'cart_items'
        unique_together = ['cart', 'product']

    @property
    def subtotal(self):
        price = self.negotiated_price or self.product.price
        return float(price) * self.quantity


class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('PREPARING', 'Preparing'),
        ('OUT_FOR_DELIVERY', 'Out for Delivery'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]
    DELIVERY_CHOICES = [
        ('DELIVERY', 'Home Delivery'),
        ('PICKUP', 'Farm Pickup'),
    ]
    PAYMENT_CHOICES = [
        ('COD', 'Cash on Delivery'),
        ('UPI', 'UPI'),
    ]

    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    farm = models.ForeignKey(FarmProfile, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    delivery_type = models.CharField(max_length=10, choices=DELIVERY_CHOICES, default='DELIVERY')
    payment_method = models.CharField(max_length=10, choices=PAYMENT_CHOICES, default='COD')
    delivery_address = models.TextField(blank=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True)
    scheduled_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'orders'
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.id} — {self.buyer.name} from {self.farm.farm_name}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.FloatField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price at time of order

    class Meta:
        db_table = 'order_items'

    @property
    def subtotal(self):
        return float(self.price) * self.quantity
