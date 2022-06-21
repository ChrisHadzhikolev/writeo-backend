FROM node:14 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
#RUN #curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin
RUN npm run build
#RUN #npm prune --production

FROM node:14-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./.env
CMD ["node", "dist/main.js"]
