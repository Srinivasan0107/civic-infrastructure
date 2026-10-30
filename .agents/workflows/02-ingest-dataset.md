# Workflow: Ingest a Dataset into Local MongoDB

## Before import
- Identify publisher, dataset title, URL, geographic/time coverage, licence/terms and retrieval date.
- Select a mapping profile (complaint, asset, maintenance, inspection, GeoJSON, media).
- Confirm the source is permitted for the intended use.
- Check file type/size and archive safety.

## Execute
1. Upload source bytes to GridFS and compute SHA-256.
2. Create an `ingestion_jobs` document with source metadata and pipeline version.
3. Parse in chunks and preserve every row in `raw_records`.
4. Apply mapping profile; retain original source values.
5. Validate field types, dates, coordinates, IDs and required columns.
6. Write invalid rows to `rejected_records` with explicit reasons.
7. Upsert canonical documents using source identity and idempotency keys.
8. Resolve source asset IDs; otherwise calculate geospatial candidates and leave uncertain links unconfirmed.
9. Generate multilingual embeddings only for usable text; record model/revision.
10. Build semantic candidates, clusters and priority snapshots as separate, versioned jobs.
11. Store final counters and update the pipeline dashboard.

## After import
- Verify raw count = accepted + rejected (subject to explicitly documented non-row file entries).
- Re-run the same file and confirm no duplicate canonical records.
- Inspect sample records and source provenance.
- Review missing coordinates, unresolved asset links, language detection and date parsing.
- Export rejected rows and retain them for correction/re-import.

## Never
- Delete or rewrite raw records to make a dataset look clean.
- Invent asset IDs, coordinates, repair costs or completion dates.
- Mix NYC benchmark records into Bengaluru operational metrics.
- Count synthetic examples in production KPIs or model validation.
