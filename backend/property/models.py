from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from django.core.exceptions import ValidationError
from accounts.models import CustomUser

# Create your models here.
class Property(models.Model):
    name = models.CharField(max_length=255, unique=True)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    owner_first_name = models.CharField(max_length=255)
    owner_last_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    from_date = models.DateField()
    to_date = models.DateField()
    guests = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    number_of_bedrooms = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(10)])
    number_of_washrooms = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(10)])
    contact_number = models.CharField(max_length=255)
    email = models.EmailField()
    amenities = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    # rating = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(5.0)])
    image = models.ImageField(upload_to='property_images/')
    
    def save(self, *args, **kwargs):
        if self.to_date <= self.from_date:
            raise ValidationError("to_date must be later than from_date")
        super(Property, self).save(*args, **kwargs)
        
    # def __str__(self):
    #     return self.name


from django.conf import settings

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='property_images/', default='default_images/default_property_image.jpg')

    def __str__(self):
        return self.property.name
