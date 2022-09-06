FROM node:latest

COPY . /project

WORKDIR /project

RUN npm install pm2 -g

RUN npm run install:prod

ENTRYPOINT ["npm", "run", "start"]
