# Generated by Django 5.1.4 on 2024-12-26 08:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cloture', '0006_alter_agence_nom'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='agence',
            name='comptabilisation',
        ),
        migrations.RemoveField(
            model_name='agence',
            name='demande_mise_a_jour',
        ),
        migrations.RemoveField(
            model_name='agence',
            name='difference_operationnelle_comptabilite',
        ),
        migrations.RemoveField(
            model_name='agence',
            name='piece_desequilibre',
        ),
    ]
