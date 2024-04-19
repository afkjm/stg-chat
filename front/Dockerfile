FROM node:21.7.3
# Install pnpm globally
RUN npm install -g pnpm
WORKDIR /app
# Copy pnpm-lock.yaml and package.json
COPY package.json ./
# Install project dependencies using pnpm
RUN pnpm install
# Copy source code
COPY . .
# Command to run the container
CMD pnpm run dev --host --port=4173
