from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import check_password
from django.contrib.contenttypes.models import ContentType
from django.views import View
from rest_framework import status, viewsets, generics
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.http import JsonResponse, Http404
from .serializers import UserSerializer, GroupSerializer, PermissionSerializer, RestaurantSerializer, \
    GroupDetailSerializer, ProfileSerializer, CitySerializer
from django.contrib.auth.models import Group, Permission
from .models import Profile, Restaurant, ProfilePicture, City
from rest_framework.decorators import api_view
from .models import  Restaurant
# Import the User model
User = get_user_model()


from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Profile  # Assuming you have a Profile model

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Profile  # Assuming you have a Profile model


@api_view(['POST'])
def login_view(request):
    # Retrieve request data
    email = request.data.get('email')
    password = request.data.get('password')

    # Initialize error messages
    email_incorrect = False
    password_incorrect = False

    # Check if the user exists with the given email
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        email_incorrect = True

    # Check password if email is correct
    if not email_incorrect:
        if not user.check_password(password):
            password_incorrect = True
    else:
        password_incorrect = True  # If email doesn't exist, consider password also incorrect

    # Generate appropriate error message based on results
    if email_incorrect and password_incorrect:
        return Response({'detail': 'Email and password are incorrect'}, status=status.HTTP_401_UNAUTHORIZED)
    elif email_incorrect:
        return Response({'detail': 'Incorrect email'}, status=status.HTTP_401_UNAUTHORIZED)
    elif password_incorrect:
        return Response({'detail': 'Incorrect password'}, status=status.HTTP_401_UNAUTHORIZED)

    # Successful authentication
    refresh = RefreshToken.for_user(user)

    # Remove profile-related logic for users without a profile
    try:
        profile = user.profile  # Access the related profile if it exists
        restaurant_data = [
            {
                'name': restaurant.name,
                'city': restaurant.ville  # Ensure 'ville' is the city field in the Restaurant model
            }
            for restaurant in profile.restaurants.all()
        ]  # Fetch related restaurants

        # Safely check if profile_picture exists
        profile_image = profile.profile_picture.image_url.url if hasattr(profile, 'profile_picture') and profile.profile_picture else None
    except Profile.DoesNotExist:
        # Allow login without profile
        restaurant_data = []  # No profile found, so no restaurants
        profile_image = None  # No profile image

    # Get user's groups and permissions
    group_names = [group.name for group in user.groups.all()]
    groups = Group.objects.filter(name__in=group_names).prefetch_related('permissions')
    permissions = Permission.objects.filter(group__in=groups).distinct()
    permissions_data = PermissionSerializer(permissions, many=True).data

    # Return the response with tokens, and user info (without requiring profile)
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'email': user.email,
        'id': user.id,  # Include user ID
        'is_superuser': user.is_superuser,
        'is_staff': user.is_staff,
        'restaurants': restaurant_data,  # Add restaurant names (if profile exists)
        'profile_image': profile_image,  # Add profile image URL (if profile exists)
        'groups': group_names,  # Add group names
        'permissions': permissions_data  # Add permissions
    }, status=status.HTTP_200_OK)




