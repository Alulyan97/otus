FROM node:24-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY src/ ./src/       
EXPOSE 8081
CMD ["node", "src/server.js"] 