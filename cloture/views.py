from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from .models import Agence, RapportAgence
from .forms import ConnexionForm
from datetime import date
from django.http import JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
import base64
from datetime import datetime
import json
from django.shortcuts import redirect

def redirection(request):
    return HttpResponseRedirect('/agences/') 

def logout_view(request):
    logout(request) 
    return redirect('login')

def consulter_rapports(request):
    rapports = RapportAgence.objects.all()
    return render(request, 'cloture/consulter_rapports.html', {'rapports': rapports})

@csrf_exempt
def save_report(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        pdf_base64 = data.get('pdf')
        heure_debut = data.get('heure_debut')
        heure_generation = data.get('heure_generation')

        pdf_data = base64.b64decode(pdf_base64.split(',')[1]) 
        pdf_file = ContentFile(pdf_data)

        fichier_pdf_name = f"rapport_agences_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"

        rapport = RapportAgence.objects.create(
            date=datetime.now().date(),
            fichier_pdf=fichier_pdf_name,
            observations=f"Rapport généré à {heure_generation}. Heure de début: {heure_debut}",
        )

        rapport.fichier_pdf.save(fichier_pdf_name, pdf_file)

        return JsonResponse({'message': 'Rapport enregistré avec succès'}, status=200)

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

def login(request): 
    if request.method == 'POST':
        form = ConnexionForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
    else:
        form = ConnexionForm()

    return render(request, 'registration/login.html', {'form': form})

@login_required
def liste_agences(request):
    user = request.user.username
    agences = Agence.objects.all()
    today = date.today().strftime('%Y-%m-%d')
    return render(request, 'cloture/liste_agences.html', context={'agences': agences, 'today': today, 'user': user})


