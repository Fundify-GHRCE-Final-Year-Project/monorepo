FROM ghcr.io/foundry-rs/foundry:latest

WORKDIR /contract

COPY . .

WORKDIR /contract/script/testing

USER root

CMD ["./deployment.sh"]
