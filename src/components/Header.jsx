/** @jsx createVNode */
import { createVNode } from "../lib";
import { globalStore } from "../stores/globalStore";
import { router } from "../router";

export const Header = () => {
  const { currentUser } = globalStore.getState();

  const handleLogout = () => {
    localStorage.removeItem("user");
    globalStore.setState({
      currentUser: null,
      loggedIn: false,
    });
    router.get().push("/login");
  };

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-blue-600">
              항해플러스
            </a>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <a
                  href="/profile"
                  className="text-gray-600 hover:text-blue-600"
                >
                  프로필
                </a>
                <button
                  id="logout"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-blue-600"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <a href="/login" className="text-gray-600 hover:text-blue-600">
                로그인
              </a>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
