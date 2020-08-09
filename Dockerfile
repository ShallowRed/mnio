FROM node:alpine

RUN mkdir site

WORKDIR site

COPY lib dist package.json package-lock.json process.json ./

RUN npm install --only=production

EXPOSE 3000

ENTRYPOINT ["npm", "start"]
