import re
import json
from geopy.geocoders import Nominatim

cf = open("country_language_table.tsv", 'r')
country_language_table = [line.split('\t') for line in cf.readlines()]
p=re.compile('[,\-\s]+')
stuff={}
countriesJson=[]
missing=[]
for line in country_language_table:
	delimiters=r'^[a-zA-Z0-9_]+$'
	language=re.findall(delimiters, line[15])[0]
	#print language
	print line[4]

	geolocator = Nominatim()
	location = geolocator.geocode(line[4], timeout=100)
	try:
		latitude = location.latitude
	except:
		latitude=''
		missing.append('no latitude found for %s' % line[4]+'\n')
		print('no latitude found for %s' % line[4]+'\n')
	try:
		longitude = location.longitude
	except:
		longitude=''
		missing.append('no longitude found for %s' % line[4]+'\n')
		print('no longitude found for %s' % line[4]+'\n')
	print 'latitude=',latitude
	print 'longitude=',longitude


	countriesJson.append(
	{
	'name':line[4],
	'country_code':line[0],
	'language_code':language,
	'latitude':latitude,
	'longitude':longitude
	})

#print country_language_table[0][0]
for country_obj in countriesJson:
	print country_obj['country_code']
	stuff[(country_obj['country_code'])] = country_obj

print stuff
cjj = (json.dumps(stuff, sort_keys=True, indent=4, separators=(',', ': ')))

print cjj
print missing
'''
countriesJson.append(
	{
	'name':country_name_list[i],
	'country_code':country_code_list[i],
	'language_code':country_to_language[country_code_list[i].upper()],
	'latitude':latitude, 'longitude':longitude
	})
'''