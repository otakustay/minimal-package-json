# minimal-package-json

A small package to minimize package.json content

## Why

Sometimes we need a `package.json` with minimal size and keep its content identical as long as possible.

Take `Dockerfile` as an example, to build a fresh docker image, we may create a bundle like:

```shell
mkdir dist
cp index.js package.json package-lock.json dist
```

With a `Dockerfile` installing dependencies in docker:

```dockerfile
FROM node:alpine
ENV NODE_ENV production
COPY dist /app
WORKDIR /app
RUN npm install --production
CMD npm start
EXPOSE 8080
```

With a shell command to build this image:

```shell
docker build -t some-image-name -f Dockerfile dist
```

This possibly cause a long `npm install` on each `docker build` when some unrelated properties in `package.json` are changed.

The `minimal-package-json`
