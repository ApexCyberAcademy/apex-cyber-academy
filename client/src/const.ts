export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Returns the local login page URL (replaces Manus OAuth redirect)
export const getLoginUrl = (returnTo?: string): string => {
  const base = "/login";
  if (returnTo) {
    return `${base}?returnTo=${encodeURIComponent(returnTo)}`;
  }
  return base;
};
