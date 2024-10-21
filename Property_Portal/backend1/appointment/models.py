from django.db import models
from property.models import Property


# Appointment Model
class Appointment(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='appointment_property')
    applicant = models.ForeignKey('account.CustomUser', on_delete=models.CASCADE, related_name='applicant')
    date = models.DateField()
    description = models.TextField(null=True)

    def __str__(self):
        return f"Appointment on {self.date} for {self.property.title}"

