FROM node

# Create app directory
WORKDIR /app

# Install app dependencies
COPY . .

# Build app and remove npm token
RUN npm i && npm run build

# Start service
CMD ["npm", "start"]
