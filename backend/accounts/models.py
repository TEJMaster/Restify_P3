from django.db import models

# Create your models here.

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField
import os, uuid

from django.core.files import File
from django.conf import settings


def unique_avatar_path(instance, filename):
    ext = filename.split('.')[-1]
    new_filename = f'{uuid.uuid4()}.{ext}'
    return f'avatars/{new_filename}'


class CustomUser(AbstractUser):
    avatar = models.ImageField(upload_to=unique_avatar_path, blank=True)
    phone_number = PhoneNumberField(null=True, blank=True)
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=_('groups'),
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name="%(app_label)s_%(class)s_related",
        related_query_name="%(app_label)s_%(class)ss",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name="%(app_label)s_%(class)s_related",
        related_query_name="%(app_label)s_%(class)ss",
    )
    
    def save(self, *args, **kwargs):
        if not self.pk:  # Check if the user is new (not yet saved to the database)
            super().save(*args, **kwargs)  # Save the user first to generate a primary key (required for saving files)
            
            if not self.avatar:  # Check if the avatar is not provided
                default_avatar_path = os.path.join(settings.BASE_DIR, 'accounts', 'images', 'default_avatar.png')
                with open(default_avatar_path, 'rb') as default_avatar:
                    unique_filename = unique_avatar_path(self, 'default_avatar.png')
                    self.avatar.save(unique_filename, File(default_avatar), save=False)
        
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username

