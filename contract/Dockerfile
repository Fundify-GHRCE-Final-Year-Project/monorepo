FROM ghcr.io/foundry-rs/foundry:latest

WORKDIR /contract

COPY . .

WORKDIR /app/script/testing
COPY --chmod=755 script/testing/deployment.sh .

CMD ["./deployment.sh"]
