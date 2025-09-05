import { IProject } from "@fundify/database";
import { User } from "@fundify/types";

const CACHE_KEYS = {
  USER: "fundify_user",
  PROJECTS: "fundify_projects",
  USER_PROJECTS: "fundify_user_projects",
  INVESTED_PROJECTS: "fundify_invested_projects",
  SELECTED_PROJECT: "fundify_selected_project",
  WALLET: "fundify_wallet",
  THEME: "fundify_theme",
} as const;

const CACHE_DURATION = {
  USER: 24 * 60 * 60 * 1000, // 24 hours
  PROJECTS: 30 * 60 * 1000, // 30 minutes
  USER_PROJECTS: 15 * 60 * 1000, // 15 minutes
  INVESTED_PROJECTS: 15 * 60 * 1000, // 15 minutes
  SELECTED_PROJECT: 60 * 60 * 1000, // 1 hour
  WALLET: 7 * 24 * 60 * 60 * 1000, // 7 days
  THEME: 365 * 24 * 60 * 60 * 1000, // 1 year
} as const;

interface CacheItem<T> {
  data: T;
  timestamp: number;
  duration: number;
}

/**
 * Check if cache is valid
 */
const isCacheValid = <T>(item: CacheItem<T> | null): boolean => {
  if (!item) return false;
  return Date.now() - item.timestamp < item.duration;
};

/**
 * Get cached data
 */
const getCachedData = <T>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const item: CacheItem<T> = JSON.parse(cached);
    if (!isCacheValid(item)) {
      localStorage.removeItem(key);
      return null;
    }

    return item.data;
  } catch (error) {
    console.error("Error reading from cache:", error);
    localStorage.removeItem(key);
    return null;
  }
};

/**
 * Set cached data
 */
const setCachedData = <T>(key: string, data: T, duration: number): void => {
  try {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      duration,
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error("Error writing to cache:", error);
  }
};

/**
 * Clear specific cache
 */
const clearCache = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
};

/**
 * Clear all Fundify cache
 */
export const clearAllCache = (): void => {
  try {
    Object.values(CACHE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error("Error clearing all cache:", error);
  }
};

// User cache functions
export const getUserFromCache = (): User | null => {
  return getCachedData<User>(CACHE_KEYS.USER);
};

export const setUserToCache = (user: User): void => {
  setCachedData(CACHE_KEYS.USER, user, CACHE_DURATION.USER);
};

export const clearUserCache = (): void => {
  clearCache(CACHE_KEYS.USER);
};

// Projects cache functions
export const getProjectsFromCache = (): IProject[] | null => {
  return getCachedData<IProject[]>(CACHE_KEYS.PROJECTS);
};

export const setProjectsToCache = (projects: IProject[]): void => {
  setCachedData(CACHE_KEYS.PROJECTS, projects, CACHE_DURATION.PROJECTS);
};

export const clearProjectsCache = (): void => {
  clearCache(CACHE_KEYS.PROJECTS);
};

// User projects cache functions
export const getUserProjectsFromCache = (): IProject[] | null => {
  return getCachedData<IProject[]>(CACHE_KEYS.USER_PROJECTS);
};

export const setUserProjectsToCache = (projects: IProject[]): void => {
  setCachedData(
    CACHE_KEYS.USER_PROJECTS,
    projects,
    CACHE_DURATION.USER_PROJECTS
  );
};

export const clearUserProjectsCache = (): void => {
  clearCache(CACHE_KEYS.USER_PROJECTS);
};

// Invested projects cache functions
export const getInvestedProjectsFromCache = (): IProject[] | null => {
  return getCachedData<IProject[]>(CACHE_KEYS.INVESTED_PROJECTS);
};

export const setInvestedProjectsToCache = (projects: IProject[]): void => {
  setCachedData(
    CACHE_KEYS.INVESTED_PROJECTS,
    projects,
    CACHE_DURATION.INVESTED_PROJECTS
  );
};

export const clearInvestedProjectsCache = (): void => {
  clearCache(CACHE_KEYS.INVESTED_PROJECTS);
};

// Selected project cache functions
export const getSelectedProjectFromCache = (): IProject | null => {
  return getCachedData<IProject>(CACHE_KEYS.SELECTED_PROJECT);
};

export const setSelectedProjectToCache = (project: IProject): void => {
  setCachedData(
    CACHE_KEYS.SELECTED_PROJECT,
    project,
    CACHE_DURATION.SELECTED_PROJECT
  );
};

export const clearSelectedProjectCache = (): void => {
  clearCache(CACHE_KEYS.SELECTED_PROJECT);
};

// Wallet cache functions
export const getWalletFromCache = (): string | null => {
  return getCachedData<string>(CACHE_KEYS.WALLET);
};

export const setWalletToCache = (wallet: string): void => {
  setCachedData(CACHE_KEYS.WALLET, wallet, CACHE_DURATION.WALLET);
};

export const clearWalletCache = (): void => {
  clearCache(CACHE_KEYS.WALLET);
};

// Theme cache functions
export const getThemeFromCache = (): "light" | "dark" | null => {
  return getCachedData<"light" | "dark">(CACHE_KEYS.THEME);
};

export const setThemeToCache = (theme: "light" | "dark"): void => {
  setCachedData(CACHE_KEYS.THEME, theme, CACHE_DURATION.THEME);
};

export const clearThemeCache = (): void => {
  clearCache(CACHE_KEYS.THEME);
};
