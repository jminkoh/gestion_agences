# Generated by Django 5.1.4 on 2024-12-24 14:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cloture', '0004_delete_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='agence',
            name='nom',
            field=models.CharField(max_length=50),
        ),
    ]
