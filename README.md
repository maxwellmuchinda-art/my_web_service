# Music Festival Line-Up – Single-Table CRUD App (ICT251 Activity 4, Question 7)

Stack: Node.js + Express + MySQL, with a plain HTML/JavaScript frontend.

```
lineup-crud/
├─ backend/
│  ├─ .env            (DB settings)
│  ├─ package.json
│  ├─ schema.sql      (table + 10 sample records)
│  ├─ init-db.js      (runs schema.sql for you)
│  ├─ db.js           (MySQL connection pool)
│  └─ server.js       (Express API + CORS)
├─ frontend/
│  ├─ index.html
│  └─ app.js
└─ postman/           (collection + environments, see postman/README.md)
```

## Run it locally

1. Install **Node.js (LTS)** and **XAMPP**. Open XAMPP and **Start MySQL**.
2. Open PowerShell in the project folder:
   ```
   cd backend
   npm install
   npm run init-db
   npm start
   ```
   `npm run init-db` creates the database `festival_lineup`, the `lineup` table and 10 sample records.
   (Alternative: import `schema.sql` through phpMyAdmin.)
3. Open **http://localhost:3000** in your browser. The server serves the frontend page.

If your MySQL root user has a password, set `DB_PASSWORD` in `backend/.env`.

## API endpoints

| Method | URL | Body |
|---|---|---|
| GET | /api/lineup | none |
| GET | /api/lineup/:id | none |
| POST | /api/lineup | JSON |
| PUT | /api/lineup/:id | JSON |
| DELETE | /api/lineup/:id | none |

Example body for POST / PUT (Postman: Body → raw → JSON):

```json
{
  "festival_name": "Lusaka Music Fest",
  "artist_name": "Artist 11",
  "stage": "Second Stage",
  "genre": "Gospel",
  "performance_date": "2026-12-06",
  "start_time": "20:30:00"
}
```

`festival_name` and `artist_name` are required (400 error if missing). Unknown ids return 404.

## Postman video checklist

Record your screen and show each request with its URL, method, body and JSON response:
GET all → GET one → POST → PUT → DELETE.

## Deploying to the cloud

1. Put the project on GitHub (`.env` is git-ignored).
2. Create a cloud MySQL database (for example on Railway, Aiven or TiDB Cloud). Run `schema.sql` on it.
3. Deploy the `backend` folder to a Node host (for example Render or Railway). Set these environment variables
   on the host: `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL`.
   Start command: `npm start`.
4. In `frontend/app.js`, change `API_URL` to your deployed address, e.g.
   `https://your-app.onrender.com/api/lineup`. Because the server also serves the frontend,
   your deployed link will show the page directly.
5. Share the four API links (GET, POST, PUT, DELETE) through the Google Form.

Your brief names Firebase, Supabase and FastAPI. Supabase is PostgreSQL and FastAPI is Python, so confirm with your lecturer
whether a Node.js + MySQL deployment on another host is accepted.
