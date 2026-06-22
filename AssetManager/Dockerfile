FROM node:20 AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build the app
COPY . ./
RUN npm run build --configuration=production

# Serve the app using Nginx
FROM nginx:alpine
COPY --from=build /app/dist/asset-manager/browser /usr/share/nginx/html
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]