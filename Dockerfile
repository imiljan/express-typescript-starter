FROM node:12.13.1

ENV NODE_ENV development

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install
COPY . .

EXPOSE 3000

CMD npm run dev
