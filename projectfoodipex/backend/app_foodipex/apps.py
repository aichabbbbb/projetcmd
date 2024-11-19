
from django.apps import AppConfig

class StudentsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "app_foodipex"

    def ready(self):
        self.register_signals()

    def register_signals(self):
        from django.db.models.signals import post_migrate
        from django.contrib.auth.models import Group
        from django.dispatch import receiver

        @receiver(post_migrate)
        def create_default_groups(sender, **kwargs):
            groups = ['Administrateurs','Utilisateurs']
            for group in groups:
                Group.objects.get_or_create(name=group)
                Group.objects.get_or_create(name=group)
