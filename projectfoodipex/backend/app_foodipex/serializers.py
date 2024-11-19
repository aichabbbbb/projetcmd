from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from .models import Profile, Restaurant, ProfilePicture, City
from rest_framework import serializers
from django.core.files.base import ContentFile
import base64
import uuid

User = get_user_model()

class RestaurantSerializer(serializers.ModelSerializer):
    city = serializers.CharField(source='ville')  # Assurez-vous que 'ville' est le nom du champ pour la ville dans votre modèle Restaurant

    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'city']  # Inclure le champ 'city'

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name']  # Inclure le champ 'id' et 'name'


class ProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfilePicture
        fields = ['image_url']

class ProfileSerializer(serializers.ModelSerializer):
    restaurant = RestaurantSerializer(many=True ,required=False)
    profile_picture = ProfilePictureSerializer(required=False)

    class Meta:
        model = Profile
        fields = ['restaurants', 'profile_picture']  # Include the image field


class PermissionSerializer(serializers.ModelSerializer):
    app_label = serializers.SerializerMethodField()
    model = serializers.SerializerMethodField()

    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename', 'app_label', 'model']

    def get_app_label(self, obj):
        return obj.content_type.app_label

    def get_model(self, obj):
        return obj.content_type.model

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']


class GroupDetailSerializer(serializers.ModelSerializer):
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ['id', 'name', 'permissions']

    def get_permissions(self, obj):
        permissions = obj.permissions.all()
        return PermissionSerializer(permissions, many=True).data

    def update(self, instance, validated_data):
        # Mettre à jour le nom du groupe
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        return instance
from rest_framework import serializers
from django.contrib.auth.models import Group, Permission
from .models import User, Profile, Restaurant, ProfilePicture
from django.core.files.base import ContentFile
import base64
import uuid

from rest_framework import serializers
from django.contrib.auth.models import Group, Permission
from .models import User, Profile, ProfilePicture, Restaurant
import uuid
from django.core.files.base import ContentFile
import base64

class UserSerializer(serializers.ModelSerializer):
    groups = serializers.ListField(child=serializers.CharField(), write_only=True)
    group_names = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()
    restaurant_names = serializers.ListField(child=serializers.CharField(), write_only=True, required=False, allow_null=True)
    restaurant_cities = serializers.ListField(child=serializers.CharField(), write_only=True, required=False, allow_null=True)
    restaurant_details = serializers.SerializerMethodField()
    profile_picture = serializers.ImageField(source='profile.profile_picture.image_url', required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password',
                  'is_active', 'is_superuser', 'is_staff', 'groups', 'group_names',
                  'permissions', 'restaurant_names', 'restaurant_cities', 'profile_picture', 'restaurant_details']

    def get_group_names(self, obj):
        return [group.name for group in obj.groups.all()]

    def get_permissions(self, obj):
        groups = obj.groups.all()
        permissions = Permission.objects.filter(group__in=groups).distinct()
        return PermissionSerializer(permissions, many=True).data

    def get_restaurant_details(self, obj):
        profile = Profile.objects.filter(user=obj).first()
        if profile:
            return [{'name': restaurant.name, 'city': restaurant.ville} for restaurant in profile.restaurants.all()]
        return []

    def handle_uploaded_image(self, base64_image):
        format, imgstr = base64_image.split(';base64,')
        ext = format.split('/')[-1]
        image = ContentFile(base64.b64decode(imgstr), name=f"{uuid.uuid4()}.{ext}")
        return image

    def create(self, validated_data):
        groups_data = validated_data.pop('groups', [])
        restaurant_names = validated_data.pop('restaurant_names', [])
        restaurant_cities = validated_data.pop('restaurant_cities', [])
        password = validated_data.pop('password', None)
        profile_picture_data = validated_data.pop('profile_picture', None)

        # Générer un username unique basé sur l'email
        email = validated_data.get('email')
        username = email.split('@')[0] + str(User.objects.count() + 1)

        # Création de l'utilisateur avec username
        user = User(username=username, **validated_data)
        if password:
            user.set_password(password)
        user.save()

        # Créer un profil automatiquement
        profile = Profile.objects.create(user=user)

        # Gérer les groupes
        if groups_data:
            groups = Group.objects.filter(name__in=groups_data)
            user.groups.set(groups)
            permissions = Permission.objects.filter(group__in=groups)
            user.user_permissions.set(permissions)

        # Gérer les restaurants
        if restaurant_names and restaurant_cities:
            for name, city in zip(restaurant_names, restaurant_cities):
                restaurant, _ = Restaurant.objects.get_or_create(name=name, ville=city)
                profile.restaurants.add(restaurant)

        # Gérer l'image du profil (facultatif)
        if profile_picture_data:
            profile_picture = self.handle_uploaded_image(profile_picture_data)
            ProfilePicture.objects.create(profile=profile, image=profile_picture)

        return user

    def update(self, instance, validated_data):
        groups_data = validated_data.pop('groups', [])
        restaurant_names = validated_data.pop('restaurant_names', [])
        restaurant_cities = validated_data.pop('restaurant_cities', [])
        password = validated_data.pop('password', None)
        profile_picture_data = validated_data.pop('profile_picture', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()

        if groups_data:
            groups = Group.objects.filter(name__in=groups_data)
            instance.groups.set(groups)
            permissions = Permission.objects.filter(group__in=groups)
            instance.user_permissions.set(permissions)

        # Gérer les restaurants
        profile, _ = Profile.objects.get_or_create(user=instance)
        profile.restaurants.clear()

        for name, city in zip(restaurant_names, restaurant_cities):
            restaurant, _ = Restaurant.objects.get_or_create(name=name, ville=city)
            profile.restaurants.add(restaurant)

        profile.save()

        # Gérer l'image du profil (facultatif)
        if profile_picture_data:
            profile_picture = self.handle_uploaded_image(profile_picture_data)
            ProfilePicture.objects.update_or_create(profile=profile, defaults={'image': profile_picture})

        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        profile = Profile.objects.filter(user=instance).first()
        if profile:
            representation['restaurant_names'] = [restaurant.name for restaurant in profile.restaurants.all()]
            representation['restaurant_details'] = self.get_restaurant_details(instance)
        return representation
