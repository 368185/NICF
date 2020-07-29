FROM node:latest

ENV APP_DIR=/app APP_PORT=3000

WORKDIR ${APP_DIR}

ADD main.js .
ADD package.json .
ADD package-lock.json .
ADD public public

RUN npm install

EXPOSE ${APP_PORT}

ENTRYPOINT [ "node", "main.js" ]

CMD [ "${APP_PORT}" ]
