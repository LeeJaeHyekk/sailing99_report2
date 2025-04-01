/** @jsx createVNode */
import { router } from "./router";
import { ForbiddenError, UnauthorizedError } from "./errors";
import { renderElement, createVNode } from "./lib";
import { NotFoundPage } from "./pages";
import { globalStore } from "./stores";

export function render() {
  const Page = router.get().getTarget() ?? NotFoundPage;
  const $root = document.querySelector("#root");

  try {
    $root.innerHTML = "";
    renderElement(<Page />, $root);

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = e.target.querySelector("#username").value;
        if (username) {
          const user = { username, email: "", bio: "" };
          localStorage.setItem("user", JSON.stringify(user));
          globalStore.setState({ loggedIn: true, currentUser: user });
          router.get().push("/");
        }
      });
    }

    const profileForm = document.getElementById("profile-form");
    if (profileForm) {
      profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = e.target.querySelector("#username").value;
        const email = e.target.querySelector("#email").value;
        const bio = e.target.querySelector("#bio").value;

        const user = { username, email, bio };
        localStorage.setItem("user", JSON.stringify(user));
        globalStore.setState({ currentUser: user });
      });
    }

    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
      logoutButton.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem("user");
        globalStore.setState({ loggedIn: false, currentUser: null });
        router.get().push("/login");
      };
    }
  } catch (error) {
    if (error instanceof ForbiddenError) {
      router.get().push("/");
      return;
    }
    if (error instanceof UnauthorizedError) {
      router.get().push("/login");
      return;
    }
    console.error(error);
    $root.innerHTML = "";
    renderElement(<NotFoundPage />, $root);
  }
}
