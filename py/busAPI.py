import pickle
import requests
import json
import xml.etree.ElementTree as ET

def get_all_stations():
  url = "http://www.ctabustracker.com/bustime/api/v1/getstops?key=QiQ2ywWJHstTYzTvk5D9feZrQ&rt=%s&dir=%s"
  

def routes():
  tr = ET.parse('../xml/getroutes.xml')
  r = tr.getroot()
  rts = r.getchildren()
  routes = []
  for rt in rts:
    routes.append(rt.findall("rt")[0].text)

  return routes

def get_all_directions():
  for rt in routes():
    url = "http://www.ctabustracker.com/bustime/api/v1/getdirections?key=QiQ2ywWJHstTYzTvk5D9feZrQ&rt=%s" % rt
    r = requests.get(url)
    with open('../xml/%s_directions.xml' % rt, 'wb') as f:
      f.write(r.text)

def get_directions(route):
  directions = []
  dtr = ET.parse('../xml/%s_directions.xml' % route)
  for direction in dtr.getroot().findall("dir"):
    directions.append(direction.text)
  return directions

def create_stops():
  url = "http://www.ctabustracker.com/bustime/api/v1/getstops?key=QiQ2ywWJHstTYzTvk5D9feZrQ&rt=%s&dir=%s" 
  stops = {}
  for route in routes():
    directions = get_directions(route)
    for direction in directions:
      r = requests.get(url % (route, direction))
      xml = r.text
      pxml = ET.fromstring(xml)
      for stop in pxml.findall("stop"):
        stopid = stop.findall("stpid")[0].text
        lat = stop.findall("lat")[0].text
        lng = stop.findall("lon")[0].text
        address = stop.findall("stpnm")[0].text
        if stops.has_key(stopid):
          stops[stopid].add_route(route)
        else:
          stop = aStop(stopid, address, lat, lng)
          stop.add_route(route)
 	  stops[stopid] = stop         
  with open("stops.pickle", "wb") as f:
    pickle.dump(stops, f)      

class aStop():
  def __init__(self, stopid, address, lat, lng):
    self.stopid = stopid
    self.address = address
    self.lat = float(lat)
    self.lng = float(lng)
    self.routes = []

  def set_address(self, address):
    self.address = address

  def set_latlng(self, lat, lng):
    self.lat = lat
    self.lng = lng
 
  def add_route(self, route):
    self.routes.append(route)
