# Use an official Node.js runtime as the base image
FROM node:21-alpine3.18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if present) to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE ${APP_PORT}

# Command to run the application
CMD ["node", "server.js"]
