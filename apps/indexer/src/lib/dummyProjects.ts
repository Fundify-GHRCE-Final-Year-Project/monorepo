import { CATEGORY } from "@fundify/types";

const projects: {
  title: string;
  description: string;
  category: CATEGORY;
}[] = [
  {
    title: "DeFi Staking Platform",
    description:
      "A decentralized application where users can stake tokens and earn rewards.",
    category: CATEGORY.Finance,
  },
  {
    title: "NFT Marketplace",
    description:
      "A platform to mint, buy, and sell NFTs with integrated wallet support.",
    category: CATEGORY.Finance,
  },
  {
    title: "AI Chatbot",
    description:
      "An AI-powered chatbot that can answer customer queries in real-time.",
    category: CATEGORY.Technology,
  },
  {
    title: "Expense Tracker",
    description:
      "A mobile app to track daily expenses and generate budget reports.",
    category: CATEGORY.Finance,
  },
  {
    title: "Cloud File Storage",
    description:
      "A secure, scalable cloud storage system with file-sharing features.",
    category: CATEGORY.Technology,
  },
];

// Function to return a random project
export function getRandomProject() {
  const randomIndex = Math.floor(Math.random() * projects.length);
  return projects[randomIndex];
}
