// components/ProjectVotingSection.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Project {
  _id: string;
  ownerWallet: string;
  title: string;
  description: string;
}

interface VotingCycle {
  _id: string;
  projectId: string;
  reason: string;
  amountRequested: number;
  status: string;
}

interface Vote {
  _id: string;
  votingCycleId: string;
  investorWallet: string;
  vote: "approve" | "reject";
}

interface Props {
    projectIndex: number;
  projectId: string;
  currentUserWallet: string;
}

const ProjectVotingSection: React.FC<Props> = ({ projectIndex,projectId, currentUserWallet }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [votingCycle, setVotingCycle] = useState<VotingCycle | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [role, setRole] = useState<"owner" | "investor" | "">("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch project details
        const projectRes = await axios.get(`/api/project/${projectId}`);
        setProject(projectRes.data);

        // 2️⃣ Identify role
        if (projectRes.data.ownerWallet === currentUserWallet) {
          setRole("owner");
        } else {
          setRole("investor");
        }

        // 3️⃣ Fetch voting cycle
        console.log("Voting Cycle Response:", projectId);
        console.log('Project Index to request',projectIndex);
        const votingRes = await axios.get(`/api/voting-cycle/project/${projectIndex}`);
        setVotingCycle(votingRes.data);

        // 4️⃣ Fetch all votes
        const votesRes = await axios.get(`/api/votes/project/${projectIndex}`);
        setVotes(votesRes.data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchData();
  }, [projectId, currentUserWallet,projectIndex]);

  if (!project || !votingCycle) return <p>Loading...</p>;

  const approved = votes.filter(v => v.vote === "approve").length;
  const rejected = votes.filter(v => v.vote === "reject").length;
  const total = votes.length;

  if (role === "owner") {
    return (
      <div className="p-4 border rounded-2xl shadow-md bg-white mt-6">
        <h2 className="text-xl font-semibold mb-2">Funds Release Status</h2>
        <p><strong>Reason:</strong> {votingCycle.reason}</p>
        <p><strong>Amount Requested:</strong> ₹{votingCycle.amountRequested}</p>
        <p><strong>Status:</strong> {votingCycle.status}</p>

        <div className="mt-4">
          <h3 className="font-semibold">Voting Summary:</h3>
          <ul className="list-disc ml-5">
            <li>✅ Approved: {approved}</li>
            <li>❌ Rejected: {rejected}</li>
            <li>🗳️ Total Votes: {total}</li>
          </ul>
        </div>
      </div>
    );
  }

  if (role === "investor") {
    const userVote = votes.find(v => v.investorWallet === currentUserWallet);

    const handleVote = async (choice: "approve" | "reject") => {
      try {
        await axios.post(`/api/votes/create`, {
          projectId,
          votingCycleId: votingCycle._id,
          investorWallet: currentUserWallet,
          vote: choice,
        });
        alert(`You voted ${choice}`);
        window.location.reload();
      } catch (err) {
        console.error("Vote error:", err);
      }
    };

    return (
      <div className="p-4 border rounded-2xl shadow-md bg-white mt-6">
        <h2 className="text-xl font-semibold mb-2">Active Voting Cycle</h2>
        <p><strong>Reason:</strong> {votingCycle.reason}</p>
        <p><strong>Amount Requested:</strong> ₹{votingCycle.amountRequested}</p>

        {userVote ? (
          <p className="mt-3 text-green-600">✅ You voted: {userVote.vote}</p>
        ) : (
          <div className="mt-3 flex gap-4">
            <button
              onClick={() => handleVote("approve")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Approve
            </button>
            <button
              onClick={() => handleVote("reject")}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        )}

        <div className="mt-4 border-t pt-3">
          <h3 className="font-semibold">Voting Summary:</h3>
          <ul className="list-disc ml-5">
            <li>✅ Approved: {approved}</li>
            <li>❌ Rejected: {rejected}</li>
            <li>🗳️ Total Votes: {total}</li>
          </ul>
        </div>
      </div>
    );
  }

  return null;
};

export default ProjectVotingSection;
