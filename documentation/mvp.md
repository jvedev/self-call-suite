## ⚔️ Structuur van de App Suite

### Structuur van Toernooien en Matches

1. Een **Event** heeft één of meer Toernooien.
2. Een **Event** heeft één of meer **Arena's** (fysieke vechtplekken).
3. Een **Toernooi** bestaat uit een **Pool Fase** en een **Eliminatie Fase** en heeft een gedefinieerde Regelset.

#### Pool Fase

4. Een Toernooi heeft één of meer **Pools**.
5. Een Pool is een groep van **Vechters** die onderling matches spelen (**Pool Matches**).
6. Een Pool heeft **Pool Matches** die worden gespeeld.
7. Een Pool wordt toegewezen aan één Arena voor het Pool spelen en heeft een gepland tijdstip.
8. Een Pool heeft één of meer toegewezen **Scheidsrechters, Juryleden** en **Table Crew**.
9. Een Vechter kan maar in één Pool zitten per Toernooi.

#### Match Details (Pools en Eliminatie)

10. Een **Match** heeft twee Vechters en eindigt met een Uitslag (Winnaar, Verliezer, Final Score).
11. Een **Match** bestaat uit een aantal **Exchanges**.
12. Een **Exchange** heeft een aantal punten per Vechter, dat kan een 'No Score', of een Penalty zijn. 
13. Een **Exchange** heeft een type zoals 'hit', 'double', 'redFirst' of 'blueFirst' (bij afterblow).

#### Eliminatie Fase

13. Een Toernooi heeft één **Eliminatie Schema** dat volgt op de Pool Fase en bestaat uit **Eliminatie Matches** (of '
    Bracket Matches').
14. Een Eliminatie Match heeft twee Vechters (winnaars of best geplaatste uit de Pools).
15. Een Eliminatie Match wordt individueel toegewezen aan één Arena en een gepland tijdstip.
16. Een Eliminatie Match wordt individueel toegewezen aan een team van Scheidsrechters, Juryleden en Table Crew.
17. Een Vechter kan per Toernooi slechts in één **actieve** Pool of Eliminatie Match tegelijkertijd staan.
18. Een Toernooi heeft een Finale Match en een 3e Plaats Match binnen het Eliminatie Schema, elk met een toegewezen
    Arena.

### Algemene Details

19. Een Event heeft een Datum en Locatie.
20. Een Vechter kan in meerdere Toernooien zitten binnen één Event.

---

## 📱 Beschrijving van de Apps

De suite heeft de volgende apps:

### 1. Event Management

* Managed het aantal inschrijvingen per Event.
* Managed het indelen van Vechters in Toernooien en Pools.
* Managed het toewijzen van Scheidsrechters, Juryleden en Table Crew aan Pools en Eliminatie Matches/Rondes.
* Managed het genereren van Eliminatie Schema's.
* Managed de check-in van alle deelnemers en crew.
* **Nieuw:** Publiceert de Poolindelingen, Eliminatie Schema's en Arena-toewijzingen.

### 2. Score Keeper

* **Wordt bediend door de Tafel Crew (op basis van de Scheidsrechter zijn/haar oordeel).**
* Managed de status van een Match (Actief, Gepauzeerd, Gestopt).
* Houdt de tijd van de Match bij, inclusief timeout mogelijkheden.
* Registreert hits per Exchange per Vechter per type (hit, double, no score, redFirst of blueFirst bij afterblow).
* Registreert Penalties en Waarschuwingen per Vechter.
* Gemaakte Exchanges kunnen worden aangepast of verwijderd.
* Berekent en geeft de score per Vechter automatisch weer.

### 3. Score Board

Hierop is te zien:

* Naam Vechter Rood en Naam Vechter Blauw.
* Score Vechter Rood en Score Vechter Blauw.
* Aflopende tijd.
* **Context:** Naam van de Arena, Huidige Pool Naam/Nummer of Eliminatie Ronde.
* 'On Call Red' en 'On Call Blue' (voor de volgende match).
* Het Score Board is **openbaar toegankelijk** zonder in te loggen.

---

## 👤 Gebruikers en Rollen

### Rollen

* **Admin:** Mag een Evenement aanmaken en beheren, Gebruikers aanmaken en Rollen toekennen, en mag verder alles wat
  Staff en Tafel Crew mag.
* **Staff:** Mag binnen **toegewezen** Evenementen alle data en planning aanpassen (niet het Evenement weggooien).
* **Tafel Crew:** Mag alleen de Score Keeper app gebruiken tijdens een toegewezen Evenement.

### Gebruikers Management

* Gebruikers worden aangemaakt met een gebruikersnaam, e-mail en wachtwoord.
* Gebruikers kunnen één of meer Rollen hebben.
* Gebruikers kunnen worden toegewezen aan Evenementen als Staff of Tafel Crew.
* Gebruikers kunnen worden toegewezen aan Pools of Eliminatie Matches als Scheidsrechter, Jurylid of Table Crew.

### Vechter Management

* Vechters worden aangemaakt met naam of alias.
* Vechters krijgen een Ranking (een subjectieve waarde voor het indelen van niveaus).