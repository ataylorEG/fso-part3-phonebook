# Use the official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy everything
COPY . .

# Install the backend dependencies
RUN npm ci

# Label
LABEL fly_launch_runtime="nodejs"

CMD [ "npm", "start" ]