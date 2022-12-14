FROM node:alpine

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

# --only=prod Skipping dev dependencies installation inside our container (Testing only)
RUN npm install --only=prod

COPY . /app

CMD [ "npm", "start" ]