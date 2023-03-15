# MNIO
MNIO is a real-time multiplayer drawing canvas on the web.
- The server is built with [Node.js](https://nodejs.org/en/), [Express](https://expressjs.com/), [Socket.io](https://socket.io/);
- The client uses [Socket.io-client](https://socket.io/) and is bundled through [Vite](https://vitejs.dev/).
## Development
### 1. Install dev dependencies
```
npm install pm2 -g
```
```
npm run install
```
### 2. Bundle client in dev mode & start developpement server
- A MySql / mariadb database connection is required
- You can provide db credentials as environment variables
```
npm run dev
```
## Production
- Requires Node.js 14+ running on your server
- A MySql / mariadb database connection is required
- You can provide db credentials as environment variables
### 1. Bundle client
```
npm run build
```
### 2. Upload the following files to your server
- `package.json`
- `package-lock.json`
- `dist/`
- `lib/`
- `shared/`
- `views/`

### 3. Install dependencies on production server
```
npm run install
```
Eventually install pm2 globally if planning to run app with it (recommended)
```
npm install pm2 -g
```
### Start application
```
npm run start
```
or with pm2 (recommended)
```
pm2 start ecosystem.start.config.js
```

## License
[MIT](https://choosealicense.com/licenses/mit/)