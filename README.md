# Reactivate Test Task

A Node.js web application using Docker Compose and Redis for session management.
The application detects user activity and after one hour of activity, after blocks the user for 5 minutes before allowing them to resume their activity.
The application also allows users to log in from multiple devices simultaneously.

[![NestJS][nestjs-image]][nestjs-url]

## Requirements

Before starting, make sure you have at least those components on your workstation:
* Installed [Node.js][node-js-url] v18.10.0 or higher and up-to-date release of NPM;
* Installed up-to-date [Docker][docker-url];

## Quick start

Run docker & run next command to run Redis
```bash
docker-compose up
```

Install npm packages
```
npm install
```
Run project in dev mode
```
npm run start:debug
```

## Configuration

You can change some settings in the `.env` file.

* `AUTH_JWT_SECRET` - Required. JWT secret key;
* `SESSION_LIFETIME` - Optional. Session lifetime (in seconds). Default: `10800` (3 hours);
* `SESSION_ACTIVITY_DURATION` - Optional. User activity duration (in seconds), before blocking. Default: `3600` (1 hour);
* `SESSION_BLOCKING_DURATION` - Optional. Blocking duration (in seconds). Default: `300` (5 minutes);

> You can set `SESSION_ACTIVITY_DURATION` and `SESSION_BLOCKING_DURATION` as `60` to fast testing.

## Testing commands

Test user credentials:
1. `email`: `developer@reactivate.com`
2. `password`: `reactivate`

```bash
# Getting JWT accessToken
curl -X POST --location "http://localhost:3050/user/login" -H "Content-Type: application/json" -d "{\"email\": \"developer@reactivate.com\",\"password\": \"reactivate\"}"

# Getting my info ( You should replace ${accessToken} to your token from the /user/login request )
curl -X GET --location "http://localhost:3050/user-activity/my-info" -H "Authorization: Bearer ${accessToken}"

# Getting my headers ( You should replace ${accessToken} to your token from the /user/login request )
curl -X GET --location "http://localhost:3050/user-activity/my-headers" -H "Authorization: Bearer ${accessToken}"
```

[node-js-url]: https://nodejs.org
[docker-url]: https://www.docker.com
[nestjs-url]: https://nestjs.com
[nestjs-image]: https://badgen.net/npm/v/@nestjs/core