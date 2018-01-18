# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-12-09 10:28
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('reservoir', '0007_auto_20171112_0834'),
    ]

    operations = [
        migrations.CreateModel(
            name='Level',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=254, verbose_name='Název:')),
            ],
        ),
        migrations.AlterField(
            model_name='place',
            name='reservation',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='reservoir.Reservation'),
        ),
    ]