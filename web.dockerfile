FROM node:16-slim as build_frontend

WORKDIR /frontend

COPY /frontend/package.json .
COPY /frontend/yarn.lock .
COPY /frontend/.yarnrc.yml .
COPY /frontend/.env .

RUN yarn install

COPY /frontend .

RUN yarn build

FROM node:16-slim as run

WORKDIR /app

COPY /backend/package.json .
COPY /backend/yarn.lock .
COPY /backend/.yarnrc.yml .

RUN yarn install

COPY /backend .

RUN mkdir build
COPY --from=build_frontend /frontend/build ./build

ENV PORT=80

EXPOSE 80

CMD ["yarn", "start"]
