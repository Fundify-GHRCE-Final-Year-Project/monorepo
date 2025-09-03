import mongoose from "mongoose";
import { Schema, Document, Model } from "mongoose";
import { Project, Investment } from "@fundify/types";

export interface IProject extends Project, Document {
  title: string;
  description: string;
  members: string[];
}

export interface IInvestment extends Investment, Document {}

export const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: false, default: "" },
    description: { type: String, required: false, default: "" },
    members: { type: [String], required: false, default: [] },
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

export const ProjectModel = mongoose.model("Project", ProjectSchema);
export const InvestmentModel = mongoose.model("Investment", InvestmentSchema);
