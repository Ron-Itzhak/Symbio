
# # Stage 1: Build static files with Go
# FROM golang:latest AS builder
# WORKDIR /app
# COPY . .
# RUN go build -o generate_posts ./generate_posts.go
# RUN ./generate_posts



# Build the Next.js app
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Stage 2: Serve static files with NGINX
FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]