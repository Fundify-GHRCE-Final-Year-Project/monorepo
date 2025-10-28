import mongoose, { Model } from "mongoose";
import { Schema, Document } from "mongoose";
import {
  Project,
  Investment,
  CATEGORY,
  Experience,
  User,
  VotingCycle,
  Vote,
  ProjectFundsReleased
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

export interface IUser extends User, Document {}

const UserSchema = new Schema<IUser>(
  {
    wallet: { type: String, required: true, index: true, unique: true },
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

// VotingCycleInitiated document
export interface IVotingCycle extends VotingCycle, Document {}

export const VotingCycleSchema = new Schema<IVotingCycle>(
  {
    projectOwner: { type: String, required: true, index: true },
    projectIndex: { type: Number, required: true, index: true },
    amount: { type: Number, required: true },
    depositWallet: { type: String, required: true },
    votingCycle: { type: Number, required: true, index: true },
    votingDeadline: { type: Number, required: true },
    votesNeeded: { type: Number, required: true },
    votesGathered: { type: Number, required: true, default: 0 },
    ended: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

// Voted document
export interface IVote extends Vote, Document {}

export const VoteSchema = new Schema<IVote>(
  {
    projectOwner: { type: String, required: true, index: true },
    projectIndex: { type: Number, required: true, index: true },
    voteBy: { type: String, required: true },
    votingCycle: { type: Number, required: true, index: true },
  },
  { timestamps: true }
);

// ProjectFundsReleased document
export interface IProjectFundsReleased extends ProjectFundsReleased, Document {}

export const ProjectFundsReleasedSchema = new Schema<IProjectFundsReleased>(
  {
    owner: { type: String, required: true, index: true },
    index: { type: Number, required: true, index: true },
    amount: { type: Number, required: true },
    to: { type: String, required: true },
    cycle: { type: Number, required: true, index: true },
    timestamp: { type: Number, required: true },
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> =
  mongoose.models["User"] || mongoose.model("User", UserSchema);

export const ProjectModel: Model<IProject> =
  mongoose.models["Project"] || mongoose.model("Project", ProjectSchema);

export const InvestmentModel: Model<IInvestment> =
  mongoose.models["Investment"] ||
  mongoose.model("Investment", InvestmentSchema);

export const VotingCycleModel: Model<IVotingCycle> =
  mongoose.models["VotingCycle"] ||
  mongoose.model("VotingCycle", VotingCycleSchema);

export const VoteModel: Model<IVote> =
  mongoose.models["Vote"] || mongoose.model("Vote", VoteSchema);

export const ProjectFundsReleasedModel: Model<IProjectFundsReleased> =
  mongoose.models["ProjectFundsReleased"] ||
  mongoose.model("ProjectFundsReleased", ProjectFundsReleasedSchema);
