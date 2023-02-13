FROM node:latest

# Make sure we have the latest version of pnpm
RUN npm install -g pnpm

# Create bot directory
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN pnpm install

# Bundle bot source
COPY . /usr/src/bot

# Start the bot
CMD [ "pnpm", "start" ]