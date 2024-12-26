from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import authenticate, login 
from django.contrib.auth.decorators import login_required
from .models import Agence
from .forms import AgenceForm, ConnexionForm

def login(request): 
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
    
    return render(request, 'cloture/login.html', {
        'form': form,
    })

@login_required
def liste_agences(request):
    agences = Agence.objects.all()
    return render(request, 'cloture/liste_agences.html', {'agences': agences})


