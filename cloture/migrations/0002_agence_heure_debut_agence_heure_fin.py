# Generated by Django 5.1.4 on 2024-12-23 10:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cloture', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='agence',
            name='heure_debut',
            field=models.TimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='agence',
            name='heure_fin',
            field=models.TimeField(blank=True, null=True),
        ),
    ]
