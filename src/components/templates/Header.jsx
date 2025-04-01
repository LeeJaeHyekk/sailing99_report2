/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";
import { router } from "../../router";

export const Header = () => {
  const { loggedIn } = globalStore.getState();

  const handleLogout = () => {
    globalStore.logout();
    localStorage.removeItem("user");
    router.get().push("/login");
  };

  return (
    <header className="bg-blue-600 text-white p-4 sticky top-0">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">항해플러스</h1>
        {loggedIn && (
          <button
            id="logout"
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded"
          >
            로그아웃
          </button>
        )}
      </div>
    </header>
  );
};
