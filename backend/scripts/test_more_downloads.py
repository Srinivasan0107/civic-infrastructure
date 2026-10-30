import urllib.request
import io
import pandas as pd

# Test Fix My Street
url_fms = "https://data.opencity.in/dataset/3a1a98f8-f924-4257-a2a1-3b957b55b9f5/resource/22be8fdc-532d-4ec8-8e31-2e6d26d5ce85/download/e03fbadf-ff1a-4fe1-9aad-a2a38a2bd81d.csv"
req = urllib.request.Request(url_fms, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req, timeout=30) as res:
    content = res.read(1024 * 300)
    df = pd.read_csv(io.BytesIO(content), nrows=5)
    print("Fix My Street Columns:", df.columns.tolist())
    print("FMS Row 0:", df.iloc[0].to_dict())

# Test Streetlights
url_sl = "https://data.opencity.in/dataset/68bab2e1-a94b-4ad5-b1b5-dc9658e462e4/resource/17cafe43-76ac-47fb-b893-fd2d2f0ebd0c/download/4aad68d1-752a-4ca0-b075-c40f27582a0f.csv"
req = urllib.request.Request(url_sl, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req, timeout=30) as res:
    content = res.read(1024 * 300)
    df = pd.read_csv(io.BytesIO(content), nrows=5)
    print("Streetlights Columns:", df.columns.tolist())
    print("Streetlights Row 0:", df.iloc[0].to_dict())
