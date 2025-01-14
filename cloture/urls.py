from django.urls import path
from . import views

urlpatterns = [
    path('', views.user_login, name='user_login'),
    path('agences/', views.liste_agences, name='liste_agences'),
    path('agences/consulter_rapports', views.consulter_rapports, name='liste_rapports'),
    path('save_report/', views.save_report, name='save_report'),
]
