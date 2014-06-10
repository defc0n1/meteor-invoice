.. invoice documentation master file, created by
   sphinx-quickstart on Sat May 10 19:06:47 2014.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to invoice's documentation!
===================================

Contents:

.. toctree::
   :maxdepth: 2
   Varer
   Salg

*****
Varer
*****

Redigere varekortet
###################

Tryk på `Redigér`_ (skruenøgle-ikonet) for at komme til varekortet.

	*Navi er autoritativt i alle felter i varekortet, dvs. alle data intastet i Invoice vil blive overskrevet med data fra Navi. Eneste undtagelse er* `GLN nummer`_, *som kan tastes manuelt fra varekortet i Invoice eller vha.* `Lyn GLN`_ 

Lyn GLN
#######

Vha. `Lyn GLN`_ er det muligt at tilføje `GLN nummer`_ til varer, udfra en liste over varer uden et eksisterende `GLN nummer`_. Det er muligt at søge efter en bestemt vare i søgefeltet øverst på siden. Når en vare er tilføjet `GLN nummer`_ vil den ikke længere findes på listen under `Lyn GLN`_

	*For at anvende EAN-nummer som `GLN nummer`_, tryk på* Kopier EAN.

****
Salg
****

Send faktura via email
######################

Under fanebladet `Salg`_ 
	Tryk på email-ikonet for den pågældende faktura.

	*Hvis afsendelsen lykkes, vil email-ikonet blive grønt. Hvis ikke, vises en fejlmeddelelse og email-ikonet vil blive rødt.*

EDIfakturering
##############

For at fakturere via EDI, tryk på EDI-ikonet for den pågældende faktura.
	
	*Hvis afsendelsen lykkes, vil EDI-ikonet blive grønt. Hvis ikke, vises en fejlmeddelelse og EDI-ikonet vil blive rødt.*

Tilføj kundeordrenummer
#######################

Vha. `Tilføj kundeordrenummer`_ er det muligt at tilføje `Kundeordrenummer`_ til fakturaer, udfra en liste over varer uden et eksisterende `Kundeordrenummer`_. Det er muligt at søge efter en bestemt vare i søgefeltet øverst på siden. Når en vare er tilføjet `Kundeordrenummer`_ vil den ikke længere findes på listen under `Tilføj kundeordrenummer`_.

*********
Kontakter
*********

Føj GLN nummer til kontakt
##########################

Det er muligt at søge efter en bestemt kontakt i søgefeltet øverst på siden under fanebladet `Kontakter`_.
	Tryk på `Redigér`_ for at åbne kontaktkortet.
		På kontaktkortet er det muligt at indtaste `GLN nummer`_ for den pågaldende kontakt.

		*Husk at tilegne kontakter med GLN en EDI-gruppe fra menuen i kontaktkortet.*

	*Navi er autoritativt i alle felter i varekortet, dvs. alle data intastet i Invoice vil blive overskrevet med data fra Navi. Eneste undtagelse er* `GLN nummer`_, *som kan tastes manuelt fra varekortet i Invoice eller vha.* `Lyn GLN`_ 

******************
Begrebsfortegnelse
******************

Redigér
#######

Tryk på `Redigér`_ (skruenøgle-ikonet) for at redigere det pågældende element.

GLN nummer
##########

GLN-nummeret er en med kunden aftalt reference, som er nødvendig ved `EDIfakturering`_.

Kundeordrenummer
################

Et `Kundeordrenummer`_ refererer til kundens ordre, til brug som reference for kunden, når denne faktureres.