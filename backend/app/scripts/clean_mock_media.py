import pymongo

client = pymongo.MongoClient('mongodb://127.0.0.1:27017')
db = client['civic_memory']

mock_filenames = [
    'India_000142.jpg',
    'India_000289.jpg',
    'India_000512.jpg',
    'India_000840.jpg',
    'citizen_pothole.jpg'
]

mock_ids = [
    'ATT-RDD2022-D40-00',
    'ATT-RDD2022-D20-01',
    'ATT-RDD2022-D00-02',
    'ATT-RDD2022-D10-03',
    'IMG-35DB403B'
]

res1 = db['media_attachments'].delete_many({
    '$or': [
        {'filename': {'$in': mock_filenames}},
        {'attachment_id': {'$in': mock_ids}}
    ]
})

res2 = db['damage_detections'].delete_many({
    'attachment_id': {'$in': mock_ids}
})

res3 = db['visual_embeddings'].delete_many({
    'attachment_id': {'$in': mock_ids}
})

res4 = db['visual_matches'].delete_many({
    '$or': [
        {'attachment_a_id': {'$in': mock_ids}},
        {'attachment_b_id': {'$in': mock_ids}}
    ]
})

print(f"Deleted {res1.deleted_count} mock attachments.")
print(f"Deleted {res2.deleted_count} mock detections.")
print(f"Deleted {res3.deleted_count} mock embeddings.")
print(f"Deleted {res4.deleted_count} mock visual matches.")

remaining = list(db['media_attachments'].find({}, {'attachment_id': 1, 'filename': 1, 'file_size': 1}))
print(f"Remaining live attachments ({len(remaining)}):")
for r in remaining:
    print(f" - {r.get('attachment_id')}: {r.get('filename')} ({r.get('file_size')} bytes)")
