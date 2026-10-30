import urllib.request
import urllib.parse
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Query Bellandur & Koramangala main roads
osm_query = """[out:json][timeout:15];
(
  way["highway"~"primary|secondary"](12.92,77.62,12.95,77.67);
);
out body geom 25;"""

endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
]

success = False
for ep in endpoints:
    try:
        url = ep + "?data=" + urllib.parse.quote(osm_query)
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, context=ctx, timeout=12) as res:
            data = json.loads(res.read().decode())
            elements = data.get("elements", [])
            print(f"OSM from {ep}: SUCCESS! Retrieved {len(elements)} road elements.")
            if elements:
                success = True
                break
    except Exception as e:
        print(f"OSM from {ep} failed: {e}")
