FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Generate Prisma client and build Next.js
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

# Start Next.js
CMD ["npm", "start"]
