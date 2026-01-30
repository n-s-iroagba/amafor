FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy built files and production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production --ignore-scripts
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Copy tsconfig.json for module resolution
COPY --chown=nodejs:nodejs tsconfig.json ./

USER nodejs
EXPOSE 8080

CMD ["npm", "start"]