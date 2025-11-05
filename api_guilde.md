API SubID GuideLines
Guide to integrating and recovering an external identifier (SubID)
TimeOne SAS au capital de 17.802.739 € - 20-24 rue Jacques Ibert 92300 Levallois-Perret
Immatriculée au Registre du Commerce et des Sociétés de Nanterre sous le numéro 814 340 675
Using our SubID API, you can integrate the external identifier (SubID) of your choice into the TimeOne
Performance tracking system.
This identifier (SubID) will be linked to your sales feedback and/or forms and will be inserted into your
statistics at the same time.
1. IMPLEMENTATION
To implement your external identifier and incorporate it into the TimeOne Performance tracking process,
add the variable: &cb=YOUR_SUBID to the platform’s tracking URLs.
Integration example:
Basic HTML banner tag:
<a href="http://tracking.publicidees.com/clic.php?
partid=2&progid=109&promoid=54004&cb=YOUR_SUBID" target="_blank"><img
src="http://tracking.publicidees.com/banner.php?
partid=2&progid=109&promoid=54004&cb=YOUR_SUBID " border="0"></a>
Basic JAVASCRIPT banner tag:
<script type="text/javascript" src="http://tracking.publicidees.com/showbanner.php?
partid=2&progid=109&promoid=54004&cb=YOUR_SUBID"></script>
!! PLEASE NOTE !!
It is important to add the variable: &cb=YOUR_SUBID to all of the tracking (“a href” and “img src”) so that
the I identifier can be traced during postclick and postview actions.
CONTENT AND STRUCTURE OF THE “CB” SUBID VARIABLE
The “cb” variable must refer to the value of the external identifier (SubID) that you have chosen.
However, your identifier contained in the “cb” variable must conform to a certain number of
characteristics:
 It must not exceed 255 characters,
 It must not include any spaces,
 It may contain letters and numbers,
 It must not contain any special or accented characters (accents, spaces, &, etc.). If your
