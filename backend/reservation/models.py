from django.db import models

# Create your models here.
from accounts.models import CustomUser
from property.models import Property


class Reservation(models.Model):
    PENDING = 'Pending'
    APPROVED = 'Approved'
    DENIED = 'Denied'
    CANCELED = 'Canceled'
    TERMINATED = 'Terminated'
    COMPELETED = 'Completed'
    EXPIRED = 'Expired'
    PENDING_CANCEL = 'Pending Cancel'

    RESERVATION_STATES = [
        (PENDING, 'Pending'),
        (APPROVED, 'Approved'),
        (DENIED, 'Denied'),
        (CANCELED, 'Canceled'),
        (TERMINATED, 'Terminated'),
        (COMPELETED, 'Completed'),
        (EXPIRED, 'Expired'),
        (PENDING_CANCEL, 'Pending Cancel'),
    ]
    
    ACTION_CHOICES = [
        ('approve', 'Approve'),
        ('deny', 'Deny'),
        ('approve_cancel', 'Approve Cancel'),
        ('deny_cancel', 'Deny Cancel'),
        ('terminate', 'Terminate'),
    ]
        
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    property_name = models.CharField(max_length=255)
    from_date = models.DateField()
    to_date = models.DateField()
    state = models.CharField(max_length=14, choices=RESERVATION_STATES, default=PENDING)
    action = models.CharField(max_length=15, choices=ACTION_CHOICES, blank=True, null=True)

