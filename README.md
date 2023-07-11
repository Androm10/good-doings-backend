
## To start

## Installation

```bash
$ pnpm install
```

# Env
 create env files (.dev.env, .prod.env, .env)
 ## add env params (for example):
    DB_DIAL=postgres
    DB_HOST=postgres
    DB_PORT=5432
    DB_USER=root
    DB_PASS=1111
    DB_NAME=good-doings
    PORT=3000
    REDIS_HOST=redis
    REDIS_PORT=6379
 ## also can add
    AUTH_SECRET
    AUTH_EXPIRES
    AUTH_REFRESH_SECRET
    AUTH_REFRESH_EXPIRES

# Docker
  ## Run only services by 
  ```bash
  $ docker compose -f docker-compose-services.yml up
  ```
  ## Run with application by
  ```bash
  $ docker compose up --build
  ```
# Running the app

```bash

# development mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```
