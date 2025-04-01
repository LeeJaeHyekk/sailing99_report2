import { createObserver } from "./createObserver";

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  const getPath = () => {
    const hash = window.location.hash;
    return hash ? hash.slice(1) : window.location.pathname;
  };

  const getTarget = () => {
    const path = getPath();
    return routes[path] || routes["*"];
  };

  const push = (path) => {
    if (window.location.hash) {
      window.location.hash = path;
    } else {
      window.history.pushState(null, null, path);
    }
    notify();
  };

  window.addEventListener("popstate", () => notify());
  window.addEventListener("hashchange", () => notify());

  return {
    get path() {
      return getPath();
    },
    push,
    subscribe,
    getTarget,
  };
};
