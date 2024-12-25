# gestion_heures_agences.py
import os
import django
from datetime import datetime
from myproject.settings import BASE_DIR

# Initialisation de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from cloture.models import Agence, ModificationQuotidienne
from django.contrib.auth.models import User

def mettre_a_jour_agences():
    agences = Agence.objects.all()
    heure_debut = datetime.now().time()  # Heure de début par défaut
    heure_fin = (datetime.now().replace(hour=datetime.now().hour + 1)).time()  # Heure de fin par défaut, 1 heure après l'heure actuelle

    utilisateur = User.objects.first()  # Récupérer le premier utilisateur pour l'exemple

    for agence in agences:
        modification_quotidienne = ModificationQuotidienne(
            agence=agence,
            utilisateur=utilisateur,
            heure_debut=heure_debut,
            heure_fin=heure_fin,
            comptabilisation=agence.comptabilisation,
            demande_mise_a_jour=agence.demande_mise_a_jour,
            piece_desequilibre=agence.piece_desequilibre,
            difference_operationnelle_comptabilite=agence.difference_operationnelle_comptabilite,
            balance_equilibree=agence.balance_equilibree,
            journee_fermee=agence.journee_fermee,
            observation=agence.observation
        )
        modification_quotidienne.save()

if __name__ == "__main__":
    mettre_a_jour_agences()
