from django import forms
from .models import Agence

from django.contrib.auth.forms import AuthenticationForm 

from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class InscriptionForm(UserCreationForm):
    email = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-control'})) 
    first_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'})) 
    last_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'})) 
    username = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'})) 
    password1 = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'})) 
    password2 = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}))

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2')

class ConnexionForm(AuthenticationForm): 
    username = forms.CharField(label="Nom d'utilisateur", widget=forms.TextInput(attrs={'class': 'form-control'})) 
    password = forms.CharField(label="Mot de passe", widget=forms.PasswordInput(attrs={'class': 'form-control'}))

class AgenceForm(forms.ModelForm):
    class Meta:
        widgets = { 
            'comptabilisation': forms.CheckboxInput(attrs={'class': 'form-check-input'}), 
            'demande_mise_a_jour': forms.CheckboxInput(attrs={'class': 'form-check-input'}), 
            'piece_desequilibre': forms.CheckboxInput(attrs={'class': 'form-check-input'}), 
            'difference_operationnelle_comptabilite': forms.CheckboxInput(attrs={'class': 'form-check-input'}), 
            'balance_equilibree': forms.CheckboxInput(attrs={'class': 'form-check-input'}), 
            'journee_fermee': forms.CheckboxInput(attrs={'class': 'form-check-input'}), 
            'observation': forms.Textarea(attrs={'class': 'form-control'}), 
            'heure_debut': forms.TimeInput(attrs={'class': 'form-control'}), 
            'heure_fin': forms.TimeInput(attrs={'class': 'form-control'}), 
        }

        model = Agence
        fields = ['comptabilisation', 'demande_mise_a_jour', 'piece_desequilibre', 
        'difference_operationnelle_comptabilite', 'balance_equilibree', 
    'journee_fermee', 'observation', 'heure_debut', 'heure_fin']


