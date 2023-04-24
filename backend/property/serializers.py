from rest_framework import serializers
from .models import Property, PropertyImage

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ('image',)

class PropertySerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(required=True, max_digits=6, decimal_places=2)
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = ['id', 'name', 'owner_first_name', 'owner_last_name', 'location', 'from_date', 'to_date', 'guests', 'number_of_bedrooms', 'number_of_washrooms', 'contact_number', 'email', 'amenities', 'price', 'images']

class PropertyUpdateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False)
    location = serializers.CharField(required=False)
    from_date = serializers.DateField(required=False)
    to_date = serializers.DateField(required=False)
    guests = serializers.IntegerField(required=False)
    number_of_bedrooms = serializers.IntegerField(required=False)
    number_of_washrooms = serializers.IntegerField(required=False)
    contact_number = serializers.CharField(required=False)
    amenities = serializers.CharField(required=False)
    price = serializers.DecimalField(required=False, max_digits=6, decimal_places=2)
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = ['id', 'name', 'owner_first_name', 'owner_last_name', 'location', 'from_date', 'to_date', 'guests', 'number_of_bedrooms', 'number_of_washrooms', 'contact_number', 'email', 'amenities', 'price', 'images']
