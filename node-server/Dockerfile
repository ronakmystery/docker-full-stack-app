FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy app files AFTER installing
COPY . .

# Start with production-safe command
CMD ["npm", "start"]
