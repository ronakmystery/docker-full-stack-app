FROM node:18

WORKDIR /app

# Copy package.json first to install dependencies
COPY package.json package-lock.json ./

RUN npm install && npm install -g nodemon

# Copy the rest of the files
COPY . .

# Expose WebSocket and HTTP ports
EXPOSE 5000 5001

# Set CMD to use nodemon (this is overridden in docker-compose)
CMD ["npx", "nodemon", "--legacy-watch", "/app/server.js"]
