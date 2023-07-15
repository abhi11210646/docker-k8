FROM harbor.one.com/standard-images/ubuntu:focal

# Install necessary packages
RUN apt-get update ; \
apt-get install -y --no-install-recommends \
python3 build-essential dumb-init;

# Install Nodejs
ENV NODE_VERSION 18.14.0
RUN set -eux ; \
  cd / ; \
  curl -O https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz ; \
  tar -zxf node-v$NODE_VERSION-linux-x64.tar.gz -C /usr/lib ; \
  ln -s /usr/lib/node-v$NODE_VERSION-linux-x64/bin/node /usr/bin/node ; \
  ln -s /usr/lib/node-v$NODE_VERSION-linux-x64/bin/npm /usr/bin/npm ; \
  ln -s /usr/lib/node-v$NODE_VERSION-linux-x64/bin/npx /usr/bin/npx ; \
  rm node-v$NODE_VERSION-linux-x64.tar.gz

ENV PORT 3000

# TODO: Change user from root to node(any name)

RUN mkdir /app

WORKDIR /app
COPY . /app/
EXPOSE 3000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node","server.js"]

# docker pull harbor.one.com/webdev-india/helloworld:a1s2d3