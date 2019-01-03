FROM node:8-alpine

RUN apk update && apk add yarn python g++ make && rm -rf /var/cache/apk/*

WORKDIR /app

COPY . .

RUN yarn install

EXPOSE 3000

CMD ["yarn", "start"]