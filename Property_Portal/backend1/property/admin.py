from django.contrib import admin
from .models import Property, PropertyImage, NearbyPlace

admin.site.register(Property)
admin.site.register(PropertyImage)
admin.site.register(NearbyPlace)
