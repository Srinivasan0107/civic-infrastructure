import urllib.request
import ssl
import json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# 1. NYC 311
try:
    url = "https://data.cityofnewyork.us/resource/erm2-nwe9.json?$limit=5&complaint_type=Street%20Condition"
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
    })
    with urllib.request.urlopen(req, context=ctx, timeout=15) as res:
        data = json.loads(res.read().decode())
        print(f"NYC 311: SUCCESS! {len(data)} records retrieved.")
        print("NYC 311 Row 0 keys:", list(data[0].keys())[:8])
except Exception as e:
    print("NYC 311 error:", e)

# 2. NYC DOT Potholes
try:
    url = "https://data.cityofnewyork.us/resource/x9wy-ing4.json?$limit=5"
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
    })
    with urllib.request.urlopen(req, context=ctx, timeout=15) as res:
        data = json.loads(res.read().decode())
        print(f"NYC DOT Potholes: SUCCESS! {len(data)} records retrieved.")
        print("NYC DOT Row 0 keys:", list(data[0].keys())[:8])
except Exception as e:
    print("NYC DOT error:", e)