@api_view(['GET', 'PUT'])
def profile_view(request, user_id=None):  # Make user_id optional
    if request.method == 'GET':
        if user_id:  # If user_id is provided, get that specific user's profile
            user = get_object_or_404(User, id=user_id)
            profile = user.profile  # Access the related profile

            # Retrieve restaurant names and cities
            restaurant_data = [
                {'name': restaurant.name, 'city': restaurant.ville}
                for restaurant in profile.restaurants.all()
            ]

            # Check if profile_picture exists and access the URL
            if profile.profile_picture:
                profile_image = (
                    profile.profile_picture.image_url.url if hasattr(profile.profile_picture, 'image_url') else None
                )
            else:
                profile_image = None  # Set to None if there is no profile_picture

            # Retrieve user's group names
            group_names = [group.name for group in user.groups.all()]

            return Response({
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'id': user.id,
                'restaurants': restaurant_data,
                'profile_image': profile_image,
                'groups': group_names,
            }, status=status.HTTP_200_OK)

        else:  # If no user_id is provided, return all users
            try:
                users = User.objects.prefetch_related('profile__restaurants',
                                                      'groups')  # Get all users with related profiles and groups
                profiles_data = []
                for user in users:
                    profile = user.profile  # Access the user's profile
                    restaurant_data = [
                        {'name': restaurant.name, 'city': restaurant.ville}  # Get restaurant name and city
                        for restaurant in profile.restaurants.all()
                    ]
                    # Check if profile_picture exists and access the URL
                    if profile.profile_picture:
                        profile_image = (
                            profile.profile_picture.image_url.url if hasattr(profile.profile_picture,
                                                                             'image_url') else None
                        )
                    else:
                        profile_image = None  # Set to None if there is no profile_picture

                    # Retrieve user's group names
                    group_names = [group.name for group in user.groups.all()]  # Fetch related groups
                    profiles_data.append({
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'id': user.id,
                        'restaurants': restaurant_data,
                        'profile_image': profile_image,  # Add profile image URL or None
                        'groups': group_names,  # Include groups
                    })

                return Response(profiles_data, status=status.HTTP_200_OK)

            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)





    elif request.method == 'PUT':
        if not user_id:  # If user_id is not provided, return an error
            return Response({'detail': 'User ID is required for updating a profile.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
            profile = user.profile  # Access the related profile

            # Update username and email if provided
            email = request.data.get('email')
            first_name = request.data.get('first_name')
            last_name = request.data.get('last_name')

            if email:
                user.email = email
            if first_name:  # Update first name if provided
                user.first_name = first_name
            if last_name:  # Update last name if provided
                user.last_name = last_name

            # Save the updated user object only once
            user.save()

            # Update profile picture if provided
            if 'profile_picture' in request.FILES:
                if hasattr(profile, 'profile_picture'):
                    profile_picture = profile.profile_picture
                    profile_picture.image_url = request.FILES['profile_picture']
                    profile_picture.save()
                else:
                    ProfilePicture.objects.create(
                        profile=profile,
                        image_url=request.FILES['profile_picture']
                    )

            # Handle password update
            current_password = request.data.get('current_password')
            new_password = request.data.get('new_password')

            if current_password and new_password:
                # Check if the current password is correct
                if not check_password(current_password, user.password):
                    return Response({'detail': 'Current password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

                # Set the new password
                user.set_password(new_password)
                user.save()

            # Return updated profile data without changing restaurants
            updated_restaurants = profile.restaurants.all()
            restaurant_data = [
                {"id": restaurant.id, "name": restaurant.name} for restaurant in updated_restaurants
            ]

            return Response({
                "email": user.email,
                'first_name': user.first_name,  # Include first name
                'last_name': user.last_name,  # Include last name
                "restaurants": restaurant_data,  # Keep the same restaurant data
                "profile_picture": {
                    "image_url": profile.profile_picture.image_url.url if profile.profile_picture else None,
                },
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Profile.DoesNotExist:
            return Response({'detail': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Fonction pour obtenir les jetons JWT pour un utilisateur
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }



# Check authentication status
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_auth(request):
    return Response({'isAuthenticated': True}, status=status.HTTP_200_OK)


# User API view class
class UserView(APIView):
    def get_user(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise Http404("User Does Not Exist")

    def get(self, request, pk=None):
        if pk:
            user = self.get_user(pk)
            serializer = UserSerializer(user)
        else:
            users = User.objects.all().prefetch_related('profile__restaurants')
            serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)

        email = request.data.get('email')
        if User.objects.filter(email=email).exists():
            return Response({"error": "L'email existe déjà."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate the serializer data
        if serializer.is_valid():
            user = serializer.save()  # Sauvegarder l'utilisateur

            # Créer un profil pour le nouvel utilisateur automatiquement
            Profile.objects.create(user=user)

            # Gérer les détails des restaurants s'ils sont fournis
            if 'restaurant_details' in request.data:
                profile = user.profile  # Obtenir le profil nouvellement créé
                for resto_data in request.data['restaurant_details']:
                    if 'id' in resto_data and resto_data['id']:  # Vérifier si un ID est fourni
                        restaurant, created = Restaurant.objects.get_or_create(
                            id=resto_data['id'],
                            defaults={'name': resto_data['name'], 'ville': resto_data['city']}
                        )
                    else:
                        # Créer un nouveau restaurant si aucun ID n'est fourni
                        restaurant = Restaurant.objects.create(name=resto_data['name'], ville=resto_data['city'])

                    profile.restaurants.add(restaurant)  # Ajouter le restaurant au profil

            user_data = UserSerializer(user).data  # Obtenir les données de l'utilisateur créé
            return Response({
                "message": "Utilisateur créé avec succès.",
                "user": user_data  # Détails de l'utilisateur créé
            }, status=status.HTTP_201_CREATED)

        return Response({
            "error": "Échec de l'ajout de l'utilisateur",
            "details": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        user_to_update = self.get_user(pk)
        serializer = UserSerializer(instance=user_to_update, data=request.data, partial=True)

        # Vérifier si l'utilisateur a un profil, sinon en créer un
        if not hasattr(user_to_update, 'profile'):
            Profile.objects.create(user=user_to_update)

        if 'email' in request.data and request.data['email'] != user_to_update.email:
            if User.objects.filter(email=request.data['email']).exists():
                return Response({"error": "L'email existe déjà."}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            user = serializer.save()

            # Traitement des restaurants
            if 'restaurant_details' in request.data:
                # Effacer les anciens restaurants associés à l'utilisateur
                user.profile.restaurants.clear()

                # Ajouter les nouveaux restaurants
                for resto_data in request.data['restaurant_details']:
                    restaurant_id = resto_data.get('id')  # Utiliser .get() pour éviter le KeyError
                    restaurant_name = resto_data.get('name')
                    restaurant_city = resto_data.get('city')

                    if restaurant_id:
                        # Tenter de récupérer ou de créer le restaurant avec l'ID
                        restaurant, created = Restaurant.objects.get_or_create(
                            id=restaurant_id,
                            defaults={'name': restaurant_name, 'ville': restaurant_city}
                        )
                        user.profile.restaurants.add(restaurant)
                    else:
                        # Si l'ID est manquant, créer le restaurant avec le nom et la ville
                        if restaurant_name and restaurant_city:
                            restaurant, created = Restaurant.objects.get_or_create(
                                name=restaurant_name,
                                defaults={'ville': restaurant_city}
                            )
                            user.profile.restaurants.add(restaurant)
                        else:
                            # Ignorer si les données nécessaires manquent
                            continue

            return Response({"message": "Utilisateur mis à jour avec succès."}, status=status.HTTP_200_OK)

        return Response({"error": "Échec de la mise à jour de l'utilisateur", "details": serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        user_to_delete = self.get_user(pk)
        user_to_delete.delete()
        return Response({"message": "Utilisateur supprimé avec succès."}, status=status.HTTP_204_NO_CONTENT)

class GroupView(APIView):
    def get(self, request):
        groups = Group.objects.all()
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = GroupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        group_id = request.data.get('id')
        group = get_object_or_404(Group, id=group_id)
        serializer = GroupSerializer(group, data=request.data, partial=True)  # partial=True permet de faire des mises à jour partielles
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        group_id = request.data.get('id')
        group = get_object_or_404(Group, id=group_id)
        group.delete()
        return Response({'status': 'success'}, status=status.HTTP_200_OK)

class GroupDetailView(generics.RetrieveUpdateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupDetailSerializer




class GroupPermissionsView(APIView):
    def get(self, request, group_id, permission_id=None):
        group = get_object_or_404(Group, id=group_id)

        if permission_id:
            # Récupérer une permission spécifique par ID
            permission = get_object_or_404(Permission, id=permission_id)
            serializer = PermissionSerializer(permission)
            return Response(serializer.data)
        else:
            # Récupérer toutes les permissions et indiquer leur état (actif/inactif)
            permissions = Permission.objects.all()
            serializer = PermissionSerializer(permissions, many=True)
            permissions_data = serializer.data

            # Ajouter un champ is_active pour indiquer si la permission est active dans le groupe
            for permission_data in permissions_data:
                permission_data['is_active'] = group.permissions.filter(id=permission_data['id']).exists()

            return Response(permissions_data)

    def post(self, request, group_id):
        group = get_object_or_404(Group, id=group_id)
        data = request.data

        # Récupérer le nom de la nouvelle permission, l'app_label et le modèle
        new_permission_name = data.get('name')
        app_label = data.get('app_label')
        model = data.get('model')
        is_active = data.get('is_active', False)

        if new_permission_name and app_label and model:
            try:
                # Obtenir le content type correspondant à l'app_label et au modèle
                content_type = ContentType.objects.get(app_label=app_label, model=model)

                # Utiliser le codename et le name exactement comme dans l'exemple
                codename = data.get('codename')  # Vous devez envoyer le codename exact avec la requête
                permission_name = new_permission_name

                # Créer ou récupérer la permission
                permission, created = Permission.objects.get_or_create(
                    codename=codename,
                    name=permission_name,
                    content_type=content_type
                )

                # Mettre à jour l'état de la permission
                if is_active:
                    group.permissions.add(permission)
                else:
                    group.permissions.remove(permission)

                return Response({'status': 'Permission created/updated and added/removed from group'},
                                status=status.HTTP_201_CREATED)

            except ContentType.DoesNotExist:
                return Response({'error': 'Invalid app_label or model'}, status=status.HTTP_400_BAD_REQUEST)

        # Mettre à jour les permissions existantes
        if 'permissions' in data:
            # Mettre à jour les permissions existantes
            for perm_data in data['permissions']:
                permission = get_object_or_404(Permission, id=perm_data['id'])

                if perm_data.get('is_active'):
                    group.permissions.add(permission)  # Activer la permission
                else:
                    group.permissions.remove(permission)  # Désactiver la permission

            return Response({'status': 'Permissions updated successfully'}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, group_id):
        group = get_object_or_404(Group, id=group_id)

        # Assurez-vous que request.data est une liste
        if not isinstance(request.data, list):
            return Response({'error': 'Invalid data format, expected a list of dictionaries.'},
                            status=status.HTTP_400_BAD_REQUEST)

        print('Received data:', request.data)  # Ajoutez un print pour vérifier les données reçues

        for perm_data in request.data:
            try:
                permission = get_object_or_404(Permission, id=perm_data['id'])
                if perm_data.get('is_active'):
                    if not group.permissions.filter(id=permission.id).exists():
                        group.permissions.add(permission)
                else:
                    if group.permissions.filter(id=permission.id).exists():
                        group.permissions.remove(permission)
            except KeyError:
                return Response({'error': 'Invalid data format, each permission must have an id and is_active field.'},
                                status=status.HTTP_400_BAD_REQUEST)

        return Response({'status': 'updated'}, status=status.HTTP_200_OK)

    def delete(self, request, group_id, permission_id=None):
        # Retrieve the group
        group = get_object_or_404(Group, id=group_id)

        if permission_id:
            # Retrieve the permission
            permission = get_object_or_404(Permission, id=permission_id)

            # Remove the permission from the group
            if permission in group.permissions.all():
                group.permissions.remove(permission)

            # Check if the permission is not associated with any groups
            if not Permission.objects.filter(id=permission_id, group__isnull=False).exists():
                # Delete the permission from the database if it's not associated with any groups
                permission.delete()

            return Response({'status': 'deleted'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'error': 'Permission ID required for delete'}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, group_id, permission_id):
        group = get_object_or_404(Group, id=group_id)
        permission = get_object_or_404(Permission, id=permission_id)

        data = request.data
        name = data.get('name')
        app_label = data.get('app_label')

        if name:
            permission.name = name
        if app_label:
            permission.app_label = app_label

        permission.save()

        # Update the permissions for the group
        if permission in group.permissions.all():
            group.permissions.add(permission)

        serializer = PermissionSerializer(permission)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RestaurantListView(generics.ListAPIView):
    serializer_class = RestaurantSerializer
    pagination_class = None

    def get_queryset(self):
        ville = self.kwargs.get('city')  # Récupère la ville à partir de l'URL
        if ville:
            return Restaurant.objects.filter(ville__iexact=ville)  # Filtre les restaurants par 'ville'
        return Restaurant.objects.all()  # Retourne tous les restaurants si la ville n'est pas spécifiée

    def get(self, request, *args, **kwargs):
        # Vérifie si la ville est spécifiée dans l'URL
        if 'city' in kwargs:
            return super().get(request, *args, **kwargs)
        else:
            # Retourne tous les restaurants
            return super().get(request, *args, **kwargs)


# Si tu veux récupérer des villes dans un autre contexte
class CityListView(generics.ListAPIView):
    serializer_class = CitySerializer
    pagination_class = None

    def get_queryset(self):
        # Récupère toutes les villes
        return City.objects.all()





class UserPermissionsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'User not authenticated'}, status=403)
        permissions = user.user_permissions.all()  # Gets permissions directly associated with the user
        serializer = PermissionSerializer(permissions, many=True)
        return Response(serializer.data)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Profile, ProfilePicture, Restaurant

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Profile, ProfilePicture, Restaurant

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Profile, User, Restaurant, ProfilePicture


class ProfileView(APIView):
    # Retrieve all profiles or a specific profile by ID
    def get(self, request, profile_id=None):
        try:
            if profile_id:
                # Fetch a specific profile by ID
                profile = Profile.objects.get(id=profile_id)
                return Response(self._serialize_profile(profile), status=status.HTTP_200_OK)  # Wrap in Response

            # Fetch all profiles if no profile_id is provided
            profiles = Profile.objects.all()
            all_profiles_data = [self._serialize_profile(profile) for profile in profiles]
            return Response(all_profiles_data, status=status.HTTP_200_OK)

        except Profile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        try:
            user = User.objects.get(username=request.data.get('username'))  # Assuming username is provided
            profile = Profile.objects.get(user=user)

            # Update associated restaurants
            restaurant_ids = request.data.get('restaurant_ids', [])
            if isinstance(restaurant_ids, str):
                restaurant_ids = [restaurant_ids]  # Convert to list if it's a single string

            if restaurant_ids:
                # Update associated restaurants for the profile
                restaurants = Restaurant.objects.filter(id__in=restaurant_ids)
                profile.restaurants.set(restaurants)  # Replace existing restaurants with the new ones
                profile.save()

            # Update profile picture
            if 'profile_picture' in request.FILES:
                if hasattr(profile, 'profile_picture'):
                    profile_picture = profile.profile_picture
                    profile_picture.image_url = request.FILES['profile_picture']
                    profile_picture.save()
                else:
                    ProfilePicture.objects.create(
                        profile=profile,
                        image_url=request.FILES['profile_picture']
                    )

            # Return updated profile data
            updated_restaurants = profile.restaurants.all()
            restaurant_data = [
                {"id": restaurant.id, "name": restaurant.name} for restaurant in updated_restaurants
            ]

            return Response({
                "restaurants": restaurant_data,
                "profile_picture": {
                    "image_url": profile.profile_picture.image_url.url if profile.profile_picture and profile.profile_picture.image_url else None,
                }
            }, status=status.HTTP_200_OK)

        except Profile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    def _serialize_profile(self, profile):
        """Helper method to serialize a Profile instance."""
        restaurant_data = [
            {"id": restaurant.id, "name": restaurant.name} for restaurant in profile.restaurants.all()
        ]
        profile_picture_url = (
            profile.profile_picture.image_url.url
            if profile.profile_picture and profile.profile_picture.image_url else None
        )

        return {
            "user": profile.user.username,
            "restaurants": restaurant_data,
            "profile_picture": {
                "image_url": profile_picture_url,
            }
        }




class GetCAByYearMonth(APIView):
    def get(self, request, *args, **kwargs):
        # Helper function to execute the query
        def execute_query(query):
            with connection.cursor() as cursor:
                cursor.execute(query)
                return cursor.fetchall()

        # SQL query to fetch data grouped by year and month
        query = '''
        SELECT 
            YEAR(DATE_TRSC_0) AS Année, 
            DATENAME(month, DATE_TRSC_0) AS Mois, 
            SUM(CA_0) AS CA 
        FROM FOODIPEX.YCAMCDO 
        INNER JOIN FOODIPEX.BPCUSTOMER ON BPCUSTOMER.BPCNUM_0 = YCAMCDO.BPCNUM_0
        INNER JOIN FOODIPEX.BPADDRESS ON BPANUM_0 = BPCUSTOMER.BPCNUM_0
        GROUP BY 
            YEAR(DATE_TRSC_0), 
            MONTH(DATE_TRSC_0), 
            DATENAME(month, DATE_TRSC_0)
        ORDER BY 
            YEAR(DATE_TRSC_0) DESC, 
            MONTH(DATE_TRSC_0) DESC
        '''

        # Execute the query
        rows = execute_query(query)

        # Format the results into a list of dictionaries
        results = [
            {
                'Année': row[0],
                'Mois': row[1].capitalize(),
                'CA': row[2]
            }
            for row in rows
        ]

        # Return the response with the formatted results
        result = {
            'achatfoodipex': results,
        }

        return Response(result, status=status.HTTP_200_OK)

class GetCFAchatFoodipex(APIView):
    def get(self, request, *args, **kwargs):
        # Helper function to execute a query and return results
        def execute_query(query):
            with connection.cursor() as cursor:
                cursor.execute(query)
                return cursor.fetchall()

        # SQL query for first view
        query1 = '''select year(DATE_TRSC_0) Année, DATENAME(month, DATE_TRSC_0) Mois, BPADDRESS.CTY_0 Ville, 
BPCUSTOMER.BPCNUM_0 [Code Restaurant], BPCNAM_0 Restaurant, Sum(CA_0) CA 
from FOODIPEX.YCAMCDO inner join FOODIPEX.BPCUSTOMER on BPCUSTOMER.BPCNUM_0 = YCAMCDO.BPCNUM_0
inner join FOODIPEX.BPADDRESS on BPANUM_0 = BPCUSTOMER.BPCNUM_0
group by year(DATE_TRSC_0), month(DATE_TRSC_0), DATENAME(month, DATE_TRSC_0), BPADDRESS.CTY_0, BPCUSTOMER.BPCNUM_0, BPCNAM_0
order by year(DATE_TRSC_0) desc, month(DATE_TRSC_0) desc, BPCUSTOMER.BPCNUM_0
        '''

        # Execute query
        rows1 = execute_query(query1)

        # Format the results for the first query
        results1 = [{'Année': row[0], 'Mois': row[1].capitalize(), 'Ville': row[2].capitalize(),
                      'CodeRestaurant': row[3], 'Restaurant': row[4].capitalize(), 'CA': row[5]} for row in rows1]

        # Combine the results into one response
        result = {
            'achatfoodipex': results1,
        }

        return Response(result, status=status.HTTP_200_OK)

class GetCFAVenderesto(APIView):
    def get(self, request, *args, **kwargs):
        # Helper function to execute a query and return results
        def execute_query(query):
            with connection.cursor() as cursor:
                cursor.execute(query)
                return cursor.fetchall()

        # SQL query for second view
        query2 = '''
           select year(ACCDAT_0) Année, DATENAME(month, ACCDAT_0) Mois, BPADDRESS.CTY_0 Ville, BPCUSTOMER.BPCNUM_0 [Code Restaurant], BPCNAM_0 Restaurant, Sum(AMTNOT_0) CA 
from FOODIPEX.SINVOICE inner join FOODIPEX.BPCUSTOMER on BPCUSTOMER.BPCNUM_0 = SINVOICE.BPR_0
inner join FOODIPEX.BPADDRESS on BPANUM_0 = BPCNUM_0
where year(ACCDAT_0)  <= year(getdate()) and BCGCOD_0 = 'MC' and BPATYP_0 = 1
group by year(ACCDAT_0), month(ACCDAT_0), DATENAME(month, ACCDAT_0), BPADDRESS.CTY_0, BPCUSTOMER.BPCNUM_0, BPCNAM_0
order by year(ACCDAT_0), month(ACCDAT_0), BPCNAM_0
        '''

        # Execute query
        rows2 = execute_query(query2)

        # Format the results for the second query
        results2 = [{'Année': row[0], 'Mois': row[1].capitalize(), 'Ville': row[2].capitalize(),
                      'CodeRestaurant': row[3], 'Restaurant': row[4].capitalize(), 'CA': row[5]} for row in rows2]

        # Combine the results into one response
        result = {
            'venderesto': results2,
        }

        return Response(result, status=status.HTTP_200_OK)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection

class GetTopGuests(APIView):
    def get(self, request, *args, **kwargs):
        ville = request.query_params.get('ville', None)
        restaurant = request.query_params.get('restaurant', None)

        def execute_query(query, params):
            with connection.cursor() as cursor:
                cursor.execute(query, params)
                return cursor.fetchall()

        # SQL query for fetching the top record by guests
        query = '''
        SELECT TOP 1 
            DATE_TRSC_0, 
            YEAR(DATE_TRSC_0) AS Année, 
            DATENAME(month, DATE_TRSC_0) AS Mois, 
            BPADDRESS.CTY_0 AS Ville, 
            BPCUSTOMER.BPCNUM_0 AS [Code Restaurant], 
            BPCUSTOMER.BPCNAM_0 AS Restaurant, 
            YCAMCDO.GUESTS_0 AS Couverts
        FROM FOODIPEX.YCAMCDO 
        INNER JOIN FOODIPEX.BPCUSTOMER 
            ON BPCUSTOMER.BPCNUM_0 = YCAMCDO.BPCNUM_0
        INNER JOIN FOODIPEX.BPADDRESS 
            ON BPADDRESS.BPANUM_0 = BPCUSTOMER.BPCNUM_0
        '''

        params = []

        # Dynamically add WHERE clauses based on query parameters
        if ville:
            query += ' WHERE BPADDRESS.CTY_0 = %s'
            params.append(ville)

        if restaurant:
            if ville:
                query += ' AND BPCUSTOMER.BPCNAM_0 = %s'
            else:
                query += ' WHERE BPCUSTOMER.BPCNAM_0 = %s'
            params.append(restaurant)

        # Add the ORDER BY clause
        query += ' ORDER BY YCAMCDO.GUESTS_0 DESC'

        try:
            # Execute the query with parameters
            rows = execute_query(query, params)

            # Format the result
            if rows:
                result = [{
                    'DateTransaction': rows[0][0],
                    'Année': rows[0][1],
                    'Mois': rows[0][2].capitalize(),
                    'Ville': rows[0][3].capitalize(),
                    'CodeRestaurant': rows[0][4],
                    'Restaurant': rows[0][5].capitalize(),
                    'Couverts': rows[0][6]
                }]
                return Response({'GetTopGuests': result}, status=status.HTTP_200_OK)
            else:
                return Response({'GetTopGuests': []}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class GetTopTransactions(APIView):
    def get(self, request, *args, **kwargs):
        ville = request.query_params.get('ville', None)
        restaurant = request.query_params.get('restaurant', None)

        def execute_query(query, params):
            with connection.cursor() as cursor:
                cursor.execute(query, params)
                return cursor.fetchall()

        # SQL query to fetch top transactions
        query = '''
        SELECT TOP 1 
            DATE_TRSC_0 AS Date, 
            LEFT(CONVERT(VARCHAR, DATE_TRSC_0, 23), 7) AS Mois, 
            BPADDRESS.CTY_0 AS Ville, 
            BPCUSTOMER.BPCNUM_0 AS [Code Restaurant], 
            BPCUSTOMER.BPCNAM_0 AS Restaurant, 
            YCAMCDO.GUESTS_0 AS [Nombre de couverts], 
            YCAMCDO.CA_0 AS CA 
        FROM 
            FOODIPEX.YCAMCDO 
        INNER JOIN 
            FOODIPEX.BPCUSTOMER ON BPCUSTOMER.BPCNUM_0 = YCAMCDO.BPCNUM_0 
        INNER JOIN 
            FOODIPEX.BPADDRESS ON BPADDRESS.BPANUM_0 = BPCUSTOMER.BPCNUM_0
        '''

        params = []

        if ville:
            query += ' WHERE BPADDRESS.CTY_0 = %s'
            params.append(ville)

        if restaurant:
            if ville:
                query += ' AND BPCUSTOMER.BPCNAM_0 = %s'
            else:
                query += ' WHERE BPCUSTOMER.BPCNAM_0 = %s'
            params.append(restaurant)

        query += ' ORDER BY DATE_TRSC_0 DESC, BPCUSTOMER.BPCNUM_0'

        try:
            # Execute the query
            rows = execute_query(query, params)

            # Format the result
            if rows:
                result = [{
                    'Date': rows[0][0],
                    'Mois': rows[0][1],
                    'Ville': rows[0][2].capitalize(),
                    'CodeRestaurant': rows[0][3],
                    'Restaurant': rows[0][4].capitalize(),
                    'NombreCouverts': rows[0][5],
                    'CA': rows[0][6]
                }]
                return Response({'TopTransactions': result}, status=status.HTTP_200_OK)
            else:
                return Response({'TopTransactions': []}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection

class ReptureStock(APIView):
    def get(self, request, *args, **kwargs):
        # Define the raw SQL queries

        # Helper function to execute a query and return results
        def execute_query(query):
            with connection.cursor() as cursor:
                cursor.execute(query)
                return cursor.fetchall()


        # Query for 'Nombre de couverts', 'CA', and 'Ticket Moyen'
        couvert_query = """
select DATE_TRSC_0 Date, left(convert(varchar, DATE_TRSC_0, 23),7) Mois, BPADDRESS.CTY_0 Ville, 
BPCUSTOMER.BPCNUM_0 [Code Restaurant], BPCNAM_0 Restaurant, GUESTS_0 [Nombre de couverts], CA_0 CA 
from FOODIPEX.YCAMCDO inner join FOODIPEX.BPCUSTOMER on BPCUSTOMER.BPCNUM_0 = YCAMCDO.BPCNUM_0
inner join FOODIPEX.BPADDRESS on BPANUM_0 = BPCUSTOMER.BPCNUM_0
order by DATE_TRSC_0 desc, BPCUSTOMER.BPCNUM_0
        """

        # Execute the rupture stock query

        # Execute the couvert query
        # Execute query
        rows2 = execute_query(couvert_query)

        # Format the results for the second query
        results2 = [{'Date': row[0], 'Mois': row[1].capitalize(), 'Ville': row[2].capitalize(),
                     'CodeRestaurant': row[3], 'Restaurant': row[4].capitalize(),'Nomcover': row[5] ,'CA': row[6]} for row in rows2]

        # Combine the results into one response
        result = {
            'NombreCouverJournalier': results2,
        }

        return Response(result, status=status.HTTP_200_OK)


class TotalRotationStockView(APIView):
    def get(self, request, *args, **kwargs):
        # SQL query to calculate the total rotation stock
        sql_query = """
            SELECT 
                (SUM(OPENINGSTOCK_0) + SUM(CLOSINGSTOCK_0)) * SUM(PRICEPERCASE_0) / 2 AS total_rotation_stock
            FROM 
                FOODIPEX.YSTOCKMCDO;
        """

        # Execute the SQL query
        with connection.cursor() as cursor:
            cursor.execute(sql_query)
            result = cursor.fetchone()

        # Create a response dictionary with total rotation stock
        response_data = {
            "total_rotation_stock": result[0] if result[0] is not None else 0  # Ensure there's no None
        }

        # Return the result as a JSON response
        return Response(response_data, status=status.HTTP_200_OK)



class TopStockArticlesView(APIView):
    def get(self, request, *args, **kwargs):
        # SQL query to get the top 10 articles by total stock
        sql_query = """
            SELECT TOP 10
                ARTICLE_0,
                OPENINGSTOCK_0, 
                CLOSINGSTOCK_0, 
                PRICEPERCASE_0,
                (OPENINGSTOCK_0 + CLOSINGSTOCK_0) AS TOTAL_STOCK
            FROM 
                FOODIPEX.YSTOCKMCDO 
            ORDER BY 
                TOTAL_STOCK DESC;
        """

        # Execute the SQL query
        with connection.cursor() as cursor:
            cursor.execute(sql_query)
            results = cursor.fetchall()  # Fetch all rows

        # Create a response list
        response_data = [
            {
                "article": row[0],
                "opening_stock": row[1],
                "closing_stock": row[2],
                "price_per_case": row[3],
                "total_stock": row[4]
            }
            for row in results
        ]

        # Return the result as a JSON response
        return Response(response_data, status=status.HTTP_200_OK)



class GetCFAchatFoodipexFlat(APIView):
    def get(self, request, *args, **kwargs):
        # Helper function to execute a query and return results
        def execute_query(query):
            with connection.cursor() as cursor:
                cursor.execute(query)
                return cursor.fetchall()

        # SQL query for flat results without grouping
        query = '''
            SELECT 
                YEAR(SINVOICE.ACCDAT_0) AS Année, 
                DATENAME(MONTH, SINVOICE.ACCDAT_0) AS Mois, 
                SUM(SINVOICE.AMTNOT_0) AS CA  
            FROM 
                FOODIPEX.SINVOICE 
            INNER JOIN 
                FOODIPEX.BPCUSTOMER ON FOODIPEX.BPCUSTOMER.BPCNUM_0 = FOODIPEX.SINVOICE.BPR_0
            INNER JOIN 
                FOODIPEX.BPADDRESS ON FOODIPEX.BPADDRESS.BPANUM_0 = FOODIPEX.BPCUSTOMER.BPCNUM_0
            WHERE 
                YEAR(SINVOICE.ACCDAT_0) <= YEAR(GETDATE()) 
                AND FOODIPEX.BPADDRESS.BPATYP_0 = 1   and BCGCOD_0 = 'MC' 
            GROUP BY 
                YEAR(SINVOICE.ACCDAT_0), 
                MONTH(SINVOICE.ACCDAT_0), 
                DATENAME(MONTH, SINVOICE.ACCDAT_0)
            ORDER BY 
                YEAR(SINVOICE.ACCDAT_0), 
                MONTH(SINVOICE.ACCDAT_0);
        '''

        # Execute query
        rows = execute_query(query)

        # Format the results for the flat query
        results = [{'Année': row[0], 'Mois': row[1].capitalize(), 'CA': row[2]} for row in rows]

        # Combine the results into one response
        result = {
            'GetCFAchatFoodipexFlat': results,
        }

        return Response(result, status=status.HTTP_200_OK)

class GetTop10RestaurantsByCA(APIView):
    def get(self, request, *args, **kwargs):
        # Helper function to execute a query and return results
        def execute_query(query):
            with connection.cursor() as cursor:
                cursor.execute(query)
                return cursor.fetchall()

        # SQL query for top 10 restaurants by CA
        query = '''
            SELECT TOP 5 
                YEAR(SINVOICE.ACCDAT_0) AS Année, 
                DATENAME(MONTH, SINVOICE.ACCDAT_0) AS Mois, 
                BPADDRESS.CTY_0 AS Ville, 
                BPCUSTOMER.BPCNUM_0 AS [Code Restaurant], 
                BPCNAM_0 AS Restaurant, 
                SUM(SINVOICE.AMTNOT_0) AS CA
            FROM 
                FOODIPEX.SINVOICE 
            INNER JOIN 
                FOODIPEX.BPCUSTOMER ON BPCUSTOMER.BPCNUM_0 = SINVOICE.BPR_0
            INNER JOIN 
                FOODIPEX.BPADDRESS ON BPADDRESS.BPANUM_0 = BPCUSTOMER.BPCNUM_0
            WHERE 
                YEAR(SINVOICE.ACCDAT_0) <= YEAR(GETDATE()) 
                AND BCGCOD_0 = 'MC' 
                AND BPADDRESS.BPATYP_0 = 1
            GROUP BY 
                YEAR(SINVOICE.ACCDAT_0), 
                MONTH(SINVOICE.ACCDAT_0), 
                DATENAME(MONTH, SINVOICE.ACCDAT_0), 
                BPADDRESS.CTY_0, 
                BPCUSTOMER.BPCNUM_0, 
                BPCNAM_0
            ORDER BY 
                SUM(SINVOICE.AMTNOT_0) DESC;
        '''

        # Execute query
        rows = execute_query(query)

        # Format the results
        results = [
            {
                'Année': row[0],
                'Mois': row[1].capitalize(),
                'Ville': row[2],
                'Code Restaurant': row[3],
                'Restaurant': row[4],
                'CA': row[5]
            }
            for row in rows
        ]

        # Combine the results into one response
        result = {
            'Top10RestaurantsByCA': results,
        }

        return Response(result, status=status.HTTP_200_OK)
class TickMoyen(APIView):
    def get(self, request, *args, **kwargs):
        # Get query parameters for filtering
        ville = request.query_params.get('ville', None)
        restaurant = request.query_params.get('restaurant', None)

        # Helper function to execute a query and return results
        def execute_query(query, params=None):
            with connection.cursor() as cursor:
                cursor.execute(query, params)
                return cursor.fetchall()

        # Base SQL query to fetch top transactions
        query = '''
      select top 1 year(DATE_TRSC_0) Année, DATENAME(month, DATE_TRSC_0) Mois, BPADDRESS.CTY_0 Ville, 
BPCUSTOMER.BPCNUM_0 [Code Restaurant], BPCNAM_0 Restaurant, Sum(CA_0) / Sum(GUESTS_0) [Ticket Moyen] 
from FOODIPEX.YCAMCDO inner join FOODIPEX.BPCUSTOMER on BPCUSTOMER.BPCNUM_0 = YCAMCDO.BPCNUM_0
inner join FOODIPEX.BPADDRESS on BPANUM_0 = BPCUSTOMER.BPCNUM_0  
        '''

        params = []

        # Add filters based on parameters
        if ville:
            query += ' AND BPADDRESS.CTY_0 = %s'
            params.append(ville)

        if restaurant:
            query += ' AND BPCNAM_0 = %s'
            params.append(restaurant)

        query += '''
        group by year(DATE_TRSC_0), month(DATE_TRSC_0), DATENAME(month, DATE_TRSC_0), BPADDRESS.CTY_0, BPCUSTOMER.BPCNUM_0, BPCNAM_0
order by year(DATE_TRSC_0) desc, month(DATE_TRSC_0) desc, BPCUSTOMER.BPCNUM_0
        '''

        try:
            # Execute the query with parameters
            rows = execute_query(query, params)

            # Format the result
            if rows:
                result = [{
                    'Année': rows[0][0],
                    'Mois': rows[0][1],
                    'Ville': rows[0][2].capitalize(),
                    'CodeRestaurant': rows[0][3],
                    'Restaurant': rows[0][4].capitalize(),
                    'TicketMoyen': rows[0][5],
                }]
                return Response({'tickmoyen': result}, status=status.HTTP_200_OK)
            else:
                return Response({'tickmoyen': []}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from datetime import datetime


class CAFoodipexView(APIView):
    def get(self, request, *args, **kwargs):
        def execute_query(query, params):
            with connection.cursor() as cursor:
                cursor.execute(query, params)
                return cursor.fetchone()

        date1_str = request.GET.get('date1', '2024-01-01')
        date2_str = request.GET.get('date2', '2024-12-31')

        try:
            date1 = datetime.strptime(date1_str, '%Y-%m-%d')
            date2 = datetime.strptime(date2_str, '%Y-%m-%d')

            query = '''
                SELECT SUM(SINVOICE.AMTNOT_0) AS CA_Foodipex
                FROM FOODIPEX.SINVOICE 
                INNER JOIN FOODIPEX.BPCUSTOMER ON BPCUSTOMER.BPCNUM_0 = SINVOICE.BPR_0
                INNER JOIN FOODIPEX.BPADDRESS ON BPADDRESS.BPANUM_0 = BPCUSTOMER.BPCNUM_0
                WHERE SINVOICE.ACCDAT_0 BETWEEN %s AND %s
                AND BCGCOD_0 = 'MC'
                AND BPADDRESS.BPATYP_0 = 1;
            '''
            row = execute_query(query, [date1, date2])

            if row:
                result = [{'ca_foodipex': row[0]}]
                return Response({'ca_foodipex': result}, status=status.HTTP_200_OK)
            else:
                return Response({'ca_foodipex': []}, status=status.HTTP_404_NOT_FOUND)

        except ValueError:
            return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class NombreDeRestaurantsView(APIView):
    def get(self, request, *args, **kwargs):
        # Helper function to execute a query and return results
        def execute_query(query, params):
            with connection.cursor() as cursor:
                cursor.execute(query, params)
                return cursor.fetchone()

        # Get Date1 and Date2 from the request (or default values)
        date1_str = request.GET.get('date1', '2024-01-01')  # Default to Jan 1, 2024
        date2_str = request.GET.get('date2', '2024-12-31')  # Default to Dec 31, 2024

        try:
            # Parse date strings into datetime objects
            date1 = datetime.strptime(date1_str, '%Y-%m-%d')
            date2 = datetime.strptime(date2_str, '%Y-%m-%d')

            # SQL query to count distinct restaurants
            query = '''
                SELECT COUNT(DISTINCT BPCUSTOMER.BPCNUM_0) AS Nombre_Restaurants
                FROM FOODIPEX.SINVOICE 
                INNER JOIN FOODIPEX.BPCUSTOMER ON BPCUSTOMER.BPCNUM_0 = SINVOICE.BPR_0
                INNER JOIN FOODIPEX.BPADDRESS ON BPADDRESS.BPANUM_0 = BPCUSTOMER.BPCNUM_0
                WHERE SINVOICE.ACCDAT_0 BETWEEN %s AND %s
                AND BCGCOD_0 = 'MC'
                AND BPADDRESS.BPATYP_0 = 1;
            '''
            row = execute_query(query, [date1, date2])

            # Format the result
            if row:
                result = [{'nombre_restaurants': row[0]}]
                return Response({'nombre_restaurants': result}, status=status.HTTP_200_OK)
            else:
                return Response({'nombre_restaurants': []}, status=status.HTTP_404_NOT_FOUND)

        except ValueError:
            return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CARestaurantsView(APIView):
    def get(self, request, *args, **kwargs):
        def execute_query(query, params):
            with connection.cursor() as cursor:
                cursor.execute(query, params)
                return cursor.fetchone()

        date1_str = request.GET.get('date1', '2024-01-01')
        date2_str = request.GET.get('date2', '2024-12-31')

        try:
            date1 = datetime.strptime(date1_str, '%Y-%m-%d')
            date2 = datetime.strptime(date2_str, '%Y-%m-%d')

            query = '''
                SELECT SUM(CA_0) AS CA_Restaurants
                FROM FOODIPEX.YCAMCDO 
                WHERE DATE_TRSC_0 BETWEEN %s AND %s;
            '''
            row = execute_query(query, [date1, date2])

            if row:
                result = [{'ca_restaurants': row[0]}]
                return Response({'ca_restaurants': result}, status=status.HTTP_200_OK)
            else:
                return Response({'ca_restaurants': []}, status=status.HTTP_404_NOT_FOUND)

        except ValueError:
            return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class NombreDeVillesView(APIView):
    def get(self, request, *args, **kwargs):
        # Helper function to execute a query and return results
        def execute_query(query, params):
            with connection.cursor() as cursor:
                cursor.execute(query, params)
                return cursor.fetchone()

        # Get Date1 and Date2 from the request (or default values)
        date1_str = request.GET.get('date1', '2024-01-01')  # Default to Jan 1, 2024
        date2_str = request.GET.get('date2', '2024-12-31')  # Default to Dec 31, 2024

        try:
            # Parse date strings into datetime objects
            date1 = datetime.strptime(date1_str, '%Y-%m-%d')
            date2 = datetime.strptime(date2_str, '%Y-%m-%d')

            # SQL query for counting distinct cities
            query = '''
                SELECT COUNT(DISTINCT BPADDRESS.CTY_0) AS Villes
                FROM FOODIPEX.SINVOICE 
                INNER JOIN FOODIPEX.BPCUSTOMER ON BPCUSTOMER.BPCNUM_0 = SINVOICE.BPR_0
                INNER JOIN FOODIPEX.BPADDRESS ON BPADDRESS.BPANUM_0 = BPCUSTOMER.BPCNUM_0
                WHERE SINVOICE.ACCDAT_0 BETWEEN %s AND %s
                AND BCGCOD_0 = 'MC'
                AND BPADDRESS.BPATYP_0 = 1;
            '''

            # Execute the query with parameters
            row = execute_query(query, [date1, date2])

            # Format the result
            if row:
                result = [{'nombre_villes': row[0]}]  # Return result as list with a dictionary
                return Response({'nombre_villes': result}, status=status.HTTP_200_OK)
            else:
                return Response({'nombre_villes': []}, status=status.HTTP_404_NOT_FOUND)

        except ValueError:
            return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
