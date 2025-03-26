# To get started
- Setup two .env files. One inside the client directory and one inside the server directory.
- In the client directory .env file make sure it has, an AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET and a NEXT_PUBLIC_API_URL
- For the server .env file make sure it has a DATABASE_URL and DIRECT_URL for a postgres database.

If the steps above are completed. Switch into the server directory and inside the terminal execute ```npm run dev``` this should start the backend server. For the frontend follow the same steps, switch into the client directory and run ```npm run dev```. Connect to localhost:3000.
