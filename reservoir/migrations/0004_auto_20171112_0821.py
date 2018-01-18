# -*- coding: utf-8 -*-
# Generated by Django 1.10.8 on 2017-11-12 08:21
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('reservoir', '0003_auto_20171112_0818'),
    ]

    operations = [
        migrations.AddField(
            model_name='place',
            name='reservation',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='reservoir.Reservation'),
        ),
        migrations.AlterField(
            model_name='place',
            name='x',
            field=models.IntegerField(default=0, verbose_name='Souřadnice x'),
        ),
        migrations.AlterField(
            model_name='place',
            name='y',
            field=models.IntegerField(default=0, verbose_name='Souřadnice Y'),
        ),
    ]