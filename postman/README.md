# Postman files

| File | Purpose |
|---|---|
| Lineup_API.postman_collection.json | The 5 required requests (GET all, GET one, POST, PUT, DELETE) plus an optional 404 check |
| Lineup_Local.postman_environment.json | baseUrl = http://localhost:3000 |
| Lineup_Render.postman_environment.json | baseUrl = your Render link (edit it first) |

## How to use
1. In Postman: **Import** and select all three files.
2. Edit the **Lineup Render** environment: replace `https://YOUR-APP-NAME.onrender.com` with your real Render link (no trailing slash).
3. Pick the environment in the top-right dropdown.
4. Open the collection and send requests 1 to 6 in order.
   Request 3 (POST) saves the new id automatically, and requests 4, 5 and 6 use it.

If your Postman is the Lightweight API Client and cannot import collections, create each request by hand using the
URLs and JSON bodies shown in these files.

Before recording, open your Render link in a browser once so the free server is awake.
