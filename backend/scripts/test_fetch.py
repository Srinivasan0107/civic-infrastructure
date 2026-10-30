import urllib.request
import urllib.parse
import json

print("Testing live dataset connections...")

# 1. NYC 311 Socrata Open Data
try:
    url = "https://data.cityofnewyork.us/resource/erm2-nwe9.json?$limit=10&complaint_type=Street%20Condition"
    req = urllib.request.Request(url, headers={"User-Agent": "CivicMemoryETL/1.0"})
    with urllib.request.urlopen(req, timeout=10) as res:
        data = json.loads(res.read().decode())
        print(f"NYC 311: SUCCESS ({len(data)} records retrieved)")
except Exception as e:
    print(f"NYC 311: FAILED ({e})")

# 2. NYC DOT Potholes Socrata Open Data
try:
    url = "https://data.cityofnewyork.us/resource/x9wy-ing4.json?$limit=10"
    req = urllib.request.Request(url, headers={"User-Agent": "CivicMemoryETL/1.0"})
    with urllib.request.urlopen(req, timeout=10) as res:
        data = json.loads(res.read().decode())
        print(f"NYC DOT Potholes: SUCCESS ({len(data)} records retrieved)")
except Exception as e:
    print(f"NYC DOT Potholes: FAILED ({e})")

# 3. OpenStreetMap Overpass (Bengaluru roads)
try:
    query = '[out:json][timeout:15];way["highway"~"primary|secondary"](12.92,77.60,12.95,77.65);out body geom 10;'
    url = "https://overpass-api.de/api/interpreter?data=" + urllib.parse.quote(query)
    req = urllib.request.Request(url, headers={"User-Agent": "CivicMemoryETL/1.0"})
    with urllib.request.urlopen(req, timeout=15) as res:
        osm_data = json.loads(res.read().decode())
        print(f"OSM Bengaluru: SUCCESS ({len(osm_data.get('elements', []))} road ways retrieved)")
except Exception as e:
    print(f"OSM Bengaluru: FAILED ({e})")
