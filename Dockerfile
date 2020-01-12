FROM node
COPY ./package.json .
COPY ./public ./public
COPY server.js .
RUN npm install
EXPOSE 3000
CMD [ "npm", "run", "prod" ]