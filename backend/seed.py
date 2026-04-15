"""
Seed script — populates the database with sample farmers, products.
Run: python seed.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User
from farms.models import FarmProfile
from products.models import Product
from datetime import date

print("Seeding FarmDirect database...")

# Sample farmers
farmers_data = [
    {
        "phone": "+919876543210", "name": "Ramesh Patil",
        "farm": {
            "farm_name": "Patil Organic Farm", "district": "Pune", "village": "Khed",
            "address": "Survey No. 45, Khed Village, Pune",
            "latitude": 18.5204, "longitude": 73.8567, "delivery_radius_km": 40,
            "description": "Third-generation organic farmer growing chemical-free vegetables since 1985.",
            "phone": "+919876543210",
        },
        "products": [
            {"name": "Tomatoes", "category": "vegetables", "price": 40, "quantity": 100, "unit": "kg",
             "is_organic": True, "is_negotiable": True, "harvest_date": date.today(),
             "image_url": "https://images.unsplash.com/photo-1546094096-0df4bcabd337?w=400"},
            {"name": "Spinach", "category": "vegetables", "price": 30, "quantity": 50, "unit": "bunch",
             "is_organic": True, "is_negotiable": True, "harvest_date": date.today(),
             "image_url": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400"},
            {"name": "Potatoes", "category": "vegetables", "price": 25, "quantity": 200, "unit": "kg",
             "is_organic": False, "is_negotiable": True, "harvest_date": date.today(),
             "image_url": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400"},
        ]
    },
    {
        "phone": "+919765432100", "name": "Sunita Deshmukh",
        "farm": {
            "farm_name": "Deshmukh Fruit Orchard", "district": "Nashik", "village": "Niphad",
            "address": "Niphad Road, Nashik District, Maharashtra",
            "latitude": 20.0059, "longitude": 74.1285, "delivery_radius_km": 60,
            "description": "Award-winning grape and mango orchard. Export quality produce.",
            "phone": "+919765432100",
        },
        "products": [
            {"name": "Alphonso Mangoes", "category": "fruits", "price": 500, "quantity": 30, "unit": "dozen",
             "is_organic": True, "is_negotiable": True, "harvest_date": date(2026, 5, 15),
             "image_url": "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400"},
            {"name": "Thompson Grapes", "category": "fruits", "price": 80, "quantity": 150, "unit": "kg",
             "is_organic": False, "is_negotiable": True, "harvest_date": date.today(),
             "image_url": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400"},
            {"name": "Pomegranates", "category": "fruits", "price": 120, "quantity": 80, "unit": "kg",
             "is_organic": True, "is_negotiable": True, "harvest_date": date.today(),
             "image_url": "https://images.unsplash.com/photo-1551649001-7a2482d98d05?w=400"},
        ]
    },
    {
        "phone": "+918765432100", "name": "Arjun Shinde",
        "farm": {
            "farm_name": "Shinde Dairy & Grains", "district": "Kolhapur", "village": "Hatkanangle",
            "address": "Main Road, Hatkanangle, Kolhapur",
            "latitude": 16.6686, "longitude": 74.2090, "delivery_radius_km": 35,
            "description": "Traditional dairy farm with A2 milk and organic grains.",
            "phone": "+918765432100",
        },
        "products": [
            {"name": "A2 Cow Milk", "category": "dairy", "price": 70, "quantity": 50, "unit": "litre",
             "is_organic": True, "is_negotiable": False, "harvest_date": date.today(),
             "image_url": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400"},
            {"name": "Desi Ghee", "category": "dairy", "price": 800, "quantity": 20, "unit": "kg",
             "is_organic": True, "is_negotiable": True, "harvest_date": date.today(),
             "image_url": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400"},
            {"name": "Jowar (Sorghum)", "category": "grains", "price": 35, "quantity": 300, "unit": "kg",
             "is_organic": True, "is_negotiable": True, "harvest_date": date(2026, 3, 1),
             "image_url": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"},
        ]
    },
]

# Sample buyer
buyer, _ = User.objects.get_or_create(phone="+911234567890")
buyer.name = "Priya Sharma"
buyer.role = "BUYER"
buyer.is_verified = True
buyer.save()
print(f"  Buyer: {buyer}")

for fd in farmers_data:
    farmer, _ = User.objects.get_or_create(phone=fd["phone"])
    farmer.name = fd["name"]
    farmer.role = "FARMER"
    farmer.is_verified = True
    farmer.save()

    farm_data = fd["farm"]
    farm, _ = FarmProfile.objects.update_or_create(
        user=farmer,
        defaults=farm_data,
    )

    for pd in fd["products"]:
        product, created = Product.objects.update_or_create(
            farm=farm, name=pd["name"], defaults=pd
        )
        if created:
            print(f"    NEW Product: {product.name}")

    print(f"  OK Farm: {farm.farm_name} ({len(fd['products'])} products)")

print("\nSeeding complete!")
print("\nTest accounts:")
print("  Buyer:   phone=+911234567890")
print("  Farmer1: phone=+919876543210")
print("  Farmer2: phone=+919765432100")
print("  Farmer3: phone=+918765432100")
