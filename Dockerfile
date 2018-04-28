# Create temporary builder image
FROM node:9.11 as builder
# Create app directory
WORKDIR /app
# Copy package.json and install build dependencies
COPY package.json yarn.lock ./
RUN yarn
# Copy app source and build app
COPY src ./src
COPY .babelrc ./
RUN yarn run build
# Re-build app dependencies for production only
RUN rm -r node_modules
RUN yarn --production

# Create application image
FROM node:9.11-alpine
# Create app directory
WORKDIR /app
# Copy application files
COPY --from=builder app/node_modules ./node_modules
COPY --from=builder app/build ./build
# Start application
ENTRYPOINT ["node"]
CMD ["build/services.js"]
