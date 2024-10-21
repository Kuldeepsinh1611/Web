# yourapp/serializers.py

from rest_framework import serializers
from .models import Property, PropertyImage, NearbyPlace

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ["image"]

class PropertyDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = ["pk",'title','address']

class NearbyPlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NearbyPlace
        fields = ["name", "distance", "place_type"]

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    nearby_places = NearbyPlaceSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = [
            "pk",
            "title",
            "description",
            "property_type",
            "price",
            "address",
            "pincode",
            "area",
            "bedroom",
            "parking",
            "lat",
            "log",
            "images",
            "nearby_places",
            "is_verified",
            "is_available",
            "agent",
            "owner",
        ]