identifier should happen to have any of these characters, you must encode it before
entering it as a parameter.
TimeOne SAS au capital de 17.802.739 € - 20-24 rue Jacques Ibert 92300 Levallois-Perret
Immatriculée au Registre du Commerce et des Sociétés de Nanterre sous le numéro 814 340 675
2. QUERYING THE SubID API
Basic principle
Once your external identifier (SubID) has been integrated into the TimeOne Performance as a
tracking system, you will be able to query our secure API in order to obtain any information relating
to the sales and forms that you have generated through your external identifier.
To query our API, you must complete the following stages:
Contact our API at the following URL: http://api.publicidees.com/subid.php5
To this basic URL, you must add the mandatory parameters which allow you to log in, i.e. your
secure key and your website identifier.
You will find a ‘query’ generator on your affiliate interface in the “Open Platform Menu” to create
and grab urls with all parameters needed.
For information:
- The variable “p” for “your_identifier” is your affiliate site identifier (PARTID or Partner ID) and it’s the
same as the value of the “partid” parameter in your tracking links.
- The “k” variable for “your_key” corresponds to your secure key.
3. API WILL GENERATE AN XML FEED FOR YOU
Example of XML feed generated:
<partner id="8826">
<program id="189">
<name>
<![CDATA[ ProgramName ]]>
</name>
<action
id="123456789"
SubID="xxxyoursubidxxx"
ActionDate="2015-06-01 09:42:18"
ValidationDate="2015-06-02"
ActionStatus="1"
ActionType="3"
ProgramCommission="X.XXXEUR"
ActionCommission="X.XXX"
CartAmount="YY.YY"
ProgramComID="ZZZZ"
PartnerComID="Z2Z2"
Title="Sale"
ProgramCurrency="EUR"
Device="Desktop"/>
</program>
TimeOne SAS au capital de 17.802.739 € - 20-24 rue Jacques Ibert 92300 Levallois-Perret
Immatriculée au Registre du Commerce et des Sociétés de Nanterre sous le numéro 814 340 675
Description of each variable:
Variable Name Description Format
<partner id> Your partner ID / PARTID Numerical
<program id> The program ID / PROGID Numerical
Name Program name Alphanumerical
Action id Order number Alphanumerical
SubID YOUR Subid pass through tracking
links As seen previously
ActionDate Time of action was done YYYY-MM-DD HH:MN:SS
ValidationDate Time of action was validated YYYY-MM-DD
0 = action refused
ActionStatus Status of Action
1 = action pending
2 = action approved
ActionType Type of action 3 = sales-based remuneration
4 = form-based remuneration
ProgramCommission Your commission for this program Numerical+Currency 1.23CUR
ActionCommission Numerical 1.23
CartAmount If provided, cart amount Numerical 1.23
ProgramComID The commission ID Numerical
PartnerComID The partner specific commission Numerical
Title Sale/Lead ‘name’ + ‘Description’ Alphanumerical
ProgramCurrency Currency of commission, 3 letters
code EUR / BRL / ZAR /USD /GBP…
Device Device on which the action was
made Desktop/Tablet/Mobile
!! PLEASE NOTE !!
You can also query our API and generate a CSV file. You just need to add the
variable ‘&csv=1’
4. REFINE YOUR QUERY
In addition to the mandatory query parameters, you can refine your search by
adding additional parameters to the called URL.
!! PLEASE NOTE !!
When querying the API it is not possible to include the same variable several times
in the call URL. You must therefore perform several calls.
TimeOne SAS au capital de 17.802.739 € - 20-24 rue Jacques Ibert 92300 Levallois-Perret
Immatriculée au Registre du Commerce et des Sociétés de Nanterre sous le numéro 814 340 675
a. Consulting statistics for a type of remuneration (sales, form):
Add the variable “t” with the value corresponding to the type of commission to the API’s
query URL:
- t = 3: sales-based remuneration
- t = 4: form-based remuneration
If the “t” variable is not entered, you will have both remunerations by default
b. Consulting statistics according to the status of the action (pending, approved or
cancelled):
Add the variable “s” with the value corresponding to the type of commission to the API’s
query URL:
- s = 0: sale/lead cancelled
- s = 1: sale/lead pending
- s = 2: sale/lead approved
- s = 3: sale/lead approved and in a billing call
If the “s” variable is not entered, you will have the 3 statuses by default
c. Consulting statistics for a given date
Add the variable “d” to the API’s query URL
- The date must be in the yyyy-mm-dd format
If the variable “d” is not entered, the current date will be the default date
d. Consulting statistics over a given period
Add the variable “dd” (for the start date) and the variable “df” (for the end date) to the API’s
query URL
- The date must be in the yyyy-mm-dd format
Example: &dd=2011-09-23&df=2011-09-30
e. Consulting statistics with an action or validation date (accepted or cancelled)
Add the variable “td” with the value corresponding to the type of date required
- td = a: to obtain the statistics with an action date - the date on which the sale or lead was
recorded (for information, “ td = a” is the default value taken into account)
- td = v: to obtain the statistics with a validation date – the date on which the advertiser
approved or cancelled the sale/lead
f. Consulting statistics for a certain SubID identifier:
Add the variable “cb” with the value of the SubID identifier desired to the API’s query URL
If the variable “cb” is not entered, you will have all your external identifiers by default
!! PLEASE NOTE !!
The "cb" variable will be encoded when inserted in the XML feed. You must
therefore use the urldecode() function or an equivalent in order to find the original
chain.
g. Consulting statistics with click display
Add the variable “c” to the API’s query URL
- c = 1: display of number of clicks with detail per day
h. Grouping total shares by subID
Add the variable “&gb=” to the API’s query URL
- gb = 1: display all commissions grouped by SUBID.
This variable works only if you are using our csv query.
TimeOne SAS au capital de 17.802.739 € - 20-24 rue Jacques Ibert 92300 Levallois-Perret
Immatriculée au Registre du Commerce et des Sociétés de Nanterre sous le numéro 814 340 675
!! PLEASE NOTE!!
All the parameters that we have shown can be accumulated, apart from:
The variable “d” (to perform a search on a given day) AND the variable “dd / df”
(to perform a search over a given period)
The variable “td=a” and “td=v”. In fact, it is not possible to perform a search with
an “action” date and with a “validation” date
5. EXAMPLE OF QUERY
- Consulting statistics for a given day:
http://api.publicidees.com/subid.php5?k=YOUR_KEY&p=YOUR_ID&d=2015-01-15
- Consulting statistics for a period:
http://api.publicidees.com/subid.php5?k=YOUR_KEY&p=YOUR_ID&dd=2015-01-
15&df=2015-01-20
- Consulting statistics with click display (only for the month in progress):
http://api.publicidees.com/subid.php5?k=YOUR_KEY&p=YOUR_ID&dd=2015-01-
15&df=2015-01-20&c=1
- Consulting approved statistics for a given period:
http://api.publicidees.com/subid.php5?k=YOUR_KEY&p=YOUR_ID&dd=2015-01-
15&df=2015-01-20&td=v
- Consulting approved statistics with a given SubID identifier:
http://api.publicidees.com/subid.php?k=YOUR_KEY&p=VOTRE_ID&dd=2015-01-
15&df=2015-01-20&td=v&cb=YOUR_SUBID
- Consulting approved and pending sales between 2015-01-15 and 2015-01-20:
http://api.publicidees.com/subid.php?k=YOUR_KEY&p=VOTRE_ID&dd=2015-01-
15&df=2015-01-20&s=1&t=3
AND
http://api.publicidees.com/subid.php?k=YOUR_KEY&p=VOTRE_ID&dd=2015-01-
