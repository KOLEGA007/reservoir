from django.db import models

# Create your models here.

class Level(models.Model):
    name = models.CharField(verbose_name="Název:", max_length=254, default="")

    def __str__(self):
        return self.name

class Reservation(models.Model):
    email = models.EmailField(verbose_name="E-mail:", blank=True)
    name = models.CharField(verbose_name="Jméno:", max_length=254, default="")
    phone = models.CharField(verbose_name="Telefonní číslo", max_length=254, default="", blank=True)
    confirmed = models.BooleanField(verbose_name="Potvrzeno?", default=False)
    bar_seats = models.IntegerField(verbose_name="Místa bez čísla: ", default=0)

    def __str__(self):
        return self.name + " - "  + (self.phone if len(self.phone) > 0 else self.email) + " - " + ("potvrzená" if self.confirmed else "NEPOTVRZENÁ")

    def sendmail(self):
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        from email.header import Header
        account = "ondrej.kolin@gmail.com"
        target = "ondrej.kolin@gmail.com"
        password = "jfidxrniqbrliogs"
        msg = MIMEMultipart('alternative')
        msg.set_charset("utf8")
        msg["FROM"] = account
        msg["Subject"] = Header(
            "Nová rezervace".encode("utf-8"),
            "UTF-8"
        ).encode()
        msg['To'] = target

        BodyMSG = "\r\n<br>".join([
          "Ahoj, máš novou rezervaci :-)",
          "Jméno: " + str(self.name),
          "E-mail: " + str(self.email),
          "Telefon: " + str(self.phone),
          "Vybrané lístky podle čísla stolu: " + ", ".join([str(i.table) for i in self.place_set.all()]),
          "Lístků bez umístění: " + str(self.bar_seats)
          ])
        _attach = MIMEText(BodyMSG.encode('utf-8'), 'html', 'UTF-8')
        msg.attach(_attach)
        server = smtplib.SMTP('smtp.gmail.com:587')
        server.ehlo()
        server.starttls()
        server.login(account, password)
        server.sendmail(account, target, msg.as_string())
        server.quit()

class Place(models.Model):
    x = models.IntegerField(verbose_name="Souřadnice x", default=0)
    y = models.IntegerField(verbose_name="Souřadnice Y", default=0)
    table = models.IntegerField(verbose_name="Číslo stolu", default=-1)
    reservation = models.ForeignKey(Reservation, on_delete=models.SET_NULL, null=True, blank=True)
    level = models.ForeignKey(Level, on_delete=models.CASCADE)

    STATES = {
        "free" : "free",
        "reserved" : "reserved",
        "confirmed": "confirmed"
    }

    def __str__(self):
        return str(self.level) + " [" + str(self.x) + ", " + str(self.y) + "] " + str(self.getState())

    @property
    def state(self):
        if(self.reservation is None):
            return self.STATES["free"]
        elif(self.reservation.confirmed):
            return self.STATES["confirmed"]
        else:
            return self.STATES["reserved"]

    def getState(self):
        if(self.reservation is None):
            return self.STATES["free"]
        elif(self.reservation.confirmed):
            return self.STATES["confirmed"]
        else:
            return self.STATES["reserved"]

    def isFree(self):
        return self.reservation is None

class Decoration(models.Model):
    x = models.IntegerField(verbose_name="Souřadnice x", default=0)
    y = models.IntegerField(verbose_name="Souřadnice y", default=0)
    width = models.IntegerField(verbose_name="Šířka", default=1)
    height = models.IntegerField(verbose_name="Výška", default=1)
    name = models.CharField(verbose_name="Popis", max_length=255)
    level = models.ForeignKey(Level, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.name)
