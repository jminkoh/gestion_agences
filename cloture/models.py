from django.db import models
from django.contrib.auth.models import AbstractUser 

class Agence(models.Model):
    nom = models.CharField(max_length=191) 
    comptabilisation = models.BooleanField(default=False) 
    demande_mise_a_jour = models.BooleanField(default=False) 
    piece_desequilibre = models.BooleanField(default=False) 
    difference_operationnelle_comptabilite = models.BooleanField(default=False) 
    balance_equilibree = models.BooleanField(default=False) 
    journee_fermee = models.BooleanField(default=False) 
    observation = models.TextField(blank=True, null=True) 
    date_cloture = models.DateTimeField(auto_now_add=True)
    heure_debut = models.TimeField(blank=True, null=True) 
    heure_fin = models.TimeField(blank=True, null=True)

    def __str__(self):
        return self.nom
    
