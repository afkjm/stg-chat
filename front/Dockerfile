FROM node:21.7.3
RUN npm install -g pnpm
WORKDIR /app
COPY . .
RUN pnpm install
CMD pnpm run dev --host --port=4173
