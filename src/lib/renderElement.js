import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  // 1. vNode를 정규화
  const normalizedVNode = normalizeVNode(vNode);

  // 2. createElement로 DOM 노드 생성
  const element = createElement(normalizedVNode);

  // 3. container 초기화 및 새로운 요소 삽입
  container.innerHTML = "";
  container.appendChild(element);

  // 4. 이벤트 등록
  const cleanup = setupEventListeners(container);

  // cleanup 함수 반환 (필요한 경우 이벤트 리스너 제거 가능)
  return cleanup;
}
