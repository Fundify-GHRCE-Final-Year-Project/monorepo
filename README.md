This repository will have all the code for fundify. This includes -

1. Website (Next.js & TypeScript)
2. Ethereum Smart Contract (Solidity)
3. Indexer (TypeScript)

Local Development Instructions :-

1. Run `docker compose build` to build the docker containers
2. Run `docker compose up` to start all containers after build
3. Run `cd contract/script/testing && ./deployment.sh` to deploy the contract on local ethereum node
4. Connect to local mongodb using below url and mongodb compass
5. Open the website at below url

URLs for services -

1. Local Ethereum Node - http://localhost:8545
2. MongoDB - mongodb://admin:admin@fundify@localhost:27017/test?authSource=admin
3. Website - http://localhost:3000

Note - Contract container is only for deploying the contract on the local ethereum node so it doesn't expose any ports nor has one. Indexer is not a server so it doesn't expose a port either.
