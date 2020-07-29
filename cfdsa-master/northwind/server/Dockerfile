##### For building the image

# this image will be based on Node v14
FROM node:14

# environment varibla to define my workspace
# for applcation
ENV APP_DIR=/app APP_PORT=3000 
# for database
ENV DB_USER=root DB_PASSWORD=changeit

# create and cd to into APP_DIR
# mkdir /app
# cd /app
WORKDIR ${APP_DIR}

# copy the file from fortune into /app
ADD main.js .
ADD package.json .
ADD package-lock.json .

# copy the directories
ADD config config
ADD public public
ADD views views

# install the dependencies - package.json
RUN npm install

##### For building the image

##### For running the image

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -s -f http://localhost:${APP_PORT}/health || exit 1

# the port the application is exposing
# EXPOSE is just for documentation
EXPOSE ${APP_PORT}

# run the application
ENTRYPOINT ["node", "main.js"]

##### For running the image