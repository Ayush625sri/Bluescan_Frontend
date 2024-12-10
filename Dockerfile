# Use an official node image as a base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --include=dev

# Copy the rest of the application code
COPY . .

# Build the Vite project for production
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Vite app
CMD ["npm", "run", "dev", "--", "--host"]
