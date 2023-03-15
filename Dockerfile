FROM node:latest

COPY . /project

WORKDIR /project

RUN npm run install

ENTRYPOINT ["npm", "run", "start"]
