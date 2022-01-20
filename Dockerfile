FROM node:17-buster as BUILD
WORKDIR /build/
COPY package.json /build/
RUN npm i

FROM debian:buster-slim AS RUN
RUN apt-get update && apt-get -y install curl && curl -fsSL https://deb.nodesource.com/setup_17.x | bash - && apt-get install -y nodejs
WORKDIR /app/
COPY --from=BUILD /build/node_modules /app/node_modules

EXPOSE 3000

COPY *.js *.mjs package.json /app/
COPY Managers /app/Managers
COPY Services /app/Services

CMD bash -c 'while !</dev/tcp/db/5432; do sleep 1; done; npm start'