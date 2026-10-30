import urllib.request
import json

try:
    url = "https://data.opencity.in/api/3/action/package_search?q=bbmp&rows=10"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    with urllib.request.urlopen(req, timeout=15) as res:
        data = json.loads(res.read().decode())
        packages = data.get("result", {}).get("results", [])
        print(f"Found {len(packages)} BBMP packages on OpenCity:")
        for p in packages:
            print(" -", p.get("title"), "(name:", p.get("name"), ")")
            for r in p.get("resources", []):
                print("     Resource:", r.get("name"), "| format:", r.get("format"), "| url:", r.get("url"))
except Exception as e:
    print("CKAN Search failed:", e)
