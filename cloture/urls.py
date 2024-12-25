from django.urls import path
from . import views

urlpatterns = [
    path('connexion/', views.login, name='connexion'),
    path('agences/', views.liste_agences, name='liste_agences'),
]
