FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Set default values for environment variables
ENV BACKEND_URL=http://backend:5002/recommend
ENV NEXT_PUBLIC_BACKEND_URL=http://localhost:5002/recommend

# Build the Next.js app
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application in production mode
CMD ["npm", "start"]