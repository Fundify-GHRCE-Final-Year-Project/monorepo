const projects = [
  {
    title: "DeFi Staking Platform",
    description:
      "A decentralized application where users can stake tokens and earn rewards.",
  },
  {
    title: "NFT Marketplace",
    description:
      "A platform to mint, buy, and sell NFTs with integrated wallet support.",
  },
  {
    title: "AI Chatbot",
    description:
      "An AI-powered chatbot that can answer customer queries in real-time.",
  },
  {
    title: "Expense Tracker",
    description:
      "A mobile app to track daily expenses and generate budget reports.",
  },
  {
    title: "Cloud File Storage",
    description:
      "A secure, scalable cloud storage system with file-sharing features.",
  },
];

// Function to return a random project
export function getRandomProject() {
  const randomIndex = Math.floor(Math.random() * projects.length);
  return projects[randomIndex];
}
