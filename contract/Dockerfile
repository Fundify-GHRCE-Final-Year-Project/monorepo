FROM ghcr.io/foundry-rs/foundry:latest

WORKDIR /contract

COPY . .

WORKDIR /contract/script/testing

USER root

RUN apt-get update && apt-get install -y dos2unix \
 && dos2unix ./deployment.sh ./.env.development \
 && chmod +x ./deployment.sh

CMD ["./deployment.sh"]
