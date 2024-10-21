# yourapp/models.py
from property.models import Property
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not username:
            raise ValueError('The Username field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


class Client(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    favourite_property = models.ManyToManyField(Property, related_name="client_favourites",blank=True,default=None)
    sell_property = models.ManyToManyField(Property, related_name="client_selling",blank=True,default=None)

    def __str__(self):
        return self.user.username

class Agent(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    inquiry_property = models.ManyToManyField(Property, related_name="agent_inquiries",blank=True,default=None)
    active_property = models.ManyToManyField(Property, related_name="agent_actives",blank=True,default=None)

    def __str__(self):
        return self.user.username

