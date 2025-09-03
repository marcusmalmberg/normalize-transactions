FROM node:18-alpine

RUN apk add --no-cache bash git openssh python3 make g++ py3-pip

WORKDIR /usr/src

CMD ["yarn", "gatsby", "develop", "-H", "0.0.0.0" ]
