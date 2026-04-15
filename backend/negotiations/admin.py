from django.contrib import admin
from .models import Negotiation, NegotiationMessage


@admin.register(Negotiation)
class NegotiationAdmin(admin.ModelAdmin):
    list_display = ['id', 'buyer', 'product', 'status', 'initial_offer', 'final_price', 'created_at']
    list_filter = ['status']
    search_fields = ['buyer__name', 'product__name']


@admin.register(NegotiationMessage)
class NegotiationMessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'negotiation', 'sender', 'message_type', 'price_offer', 'created_at']
    list_filter = ['message_type']
