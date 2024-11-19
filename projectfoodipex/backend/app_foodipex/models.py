from django.contrib.auth.models import User, Group, Permission
from django.db import models

def upload_to(instance, filename):
    return f'profile_pictures/{instance.profile.user.username}/{filename}'

class GroupPermission(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=False)

    class Meta:
        unique_together = ('group', 'permission')

class Restaurant(models.Model):
    id = models.IntegerField(db_column='IDResto', primary_key=True)
    name = models.CharField(db_column='NomResto', max_length=255)
    ville = models.CharField(db_column='Ville', max_length=255)  # Ajout du champ ville

    class Meta:
        db_table = 'Restaurant'
        managed = False  # Si vous ne gérez pas la base de données avec Django

    def __str__(self):
        return self.name

# Nouveau modèle pour les Villes
class City(models.Model):
    name = models.CharField(max_length=255, unique=True)  # Assurez-vous que le nom de la ville est unique

    class Meta:
        db_table = 'City'
        managed = True  # Gérer ce modèle avec Django

    def __str__(self):
        return self.name

    @classmethod
    def populate_cities(cls):
        # Efface d'abord toutes les villes existantes pour éviter les doublons
        cls.objects.all().delete()

        # Récupère toutes les villes distinctes à partir du modèle Restaurant
        unique_cities = Restaurant.objects.values_list('ville', flat=True).distinct()

        # Crée des instances du modèle City
        for city_name in unique_cities:
            if city_name:  # Vérifie que le nom de la ville n'est pas vide
                cls.objects.get_or_create(name=city_name)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    restaurants = models.ManyToManyField(Restaurant, related_name='profiles', blank=True, null=True)  # Change here to ManyToManyField


    def __str__(self):
        return f"{self.user.username}'s Profile"

class ProfilePicture(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='profile_picture')
    image_url = models.ImageField(upload_to=upload_to, blank=True, null=True)

    def __str__(self):
        return f"{self.profile.user.username}'s Profile Picture"
