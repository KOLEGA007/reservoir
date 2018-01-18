from django.contrib import admin
from .models import Reservation, Place, Level, Decoration
# Register your models here.

admin.site.register(Place)
admin.site.register(Reservation)
admin.site.register(Level)
admin.site.register(Decoration)
