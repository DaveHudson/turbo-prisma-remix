# base node image
# v1
FROM node:16-bullseye-slim as base

# Install openssl for Prisma & git for Turbo repo 
RUN apt-get update && apt-get install -y openssl && apt-get install -y git

RUN mkdir /app
WORKDIR /app

COPY package.json ./
COPY . . 

RUN npm install 

ENV NODE_ENV=production

ADD prisma .
RUN npx prisma generate

RUN npm run build

COPY /apps/blog/build /app/build
COPY /apps/blog/public /app/public

# Running this in package.json leads to an error
# Myabe it was because above was not in place?
# RUN npx remix setup node

CMD ["npm", "run", "start"]
