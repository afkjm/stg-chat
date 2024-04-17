FROM node:21.7.3 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app
RUN pnpm install
RUN pnpm build
EXPOSE 4173
CMD [ "pnpm", "run", "start:dev" ]
