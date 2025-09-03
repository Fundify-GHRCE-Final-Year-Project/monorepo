import { atom } from "jotai";
import { User, Project } from "@/types/global";

// Hardcoded user
const hardcodedUser: User = {
  wallet: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
  name: "Kartik Turak",
  country: "India",
  role: "Developer",
  skills: ["React", "Node.js", "Blockchain"],
  linkedin: "https://linkedin.com/in/kartik",
  x: "https://twitter.com/kartik",
  github: "https://github.com/kartikturak05",
  experiences: [], // Add an empty array or sample experiences as required by your User type
};

// // User state
// export const currentUserAtom = atom<User | null>(null);
// export const isUserConnectedAtom = atom<boolean>(true);
// export const userWalletAtom = atom<string | null>(null);

// User state (returns hardcoded data instead of null)
export const currentUserAtom = atom<User | null>(hardcodedUser);
export const isUserConnectedAtom = atom<boolean>(true);
export const userWalletAtom = atom<string | null>(hardcodedUser.wallet);

// Projects state
export const allProjectsAtom = atom<Project[]>([]);
export const userProjectsAtom = atom<Project[]>([]);
export const investedProjectsAtom = atom<Project[]>([]);
export const selectedProjectAtom = atom<Project | null>(null);

// UI state
export const isLoadingAtom = atom<boolean>(false);
export const errorMessageAtom = atom<string | null>(null);
export const successMessageAtom = atom<string | null>(null);

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
