import { atom } from "jotai";
import { User, Project } from "@fundify/types";

// Hardcoded user
const hardcodedUser: User = {
  wallet: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
  name: "Kartik Turak",
  country: "India",
  role: "Developer",
  phone: "+91 1234567890",
  address: "Nagpur, Maharashtra, India",
  skills: ["React", "Node.js", "Blockchain"],
  experiences: [],
  linkedin: "https://linkedin.com/in/kartik",
  x: "https://twitter.com/kartik",
  github: "https://github.com/kartikturak05",
  interests: [], // Add an empty array or sample experiences as required by your User type
};

// User state (returns hardcoded data instead of null)
export const currentUserAtom = atom<User | null>(hardcodedUser);

// Projects state
export const allProjectsAtom = atom<Project[]>([]);
export const userProjectsAtom = atom<Project[]>([]);
export const investedProjectsAtom = atom<Project[]>([]);
export const selectedProjectAtom = atom<Project | null>(null);

// UI state
export const isLoadingAtom = atom<boolean>(false);

// Navigation state
export const currentPageAtom = atom<string>("projects");

// Derived atoms
export const hasProjectsAtom = atom((get) => {
  const userProjects = get(userProjectsAtom);
  return userProjects && userProjects.length > 0;
});

export const projectsLoadingAtom = atom((get) => {
  return get(isLoadingAtom);
});

export const userProfileCompleteAtom = atom((get) => {
  const user = get(currentUserAtom);
  if (!user) return false;

  return !!(
    user.wallet &&
    user.name &&
    user.country &&
    user.role &&
    user.skills.length > 0 &&
    user.linkedin &&
    user.x &&
    user.github
  );
});
