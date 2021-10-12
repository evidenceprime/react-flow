FROM node:14.18.0-bullseye-slim

RUN apt-get update && apt-get install git bzip2 python build-essential -y

RUN mkdir /home/build
WORKDIR /home/build

ARG UID=45006
RUN adduser --disabled-password --no-create-home --uid $UID --gecos '' build

ARG npm_token

ADD .npmrc.tpl /root/
RUN sed -i 's/NPM_TOKEN/'"$npm_token"'/' /root/.npmrc.tpl

COPY . .

RUN mv /root/.npmrc.tpl .npmrc
RUN chown -R build:build /home/build
USER build

RUN npm install
RUN npm publish