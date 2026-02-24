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

# Pre-create logs directory and set permissions
RUN mkdir -p logs && chown -R nodejs:nodejs logs

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

USER nodejs
EXPOSE 8080

CMD ["npm", "start"]