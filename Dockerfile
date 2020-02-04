FROM node
RUN mkdir -p /app
WORKDIR /app
COPY ./package.json .
COPY ./public ./public
COPY ./dgraph ./dgraph
COPY ./markdown ./markdown
COPY ./scorm ./scorm
COPY ./src ./src
COPY server.js .
COPY rollup.config.js .
RUN npm install
EXPOSE 3000
CMD [ "npm", "run", "prod" ]