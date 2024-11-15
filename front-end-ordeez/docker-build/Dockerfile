FROM node:20.11.1

# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY ./package*.json ./
# Copy app files
COPY . .

RUN npm install && npm i sharp && npm run build
# RUN yarn run start
CMD npm run start
