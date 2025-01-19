from django import forms
from .models import Agence

from django.contrib.auth.forms import AuthenticationForm 


class ConnexionForm(AuthenticationForm): 
    username = forms.CharField(label="Nom d'utilisateur", widget=forms.TextInput()) 
    password = forms.CharField(label="Mot de passe", widget=forms.PasswordInput())

class AgenceForm(forms.ModelForm):
    class Meta:
        widgets = { 
            'balance_equilibree': forms.CheckboxInput(attrs={'class': 'form-check-input'}), 
            'journee_fermee': forms.CheckboxInput(attrs={'class': 'form-check-input'}), 
            'observation': forms.Textarea(attrs={'class': 'form-control'}), 
            'heure_debut': forms.TimeInput(attrs={'class': 'form-control'}), 
            'heure_fin': forms.TimeInput(attrs={'class': 'form-control'}), 
        }

        model = Agence
        fields = ['balance_equilibree', 
    'journee_fermee', 'observation', 'heure_debut', 'heure_fin']


