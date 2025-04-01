/** @jsx createVNode */
import { createRouter, createVNode } from "./lib";
import { HomePage, LoginPage, ProfilePage, NotFoundPage } from "./pages";
import { globalStore } from "./stores";
import { ForbiddenError, UnauthorizedError } from "./errors";
import { router } from "./router";
import { render } from "./render";

const user = localStorage.getItem("user");
if (user) {
  const userData = JSON.parse(user);
  globalStore.setState({
    loggedIn: true,
    currentUser: userData,
  });
}

router.set(
  createRouter({
    "/": HomePage,
    "/login": () => {
      const { loggedIn } = globalStore.getState();
      if (loggedIn) {
        throw new ForbiddenError();
      }
      return <LoginPage />;
    },
    "/profile": () => {
      const { loggedIn } = globalStore.getState();
      if (!loggedIn) {
        throw new UnauthorizedError();
      }
      return <ProfilePage />;
    },
    "*": NotFoundPage,
  }),
);

function main() {
  render();
  router.get().subscribe(render);
  globalStore.subscribe(render);
}

main();
