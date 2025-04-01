/** @jsx createVNode */
import { createVNode } from "../lib";
import { Footer, Header, Navigation, Post, PostForm } from "../components";
import { globalStore } from "../stores";
import { router } from "../router";

/**
 * 심화과제
 * - 로그인한 사용자는 게시물을 추가할 수 있다.
 * - 로그인한 사용자는 게시물에 좋아요를 누를 수 있다.
 * - 로그인하지 않은 사용자가 게시물에 좋아요를 누를 경우, "로그인 후 이용해주세요"를 alert로 띄운다.
 */
export const HomePage = () => {
  const { posts, loggedIn, currentUser } = globalStore.getState();

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center">
      <div className="max-w-md w-full">
        <Header />
        <Navigation />

        <main className="p-4">
          {!loggedIn ? (
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold text-center text-blue-600 mb-8">
                항해플러스
              </h1>
              <p className="text-center mb-4">로그인이 필요한 서비스입니다.</p>
              <button
                onClick={() => router.get().push("/login")}
                className="w-full bg-blue-600 text-white p-2 rounded"
              >
                로그인
              </button>
            </div>
          ) : (
            <>
              <PostForm />
              <div id="posts-container" className="space-y-4">
                {[...posts]
                  .sort((a, b) => b.time - a.time)
                  .map((props) => {
                    const activationLike = props.likeUsers.includes(
                      currentUser.username,
                    );
                    return <Post {...props} activationLike={activationLike} />;
                  })}
              </div>
            </>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};
