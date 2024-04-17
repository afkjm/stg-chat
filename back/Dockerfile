FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app
RUN pnpm install
RUN pnpm build
EXPOSE 4173
CMD [ "pnpm", "run", "start:dev" ]
