# Generated by Django 4.1.2 on 2022-10-06 11:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('expenses_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='paymenttransactions',
            name='expense_type',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='expenses_app.subtypes'),
        ),
    ]