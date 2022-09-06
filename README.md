# MNIO

MNIO is a real-time multiplayer drawing canvas on the web.

The server is built with [Node.js](https://nodejs.org/en/), [Express](https://expressjs.com/), [Socket.io](https://socket.io/);
The client uses [Socket.io-client](https://socket.io/) and is bundled through [Webpack](https://webpack.org).

## Development

### 1. Install dev dependencies

```
npm install pm2 -g
```
```
npm run install:all
```

### 2. Bundle client in dev mode

```
npm run dev:bundle
```

### 3. Start developpement server

- A MySql / mariadb database is required.
- You can provide db credentials as environment variables in `srv/ecosystem.config.dev.cjs`.

```
npm run dev:server
```

## Production

- Requires Node.js 14+ running on your server
- A MySql / mariadb database connection is required
- Create a file named `srv/ecosystem.config.prod.cjs` with your environment variables (see `srv/ecosystem.config.dev.cjs`).

### 1. Bundle client

```
npm run build
```

### 2. Upload /dist, /srv and /package.json to your production server

### 3. Install dependencies on production server

```
npm install pm2 -g
```
```
npm run install:prod
```

### Start application

```
npm run start
```

## License
[MIT](https://choosealicense.com/licenses/mit/)