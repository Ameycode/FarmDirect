from django.db import models
from users.models import User
from products.models import Product


class Negotiation(models.Model):
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('EXPIRED', 'Expired'),
    ]

    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='negotiations_as_buyer')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='negotiations')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ACTIVE')
    initial_offer = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    final_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'negotiations'
        ordering = ['-updated_at']

    def __str__(self):
        return f"Negotiation #{self.id} — {self.buyer.name} ↔ {self.product.name} [{self.status}]"

    @property
    def farmer(self):
        return self.product.farm.user

    @property
    def latest_offer(self):
        """Return the most recent price offer in this negotiation."""
        msg = self.messages.filter(price_offer__isnull=False).order_by('-created_at').first()
        return msg.price_offer if msg else self.initial_offer


class NegotiationMessage(models.Model):
    TYPE_CHOICES = [
        ('TEXT', 'Text Message'),
        ('OFFER', 'Price Offer'),
        ('COUNTER', 'Counter Offer'),
        ('ACCEPT', 'Accept'),
        ('REJECT', 'Reject'),
        ('SYSTEM', 'System Message'),
    ]

    negotiation = models.ForeignKey(Negotiation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='negotiation_messages')
    message = models.TextField(blank=True)
    price_offer = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    message_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='TEXT')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'negotiation_messages'
        ordering = ['created_at']

    def __str__(self):
        return f"[{self.message_type}] {self.sender.name}: {self.message[:50]}"
