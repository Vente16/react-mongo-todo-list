FROM node:18.20.2 AS builder

# Set the working directory in the container
WORKDIR /app

## Copy all the files
COPY . .

## Install the dependencies with yarn
RUN yarn install

# Genereate the build
RUN yarn build

# Stage 2: Serve with nginx
FROM nginx:stable-alpine

# Copy build app to nginx's working directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD [ "nginx", "-g" ,"daemon off;" ]