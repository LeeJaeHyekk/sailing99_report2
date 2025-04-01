import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // 1. null, undefined, boolean 처리
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // 2. 문자열 또는 숫자 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // 3. 배열 처리
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      fragment.appendChild(createElement(child));
    });
    return fragment;
  }

  // 4. 일반 vNode 처리
  if (vNode.type && vNode.props) {
    const $el = document.createElement(vNode.type);
    updateAttributes($el, vNode.props);

    // 자식 요소 처리
    if (vNode.children) {
      vNode.children.forEach((child) => {
        $el.appendChild(createElement(child));
      });
    }

    return $el;
  }

  return document.createTextNode("");
}

function updateAttributes($el, props) {
  // 이벤트 핸들러 처리
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      addEvent($el, eventType, value);
    } else if (key === "className") {
      $el.className = value;
    } else if (key === "style" && typeof value === "object") {
      Object.assign($el.style, value);
    } else {
      $el.setAttribute(key, value);
    }
  });
}
