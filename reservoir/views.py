from django.views.generic import TemplateView, ListView, View
from django.http import HttpResponse, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
from reservoir.models import Reservation as Rezervacni_trida
from reservoir.models import Place
from django.utils.decorators import method_decorator
from django.contrib.admin.views.decorators import staff_member_required

class Homepage(TemplateView):
    template_name = "index.html"

class Reservation(TemplateView):
    template_name = "reservation.html"

@method_decorator(staff_member_required, name='dispatch')
class Reservations(ListView):
    template_name = "reservations.html"
    model = Place

class ReservationCreate(View):
    def get(self, request):
        return HttpResponseForbidden()

    def post(self, request):
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        places_no_seat = request.POST.get("bar_seats")
        try:
            if(places_no_seat != ""):
                places_no_seat = int(places_no_seat)
            else:
                places_no_seat = 0
            if(places_no_seat < 0):
                places_no_seat = 0
        except ValueError:
            return HttpResponse('{"state":"fail", "data":"Místa bez čísla stolu nedávají smysl"}')

        if(name == ""):
            return HttpResponse('{"state":"fail", "data":"Jméno není vyplněno"}')
        if(email == "" and phone == ""):
            return HttpResponse('{"state":"fail", "data":"Potřebujeme nějaký kontakt, vyplňte prosím e-mail nebo telefon"}')
        if(len(request.POST.getlist('place')) == 0 and places_no_seat < 1):
            return HttpResponse('{"state":"fail", "data":"Nevybral jste žádné místo k rezervování"}')
        rezervace = Rezervacni_trida.objects.create()
        for misto in request.POST.getlist('place'):
            try:
                misto = Place.objects.get(pk=misto)
            except:
                return HttpResponse('{"state":"fail"}')
                rezervace.delete()
            if not misto.isFree():
                return HttpResponse('{"state":"fail", "data":"Místo není volné, obnovte prosím stránku"}')
                rezervace.delete()
            rezervace.place_set.add(misto)
        rezervace.email = email
        rezervace.phone = phone
        rezervace.name = name
        rezervace.bar_seats = places_no_seat
        rezervace.save()
        rezervace.sendmail()
        return HttpResponse('{"state":"ok", "pk": "' + str(rezervace.id) + '"}');
