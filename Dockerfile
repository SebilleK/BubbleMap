# Dockerfile

# Use the official Bun image
FROM oven/bun:1

# Working dir
WORKDIR /BubbleMap

# DOCKER PRISMA FIX WITH BUN
# Copy Node.js from the Node.js image
# COPY --from=node:18 /usr/local/bin/node /usr/local/bin/node
#! Please read the README.md file on "Dockerization"...

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies #! --frozen-lockfile
RUN bun install 

# Copy the rest of the application + Prisma config files
COPY . .
COPY prisma ./prisma

# Generate prisma client
RUN bunx prisma generate

# Create prisma database
# RUN bunx prisma db push 
#! Please refer to README.md on "Quickstart"...

# run the app
CMD ["bun", "run", "dev"]