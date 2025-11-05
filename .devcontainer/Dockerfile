FROM debian:12.12

RUN apt-get update && apt-get install -y bash curl && \
    apt-get install build-essential python3 -y

RUN mkdir -p /var/www/html
WORKDIR /var/www/html

ARG NODE_VERSION=20
# install nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# set env
ENV NVM_DIR=/root/.nvm
RUN bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION"
SHELL ["/bin/bash", "-c", "source $NVM_DIR/nvm.sh && \"$@\""]

RUN nvm install --lts