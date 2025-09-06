# 🚀 Fundify

A comprehensive Web3 crowdfunding platform built with modern technologies and blockchain integration.

## 📦 Project Structure

This repository contains all the core components of the Fundify platform:

- **🌐 Website** - Next.js & TypeScript frontend application
- **⛓️ Smart Contract** - Ethereum smart contracts written in Solidity
- **🔄 Indexer** - TypeScript-based blockchain event indexer

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** - Required for npm package management
- **Docker Desktop** - Essential for local development environment

## 🚀 Quick Start

Follow these steps to get your local development environment running:

### 1. Build Docker Containers

```bash
docker compose build
```

### 2. Start All Services

```bash
docker compose up
```

### 3. Deploy Smart Contracts

```bash
cd contract/script/testing && ./deployment.sh
```

### 4. Connect to Database

Use the MongoDB connection string below with MongoDB Compass or your preferred client.

### 5. Access the Application

Navigate to the website URL provided below to start using Fundify locally.

## 🌐 Service URLs

| Service           | URL                                                                   | Description                  |
| ----------------- | --------------------------------------------------------------------- | ---------------------------- |
| **Website**       | http://localhost:3000                                                 | Main Fundify web application |
| **Ethereum Node** | http://localhost:8545                                                 | Local blockchain node        |
| **MongoDB**       | `mongodb://admin:admin@fundify@localhost:27017/test?authSource=admin` | Database connection          |

## 📝 Architecture Notes

- **Contract Container**: Dedicated to smart contract deployment on the local Ethereum node (no exposed ports)
- **Indexer Service**: Processes blockchain events in the background (no exposed ports)
- **Website**: Full-stack Next.js application with TypeScript support

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

_Built with ❤️ for the decentralized future_
