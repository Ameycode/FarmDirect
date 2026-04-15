from django.urls import path
from . import views

urlpatterns = [
    path('cart/', views.get_cart, name='cart'),
    path('cart/add/', views.add_to_cart, name='cart-add'),
    path('cart/clear/', views.clear_cart, name='cart-clear'),
    path('cart/<int:item_id>/', views.cart_item, name='cart-item'),
    path('', views.orders, name='orders'),
    path('<int:order_id>/', views.order_detail, name='order-detail'),
    path('farmer/', views.farmer_orders, name='farmer-orders'),
    path('farmer/earnings/', views.farmer_earnings, name='farmer-earnings'),
    path('<int:order_id>/status/', views.update_order_status, name='order-status'),
]
