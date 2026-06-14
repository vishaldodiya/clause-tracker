FROM node:26-alpine AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN npm install -g pnpm && pnpm install
COPY . .

FROM base AS dev
CMD ["pnpm", "start", "--host", "0.0.0.0", "--poll", "2000"]

FROM base AS build
RUN pnpm run build

FROM nginx:alpine AS prod
COPY --from=build /app/dist/clause-tracker/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
