#!/usr/bin/python3
import os
import sys
import json
import pickle
import requests
import cherrypy
import subprocess
from shapely.geometry import shape, Point, Polygon

if subprocess.check_output("hostname") == "praxis\n":
  PATH = ""
else:
  sys.path.append("/var/www/cs424/p3/py")
  PATH = "/var/www/cs424/p3/py"

import busAPI

keys = [
  'QiQ2ywWJHstTYzTvk5D9feZrQ',
  'ZPGdZASnNbQmcCHCJYWbtT85x',
  'wJWGkWruLcW3XTrTXdEerSXaW',
  'WMCN7UEMwPnjQHeZVVF3USLJd',
  'VHgfmfVg4HGEQNgBKmutrfinn'
]

cherrypy.config.update({'environment': 'embedded', 'show_tracebacks': True, 'log.error_file': '/tmp/p3site.log'})

if cherrypy.__version__.startswith('3.0') and cherrypy.engine.state == 0:
	cherrypy.engine.start(blocking=False)
	atexit.register(cherrypy.engine.stop)

def get_json(url):
	r = requests.get(url)  
	return r.json()

class Root(object):
	""" Root class for the cherrypy instance running the backend """

	def index(self):
		"""Hello world, for index"""
		cherrypy.response.headers["Access-Control-Allow-Origin"] = "*"
		return 'Hello World!'
	index.exposed = True

	def get_nearby_stations(self, lat, lng, dist):
		cherrypy.response.headers["Access-Control-Allow-Origin"] = "*"
		r = requests.get('http://www.divvybikes.com/stations/json/')
		jsonData = r.json()
		stations = jsonData['stationBeanList']
		ret_stations = []
		circle = Point(float(lat),float(lng)).buffer(float(dist))
		for station in stations:
			point = Point(station['latitude'], station['longitude'])
			if circle.contains(point):
				ret_stations.append(station)
		return json.dumps(ret_stations)
	get_nearby_stations.exposed = True

        def get_busses_in_circle(self,key,lat,lng,dist):
          cherrypy.response.headers["Access-Control-Allow-Origin"] = "*"
          circle = Point(float(lat),float(lng)).buffer(float(dist))
          ourRoutes = []
          city_data = []
          with open(os.path.join(PATH, 'stops.pickle'), 'rb') as f:
            stops = pickle.load(f)
            for stopid, stop in stops.items():
              point = Point(float(stop.lat), float(stop.lng))
              if circle.contains(point):
                ourRoutes.extend(stop.routes)
         
          ten = []
          while (len(ourRoutes) > 10):
            ten.append(ourRoutes.pop()) 
            print ten
            if (len(ten) == 10):
              url = "http://www.ctabustracker.com/bustime/api/v1/getvehicles?key="+keys[0]+"&rt="+",".join(ten)+"&format=json&diagnostics=true&callback="
              r = requests.get(url)
              i=0
	      while (r.text.find("exceeded") != -1):
                url = "http://www.ctabustracker.com/bustime/api/v1/getvehicles?key="+keys[i]+"&rt="+",".join(ten)+"&format=json&diagnostics=true&callback="
                r = requests.get(url)
                i=i+1

              ten = []
              j = r.json()
              for bus in j['bustime-response'][0]['vehicle']:
                city_data.append(bus)
          url = "http://www.ctabustracker.com/bustime/api/v1/getvehicles?key="+keys[0]+"&rt="+",".join(ourRoutes)+"&format=json&diagnostics=true&callback="
          r = requests.get(url)
          i=0
          while (r.text.find("exceeded") != -1):
            url = "http://www.ctabustracker.com/bustime/api/v1/getvehicles?key="+keys[i]+"&rt="+",".join(ourRoutes)+"&format=json&diagnostics=true&callback="
            r = requests.get(url)
            i=i+1

          j = r.json()
          for bus in j['bustime-response'][0]['vehicle']:
            city_data.append(bus)

          ret_busses = []
          for bus in city_data:
            point = Point(float(bus['lat']), float(bus['lon']))
            if circle.contains(point):
              ret_busses.append(bus)
          return json.dumps(ret_busses)
        get_busses_in_circle.exposed = True

	def get_stations_in_box(self,lat1,lng1,lat2,lng2):
		cherrypy.response.headers["Access-Control-Allow-Origin"] = "*"
		coord1 = (float(lat1), float(lng1))
		coord2 = (float(lat1), float(lng2))
		coord3 = (float(lat2), float(lng2))
		coord4 = (float(lat2), float(lng1))
		rect = Polygon([coord1,coord2,coord3,coord4])
		r = requests.get('http://www.divvybikes.com/stations/json/')
		jsonData = r.json()
		stations = jsonData['stationBeanList']
		ret_stations = []
		for station in stations:
			point = Point(station['latitude'], station['longitude'])
			if rect.contains(point):
				ret_stations.append(station)
		return json.dumps(ret_stations)
	get_stations_in_box.exposed = True

	def get_busses_in_box(self, key, lat1, lng1, lat2, lng2):
	  cherrypy.response.headers["Access-Control-Allow-Origin"] = "*"
	  coord1 = (float(lat1), float(lng1))
	  coord2 = (float(lat1), float(lng2))
	  coord3 = (float(lat2), float(lng2))
	  coord4 = (float(lat2), float(lng1))
	  rect = Polygon([coord1,coord2,coord3,coord4])
          ourRoutes = []
          city_data = []
          with open(os.path.join(PATH, 'stops.pickle'), 'rb') as f:
            stops = pickle.load(f)
            for stopid, stop in stops.items():
              point = Point(float(stop.lat), float(stop.lng))
              if rect.contains(point):
                ourRoutes.extend(stop.routes)

          ten = []
          while (len(ourRoutes) > 10):
            ten.append(ourRoutes.pop())
            print ten
            if (len(ten) == 10):
              url = "http://www.ctabustracker.com/bustime/api/v1/getvehicles?key="+keys[0]+"&rt="+",".join(ten)+"&format=json&diagnostics=true&callback="
              r = requests.get(url)
              i = 1
              while (r.text.find("exceeded") != -1):
                url = "http://www.ctabustracker.com/bustime/api/v1/getvehicles?key="+keys[i]+"&rt="+",".join(ten)+"&format=json&diagnostics=true&callback="
                r = requests.get(url)
                i = i+1
              ten = []
              j = r.json()
              for bus in j['bustime-response'][0]['vehicle']:
                city_data.append(bus)
          url = "http://www.ctabustracker.com/bustime/api/v1/getvehicles?key="+keys[0]+"&rt="+",".join(ourRoutes)+"&format=json&diagnostics=true&callback="
          r = requests.get(url)
          i = 0
          while (r.text.find("exceeded") != -1):
            url = "http://www.ctabustracker.com/bustime/api/v1/getvehicles?key="+keys[i]+"&rt="+",".join(ourRoutes)+"&format=json&diagnostics=true&callback="
            r = requests.get(url)
            i = i+1

          j = r.json()
          for bus in j['bustime-response'][0]['vehicle']:
            city_data.append(bus)


          ret_busses = []
          for bus in city_data:
            point = Point(float(bus['lat']), float(bus['lon']))
            if rect.contains(point):
              ret_busses.append(bus)
          return json.dumps(ret_busses)
        get_busses_in_box.exposed = True

application = cherrypy.Application(Root(), script_name=None, config=None)
