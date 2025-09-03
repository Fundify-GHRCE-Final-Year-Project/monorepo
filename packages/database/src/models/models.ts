import mongoose from "mongoose";
import { Schema, Document, Model } from "mongoose";
import {
  Project,
  Investment,
  CATEGORY,
  Experience,
  User,
} from "@fundify/types";

export interface IProject extends Project, Document {
  title: string;
  description: string;
  members: string[];
  category: CATEGORY;
}

export interface IInvestment extends Investment, Document {}

export const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: false, default: "" },
    description: { type: String, required: false, default: "" },
    members: { type: [String], required: false, default: [] },
    category: { type: String, enum: CATEGORY },
    owner: { type: String, required: true, index: true },
    index: { type: Number, required: true, index: true },
    goal: { type: Number, required: true },
    milestones: { type: Number, required: true },
    funded: { type: Number, required: true },
    released: { type: Number, required: true },
    timestamp: { type: Number, required: true },
  },
  { timestamps: true }
);

export const InvestmentSchema = new Schema<IInvestment>(
  {
    funder: { type: String, required: true, index: true },
    investmentIndex: { type: Number, required: true, index: true },
    projectOwner: { type: String, required: true, index: true },
    projectIndex: { type: Number, required: true, index: true },
    amount: { type: Number, required: true },
    timestamp: { type: Number, required: true },
  },
  { timestamps: true }
);

const experienceSchema = new Schema<Experience>({
  role: { type: String },
  company: { type: String },
  duration: { type: String },
});

const userSchema = new Schema<User>(
  {
    wallet: { type: String, required: true, unique: true },
    name: { type: String },
    country: { type: String },
    role: { type: String },
    phone: { type: String },
    address: { type: String },
    skills: { type: [String], default: [] },
    experiences: { type: [experienceSchema], default: [] },
    linkedin: { type: String },
    x: { type: String },
    github: { type: String },
    interests: { type: [String], default: [], enum: Object.values(CATEGORY) },
  },
  { timestamps: true }
);

export const ProjectModel = mongoose.model("Project", ProjectSchema);
export const InvestmentModel = mongoose.model("Investment", InvestmentSchema);
