# Generated by Django 5.1.4 on 2025-01-08 15:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cloture', '0010_rapportagence'),
    ]

    operations = [
        migrations.AddField(
            model_name='agence',
            name='observation_simplex',
            field=models.TextField(blank=True, null=True),
        ),
    ]
