FROM node:18.9.1-alpine

# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY ./package*.json ./
# Copy app files
COPY . .

RUN yarn install 
# RUN yarn run start
CMD yarn run start

