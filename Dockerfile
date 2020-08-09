FROM node:alpine

RUN mkdir site

WORKDIR site

COPY package.json package-lock.json process.json ./

RUN npm install --only=production

COPY dist dist

COPY lib lib

EXPOSE 3000

ENTRYPOINT ["npm", "start"]
