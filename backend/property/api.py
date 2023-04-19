import requests

url = "http://127.0.0.1:8000/properties/create/"
access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc4OTMzNzYwLCJpYXQiOjE2Nzg5MzAxNjAsImp0aSI6ImVlMWFkODljYmU1ODQ3NmE5ODI4YWYwZTEyMDRiZjhjIiwidXNlcl9pZCI6MTN9.IsQFIdK26_MFH-pGMzo0Zynn2pFC32LD8-fe1sz_lD4"
headers = {
    "Authorization": f"Bearer {access_token}",
}

response = requests.get(url, headers=headers)
print(f"Status code: {response.status_code}")
print(f"Response text: {response.text}")

try:
    print(response.json())
except requests.exceptions.JSONDecodeError:
    print("Error: Could not decode the response as JSON.")