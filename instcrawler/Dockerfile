FROM node:5.10.0

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install --production
RUN npm install -g nodemon

# Bundle app source
COPY . /usr/src/app

CMD [ "npm", "start" ]