import urllib.request
import json

for query in ["streetlights", "grievance", "fix-my-street", "pothole"]:
    try:
        url = f"https://data.opencity.in/api/3/action/package_search?q={query}&rows=5"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as res:
            data = json.loads(res.read().decode())
            packages = data.get("result", {}).get("results", [])
            print(f"=== Query: {query} (Found {len(packages)}) ===")
            for p in packages:
                print(" - Title:", p.get("title"))
                for r in p.get("resources", []):
                    print(f"    * {r.get('name')} [{r.get('format')}]: {r.get('url')}")
    except Exception as e:
        print(f"Query {query} error:", e)
