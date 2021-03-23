# Set up Static files
FROM node:latest AS static-builder
RUN mkdir /app
ADD . /app
WORKDIR /app
RUN yarn install
RUN yarn build

# Set up Nginx
FROM nginx:latest
COPY --from=static-builder /app /app
WORKDIR /app/nginx
RUN cp ./nginx.conf /etc/nginx/conf.d/default.conf