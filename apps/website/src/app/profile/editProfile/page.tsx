"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Bigger Label
const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-base font-semibold text-gray-800 mb-2">
    {children}
  </label>
);

const allInterests = [
  "Medical",
  "Coding",
  "Technology",
  "Pharmacy",
  "Army",
  "Defence",
  "Farming",
  "Finance",
  "Education",
  "Environment",
  "Sports",
  "Art & Culture",
  "Travel",
  "Social Work",
];

export default function ProfilePage() {
  const { address: walletAddress, isConnected } = useAccount();

  const [formData, setFormData] = useState({
    wallet: "",
    name: "",
    country: "",
    role: "",
    skills: "",
    linkedin: "",
    x: "",
    github: "",
    phone: "",
    address: "",
    interests: [] as string[],
  });

  const [loading, setLoading] = useState(false);

  // Fetch user data
  useEffect(() => {
    if (walletAddress) {
      fetch(`/api/user/${walletAddress}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            wallet: data.wallet || walletAddress,
            name: data.name || "",
            country: data.country || "",
            role: data.role || "",
            skills: (data.skills || []).join(", "),
            linkedin: data.linkedin || "",
            x: data.x || "",
            github: data.github || "",
            phone: data.phone || "",
            address: data.address || "",
            interests: data.interests || [],
          });
        })
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, [walletAddress]);

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle interests
  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      };
    });
  };

  // Save profile
  const handleSave = async () => {
    if (!walletAddress) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/user/${walletAddress}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills.split(",").map((s) => s.trim()),
        }),
      });

      if (res.ok) {
        alert("✅ Profile updated successfully!");
        window.location.href = "/profile";
      } else {
        alert("❌ Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 text-center">
        <p className="text-xl font-semibold">
          ⚠️ Please connect your wallet to edit profile.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Edit Profile</h1>

      {/* Wallet (Read only) */}
      <div className="space-y-3">
        <Label>Wallet Address</Label>
        <Input
          className="text-lg p-3"
          value={walletAddress}
            readOnly
        />
      </div>

      {/* Name */}
      <div className="space-y-3">
        <Label>Name</Label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          className="text-lg p-3"
        />
      </div>

      {/* Country */}
      <div className="space-y-3">
        <Label>Country</Label>
        <Input
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Enter your country"
          className="text-lg p-3"
        />
      </div>

      {/* Role */}
      <div className="space-y-3">
        <Label>Role</Label>
        <Input
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="e.g. Developer, Designer"
          className="text-lg p-3"
        />
      </div>

      {/* Skills */}
      <div className="space-y-3">
        <Label>Skills (comma separated)</Label>
        <Input
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="e.g. React, Node.js, Blockchain"
          className="text-lg p-3"
        />
      </div>

      {/* Links */}
      <div className="space-y-3">
        <Label>LinkedIn</Label>
        <Input
          name="linkedin"
          value={formData.linkedin}
          onChange={handleChange}
          placeholder="LinkedIn profile URL"
          className="text-lg p-3"
        />
      </div>

      <div className="space-y-3">
        <Label>X (Twitter)</Label>
        <Input
          name="x"
          value={formData.x}
          onChange={handleChange}
          placeholder="Twitter profile URL"
          className="text-lg p-3"
        />
      </div>

      <div className="space-y-3">
        <Label>GitHub</Label>
        <Input
          name="github"
          value={formData.github}
          onChange={handleChange}
          placeholder="GitHub profile URL"
          className="text-lg p-3"
        />
      </div>

      {/* Phone */}
      <div className="space-y-3">
        <Label>Phone</Label>
        <Input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          className="text-lg p-3"
        />
      </div>

      {/* Address */}
      <div className="space-y-3">
        <Label>Address</Label>
        <Input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter your address"
          className="text-lg p-3"
        />
      </div>

      {/* Interests */}
      <div className="space-y-3">
        <Label>Interests</Label>
        <div className="flex flex-wrap gap-3">
          {allInterests.map((interest) => (
            <Badge
              key={interest}
              variant={
                formData.interests.includes(interest) ? "default" : "outline"
              }
              className="cursor-pointer px-4 py-2 text-lg"
              onClick={() => toggleInterest(interest)}
            >
              {interest}
            </Badge>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={loading}
        className="w-full h-12 text-lg"
      >
        {loading ? "Saving..." : "Save Profile"}
      </Button>
    </div>
  );
}
