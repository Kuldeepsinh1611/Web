from django.db import models

class Property(models.Model):
    PROPERTY_TYPE_CHOICES = [
        ("residential", "Residential"),
        ("commercial", "Commercial"),
        ("industrial", "Industrial"),
    ]

    title = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPE_CHOICES)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    address = models.CharField(max_length=255)
    pincode = models.CharField(max_length=6)
    area = models.IntegerField(help_text="Area in square feet")
    bedroom = models.IntegerField()
    parking = models.IntegerField()
    added_date = models.DateTimeField(auto_now_add=True)
    
    lat = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    log = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    
    is_verified = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    
    owner = models.ForeignKey(
        'account.CustomUser', on_delete=models.CASCADE, related_name="properties"
    )
    
    agent = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.SET_NULL,
        related_name="agent_properties",
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.title

class PropertyImage(models.Model):
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="property_images/")

    def __str__(self):
        return f"Image for {self.property.title}"

class NearbyPlace(models.Model):
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="nearby_places"
    )
    name = models.CharField(max_length=255)
    distance = models.DecimalField(
        max_digits=5, decimal_places=2, help_text="Distance in meters"
    )
    place_type = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} ({self.place_type}) - {self.distance} km"
