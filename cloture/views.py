from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import authenticate, login 
from django.contrib.auth.decorators import login_required, user_passes_test
from .models import Agence, RapportAgence
from .forms import AgenceForm, ConnexionForm
from datetime import date
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
import base64
from datetime import datetime
import json

def consulter_rapports(request):
    # Récupérer tous les rapports de la base de données
    rapports = RapportAgence.objects.all()

    # Passer les rapports à la vue
    return render(request, 'cloture/consulter_rapports.html', {'rapports': rapports})

@csrf_exempt
def save_report(request):
    if request.method == 'POST':
        # Récupérer les données JSON
        data = json.loads(request.body)
        pdf_base64 = data.get('pdf')
        heure_debut = data.get('heure_debut')
        heure_generation = data.get('heure_generation')

        # Convertir la base64 en fichier
        pdf_data = base64.b64decode(pdf_base64.split(',')[1])  # Enlever le préfixe 'data:application/pdf;base64,'
        pdf_file = ContentFile(pdf_data)

        # Créer un nom de fichier unique
        fichier_pdf_name = f"rapport_agences_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"

        # Sauvegarder le rapport dans la base de données
        rapport = RapportAgence.objects.create(
            date=datetime.now().date(),
            fichier_pdf=fichier_pdf_name,
            observations=f"Rapport généré à {heure_generation}. Heure de début: {heure_debut}",
        )

        # Sauvegarder le fichier dans le répertoire media
        rapport.fichier_pdf.save(fichier_pdf_name, pdf_file)

        # Répondre avec succès
        return JsonResponse({'message': 'Rapport enregistré avec succès'}, status=200)

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

def user_login(request): 
    if request.method == 'POST':
        form = ConnexionForm(data=request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                login(request, user)
                # Redirection vers la page souhaitée après connexion
                next_url = request.GET.get('next', 'liste_agences')
                return redirect(next_url)
            else:
                # Ajout d'un message d'erreur dans le formulaire
                form.add_error(None, "Nom d'utilisateur ou mot de passe incorrect")
    else:
        form = ConnexionForm()
    
    return render(request, 'cloture/login.html', context={
        'form': form,
    })

def is_not_admin(user):
    return not user.is_staff  # Vérifie que l'utilisateur n'est pas un administrateur

@login_required(login_url='user_login') 
@user_passes_test(is_not_admin)  # Empêche les administrateurs d'accéder à la vue
def liste_agences(request):
    agences = Agence.objects.all()
    today = date.today().strftime('%Y-%m-%d')
    return render(request, 'cloture/liste_agences.html', context={'agences': agences, 'today': today})


