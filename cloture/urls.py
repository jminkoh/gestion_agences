from django.urls import path
from . import views

urlpatterns = [
    path('', views.redirection), 
    path('agences/accounts/login/', views.login, name='login'), 
    path('agences/accounts/logout/', views.logout, name='logout'), 
    path('agences/', views.liste_agences, name='liste_agences'),
    path('agences/consulter_rapports', views.consulter_rapports, name='liste_rapports'),
    path('save_report/', views.save_report, name='save_report'),
]
