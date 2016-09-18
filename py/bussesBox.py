from __future__ import print_function
import json
import pickle
import requests
from shapely.geometry import shape, Point, Polygon
from pprint import pprint
import sys
import gevent
from gevent import monkey
monkey.patch_all()

from gevent.pool import Pool

lat1 = sys.argv[1]
lng1 = sys.argv[2]
lat2 = sys.argv[3]
lng2 = sys.argv[4]
coord1 = (float(lat1), float(lng1))
coord2 = (float(lat1), float(lng2))
coord3 = (float(lat2), float(lng2))
coord4 = (float(lat2), float(lng1))
rect = Polygon([coord1,coord2,coord3,coord4])
city_data = []
greenlets = []
urls = \
["https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%22http%3A%2F%2Fwww.ctabustracker.com%2Fbustime%2Fapi%2Fv1%2Fgetvehicles%3Fkey%3DQiQ2ywWJHstTYzTvk5D9feZrQ%26rt%3D11%2C12%2C15%2C18%2C19%2C20%2C21%2C22%2C24%2C26%22&format=json&diagnostics=true&callback=",
		"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%22http%3A%2F%2Fwww.ctabustracker.com%2Fbustime%2Fapi%2Fv1%2Fgetvehicles%3Fkey%3DQiQ2ywWJHstTYzTvk5D9feZrQ%26rt%3D28%2C29%2C30%2C33%2C34%2C35%2C36%2C37%2C39%2C43%22&format=json&diagnostics=true&callback=",
		"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%22http%3A%2F%2Fwww.ctabustracker.com%2Fbustime%2Fapi%2Fv1%2Fgetvehicles%3Fkey%3DQiQ2ywWJHstTYzTvk5D9feZrQ%26rt%3D44%2C47%2C48%2C49%2C50%2C51%2C52%2C53%2C54%2C55%22&format=json&diagnostics=true&callback=",
		"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%22http%3A%2F%2Fwww.ctabustracker.com%2Fbustime%2Fapi%2Fv1%2Fgetvehicles%3Fkey%3DQiQ2ywWJHstTYzTvk5D9feZrQ%26rt%3D56%2C57%2C59%2C60%2C62%2C63%2C65%2C66%2C67%2C68%22&format=json&diagnostics=true&callback=",
		"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%22http%3A%2F%2Fwww.ctabustracker.com%2Fbustime%2Fapi%2Fv1%2Fgetvehicles%3Fkey%3DQiQ2ywWJHstTYzTvk5D9feZrQ%26rt%3D70%2C71%2C72%2C73%2C74%2C75%2C76%2C77%2C78%2C79%22&format=json&diagnostics=true&callback=",
		"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%22http%3A%2F%2Fwww.ctabustracker.com%2Fbustime%2Fapi%2Fv1%2Fgetvehicles%3Fkey%3DQiQ2ywWJHstTYzTvk5D9feZrQ%26rt%3D80%2C81%2C82%2C84%2C85%2C86%2C87%2C88%2C90%2C91%22&format=json&diagnostics=true&callback=",
		"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%22http%3A%2F%2Fwww.ctabustracker.com%2Fbustime%2Fapi%2Fv1%2Fgetvehicles%3Fkey%3DQiQ2ywWJHstTYzTvk5D9feZrQ%26rt%3D92%2C93%2C94%2C96%2C97%2C100%2C103%2C106%2C108%2C111%22&format=json&diagnostics=true&callback=",
		"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%22http%3A%2F%2Fwww.ctabustracker.com%2Fbustime%2Fapi%2Fv1%2Fgetvehicles%3Fkey%3DQiQ2ywWJHstTYzTvk5D9feZrQ%26rt%3D112%2C115%2C119%2C120%2C121%2C124%2C125%2C126%2C132%2C134%22&format=json&diagnostics=true&callback=",
		"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%22http%3A%2F%2Fwww.ctabustracker.com%2Fbustime%2Fapi%2Fv1%2Fgetvehicles%3Fkey%3DQiQ2ywWJHstTYzTvk5D9feZrQ%26rt%3D135%2C136%2C143%2C146%2C147%2C148%2C151%2C152%2C155%2C156%22&format=json&diagnostics=true&callback=",
		"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%22http%3A%2F%2Fwww.ctabustracker.com%2Fbustime%2Fapi%2Fv1%2Fgetvehicles%3Fkey%3DQiQ2ywWJHstTYzTvk5D9feZrQ%26rt%3D157%2C165%2C169%2C170%2C171%2C172%2C192%2C201%2C205%2C206%22&format=json&diagnostics=true&callback=",
		"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%22http%3A%2F%2Fwww.ctabustracker.com%2Fbustime%2Fapi%2Fv1%2Fgetvehicles%3Fkey%3DQiQ2ywWJHstTYzTvk5D9feZrQ%26rt%3D8A%2CJ14%2C49B%2C52A%2C53A%2C54A%2C54B%2C55A%2C55N%2C62H%22&format=json&diagnostics=true&callback=",
		"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%22http%3A%2F%2Fwww.ctabustracker.com%2Fbustime%2Fapi%2Fv1%2Fgetvehicles%3Fkey%3DQiQ2ywWJHstTYzTvk5D9feZrQ%26rt%3D63W%2C81W%2C85A%2C95E%2C95W%2CX98%22&format=json&diagnostics=true&callback=",
]
responses = []
for url in urls:
	greenlets.append(gevent.spawn(requests.get,url))

#r = gevent.joinall(pool.map(get_json, urls))
gevent.sleep(1)
gevent.joinall(greenlets)
for r in greenlets:  
	j = r.value.json()
        #print(j, file=sys.stdout)
        if j['query']['results']['bustime-response'].has_key('vehicle'):
		for bus in j['query']['results']['bustime-response']['vehicle']:
			city_data.append(bus)
ret_busses = []
for bus in city_data:
	point = Point(float(bus['lat']), float(bus['lon']))
	if rect.contains(point):
		ret_busses.append(bus)
print(json.dumps(ret_busses))
