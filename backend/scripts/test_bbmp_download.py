import urllib.request
import io
import pandas as pd

url = "https://data.opencity.in/dataset/54344a76-a37a-4d05-961c-df9bac5494ad/resource/2a3f29ef-a7a1-4fc3-b125-cbcc958a89d1/download/82f88d50-71c5-4203-92ac-5ccb5cabc7a2.csv"
print("Downloading BBMP Grievances 2024...")
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req, timeout=30) as res:
    content = res.read(1024 * 500) # Read first 500 KB to inspect header and sample
    df = pd.read_csv(io.BytesIO(content), nrows=10)
    print("Downloaded successfully! Columns:")
    print(df.columns.tolist())
    print("First 2 rows:")
    print(df.head(2).to_dict(orient="records"))
