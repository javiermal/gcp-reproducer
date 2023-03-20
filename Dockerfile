FROM node:18-bullseye-slim

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./

COPY prisma /app/prisma
# copy source code to /app/src folder
COPY src /app/src

# check files list
RUN ls -a

RUN npm install
RUN npm run build

ENV PORT=8080
EXPOSE 8080

CMD [ "node", "./dist/index.js" ]