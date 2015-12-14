import re

cf = open("countries.txt","r") #opens file with name of "test.txt"
j=(cf.read())
cf.close()

data = re.findall(r'\S*\S', j)

countries = []
country_codes = []
country_code_list = []
country_name_list = []
country=''
country_id = 1
for item in data:
	if not re.match(r'{(.*)}', item):
		country=country+' '+item
	else:
		countries.append(country[1:])
		country=''
		country_codes.append(item[1:-1])
	country_id=country_id+1


nf = open("jsoncountries.js","w")
nf.write("var countries = [{\n")

#get the country codes and country names
i=0
jsonFileContents=''
for country in countries:
	jsonFileContents=jsonFileContents+("\n\tname: \'"+countries[i]+'\'\n\tcountry_code:\''+country_codes[i]+'\'\n\t}, {')
	country_code_list.append(country_codes[i])
	country_name_list.append(countries[i])
	i=i+1

cl = open("language_to_country.txt", "r")
l_to_c = (cl.read())
cl.close()

#find all language codes and country codes
lc_cc = re.findall(r'\".*?\"', l_to_c)

country_code_list2 = []
language_code_list2 = []
i=0
for item in lc_cc:
	if re.match(r'[A-Z]*?', item) and i%2==1:
		country_code_list2.append(item[1:-1])
	else:
		language_code_list2.append(item[1:-1])
	i=i+1

lc_cc_list = zip(country_code_list2, language_code_list2)
print lc_cc_list
dt=dict(lc_cc_list)
print dt

#write the contents to file
jsonFileContents=jsonFileContents[:-5]+"\t}\n];"
nf.write(jsonFileContents)

country_to_language = {
"country":"language",
"AC":"en",
"AF":"ps",
"AX":"sv",
"AD":"ca",
"AO":"pt-PT",
"AI":"en",
"AQ":"ru",
"AG":"en",
"AW":"nl",
"AZ":"az",
"BS":"en",
"BD":"bn",
"BB":"en",
"BJ":"fr",
"BM":"en",
"BA":"bs",
"BT":"en",
"IO":"en",
"VG":"en",
"BF":"fr",
"BW":"en",
"ZA":"af",
"AL":"sq",
"DZ":"ar",
"BH":"ar",
"EG":"ar",
"IQ":"ar",
"JO":"ar",
"KW":"ar",
"LB":"ar",
"LY":"ar",
"MA":"ar",
"OM":"ar",
"QA":"ar",
"SA":"ar",
"SY":"ar",
"TN":"ar",
"AE":"ar",
"YE":"ar",
"AM":"hy",
"ES":"eu",
"BY":"be",
"BG":"bg",
"ES":"ca",
"CN":"zh",
"HK":"zh",
"MO":"zh",
"SG":"zh",
"TW":"zh",
"CHS":"zh",
"CHT":"zh",
"HR":"hr",
"CZ":"cs",
"DK":"da",
"MV":"div",
"BE":"nl",
"NL":"nl",
"AU":"en",
"BZ":"en",
"CA":"en",
"CB":"en",
"IE":"en",
"JM":"en",
"NZ":"en",
"PH":"en",
"ZA":"en",
"TT":"en",
"GB":"en",
"US":"en",
"ZW":"en",
"EE":"et",
"FO":"fo",
"IR":"fa",
"FI":"fi",
"BE":"fr",
"CA":"fr",
"FR":"fr",
"LU":"fr",
"MC":"fr",
"CH":"fr",
"ES":"gl",
"GE":"ka",
"AT":"de",
"DE":"de",
"LI":"de",
"LU":"de",
"CH":"de",
"GR":"el",
"IN":"gu",
"IL":"he",
"IN":"hi",
"HU":"hu",
"IS":"is",
"ID":"id",
"IT":"it",
"CH":"it",
"JP":"ja",
"IN":"kn",
"KZ":"kk",
"IN":"kok",
"KR":"ko",
"KZ":"ky",
"LV":"lv",
"LT":"lt",
"MK":"mk",
"BN":"ms",
"MY":"ms",
"IN":"mr",
"MN":"mn",
"NO":"nb",
"NO":"nn",
"PL":"pl",
"BR":"pt",
"PT":"pt",
"IN":"pa",
"RO":"ro",
"RU":"ru",
"IN":"sa",
"SK":"sk",
"SI":"sl",
"AR":"es",
"BO":"es",
"CL":"es",
"CO":"es",
"CR":"es",
"DO":"es",
"EC":"es",
"SV":"es",
"GT":"es",
"HN":"es",
"MX":"es",
"NI":"es",
"PA":"es",
"PY":"es",
"PE":"es",
"PR":"es",
"ES":"es",
"UY":"es",
"VE":"es",
"KE":"sw",
"FI":"sv",
"SE":"sv",
"SY":"syr",
"IN":"ta",
"RU":"ru",
"IN":"te",
"TH":"th",
"TR":"tr",
"UA":"uk",
"PK":"ur",
"VN":"vi"}

from geopy.geocoders import Nominatim
import json

location=[]
countries=[]
missing = open('./missingdata.txt', 'w')
f = open('./json1010', 'w')
for i in range(len(country_code_list)):
	location.append('')

	geolocator = Nominatim()
	location[i] = geolocator.geocode(country_name_list[i], timeout=100)
	try:
		latitude = location[i].latitude
	except:
		latitude=''
		missing.write('no latitude found for %s' % country_name_list[i]+'\n')
	try:
		longitude = location[i].longitude
	except:
		longitude=''
		missing.write('no longitude found for %s' % country_name_list[i]+'\n')
	if country_code_list[i].upper() in country_to_language:
		countries.append({'name':country_name_list[i], 'country_code':country_code_list[i], 'language_code':country_to_language[country_code_list[i].upper()], 'latitude':latitude, 'longitude':longitude})
	else:
		missing.write('no language code found for %s' % country_code_list[i].upper()+'\n')

f.write(json.dumps(countries)+'\n')
f.close()
