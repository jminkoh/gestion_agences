from django.db import models
from django.contrib.auth.models import AbstractUser 

class Agence(models.Model):
    nom = models.CharField(max_length=191) 
    balance_equilibree = models.BooleanField(default=False) 
    journee_fermee = models.BooleanField(default=False) 
    observation = models.TextField(blank=True, null=True) 
    date_cloture = models.DateTimeField(auto_now_add=True)
    heure_debut = models.TimeField(blank=True, null=True) 
    heure_fin = models.TimeField(blank=True, null=True)

    def __str__(self):
        return self.nom

class RapportAgence(models.Model):
    date = models.DateField()
    fichier_pdf = models.FileField(upload_to='rapports/', null=True, blank=True)
    observations = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Rapport du {self.date}"
    
