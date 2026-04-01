# Dental Frontend

React + Vite frontend for the dental booking app.

## Local development

1. Install dependencies:

```bash
npm ci
```

2. Copy envs:

```bash
cp .env.example .env
```

3. Start the frontend:

```bash
npm run dev
```

Vite now binds to `0.0.0.0:5173`, so if your server IP is `52.55.79.225`, the login page opens at:

```text
http://52.55.79.225:5173/login
```

`VITE_DEV_API_TARGET` controls which backend the dev server proxies to.

## Environment variables

`VITE_API_BASE_URL`
Frontend API base URL used at build time. Examples:
- `/api` for same-origin reverse proxy
- `https://api.example.com/api` for separate backend deployment

`VITE_API_ORIGIN`
Optional explicit backend origin for media URLs. If empty, it is inferred from `VITE_API_BASE_URL`.

`VITE_DEV_API_TARGET`
Backend target for Vite dev proxy.

`APP_API_BASE_URL`
Optional runtime override for the nginx container. Use this when frontend and backend are deployed separately.

`APP_API_ORIGIN`
Optional runtime override for media origin inside the nginx container.

`NGINX_API_UPSTREAM`
Optional nginx proxy upstream. Default is `http://backend:8000` to preserve docker-compose compatibility.

## Production

For separate frontend/backend deployment, build and run the frontend with an absolute backend URL:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://api.example.com/api \
  --build-arg VITE_API_ORIGIN=https://api.example.com \
  -t dental-frontend .

docker run -d \
  -p 80:80 \
  -e APP_API_BASE_URL=https://api.example.com/api \
  -e APP_API_ORIGIN=https://api.example.com \
  dental-frontend
```

If you still want same-origin proxying through nginx, keep `APP_API_BASE_URL=/api` and point `NGINX_API_UPSTREAM` to your backend.
