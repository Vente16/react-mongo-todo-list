FROM node:18.20.2

# Set the working directory in the container
WORKDIR /usr/src/app

## Copy all the files
COPY . .

## Install the dependencies with yarn
RUN yarn install

EXPOSE 3000

CMD [ "yarn", "start"]