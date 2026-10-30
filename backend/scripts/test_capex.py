import urllib.request
import io
import pandas as pd

# 1. Capital Expenditure (Work Orders & Payments)
url_capex = "https://data.opencity.in/dataset/7ec5a0b8-4ba1-4608-bcc3-f2f560cb5498/resource/69f841d1-3d39-4ec1-979d-69c1b063fe1b/download/dacd5d63-7812-4e43-b3ab-f492ae6b64ac.csv"
req = urllib.request.Request(url_capex, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req, timeout=30) as res:
    content = res.read(1024 * 300)
    df = pd.read_csv(io.BytesIO(content), nrows=5, encoding="latin1")
    print("CapEx Columns:", df.columns.tolist())
    print("CapEx Row 0:", df.iloc[0].to_dict())

# 2. Ward Information
url_ward = "https://data.opencity.in/dataset/87b978d1-352e-4b90-aa2c-9991e55d3425/resource/01d485da-6509-4555-ab4c-036720ad0c51/download/3648198e-a595-4c6b-b76e-2ec180fc9f14.csv"
req = urllib.request.Request(url_ward, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req, timeout=30) as res:
    content = res.read(1024 * 300)
    df = pd.read_csv(io.BytesIO(content), nrows=5, encoding="latin1")
    print("Ward Info Columns:", df.columns.tolist())
    print("Ward Info Row 0:", df.iloc[0].to_dict())
