export const getPreferedTheme = () => {
  // Check if user already set theme before
  if (localStorage.getItem("theme")) {
    return localStorage.getItem("theme");
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return "dark";
  }

  // Default to light
  return "light";
};