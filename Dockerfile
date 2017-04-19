FROM node:7.9-alpine
RUN mkdir /app
WORKDIR /app
COPY src /app/src
COPY include /app/include
COPY *.js *.json /app/
RUN npm install
ENTRYPOINT ["bin/cli.js"]
