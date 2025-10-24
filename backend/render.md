Render deployment notes

- Create a new Web Service on Render using the repository root or the `backend/` folder.
- Set the build command to `npm install` and the start command to `npm start` (in the `backend/` folder).
- Add environment variables on Render: `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `PORT` (optional).
- Ensure the service has enough resources to run headless Chromium. You may prefer a "Starter" or "Standard" instance.
- Alternatively, use the provided `Dockerfile` for a container-based service.
