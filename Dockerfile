FROM node:7.9-alpine
RUN mkdir /app
WORKDIR /app
COPY bin /app/bin
COPY include /app/include
COPY lib /app/lib
COPY *.js *.json /app/
RUN npm install -g
ENTRYPOINT ["ngindox"]
