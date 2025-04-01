import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  const newProps = originNewProps || {};
  const oldProps = originOldProps || {};

  // 새로운 props 추가 또는 업데이트
  Object.entries(newProps).forEach(([key, value]) => {
    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      const oldHandler = oldProps[key];
      if (oldHandler) {
        removeEvent(target, eventType, oldHandler);
      }
      addEvent(target, eventType, value);
    } else if (key === "className") {
      target.className = value;
    } else if (key === "style" && typeof value === "object") {
      Object.assign(target.style, value);
    } else {
      target.setAttribute(key, value);
    }
  });

  // 제거된 props 처리
  Object.keys(oldProps).forEach((key) => {
    if (!(key in newProps)) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType, oldProps[key]);
      } else if (key === "className") {
        target.className = "";
      } else if (key === "style" && typeof oldProps[key] === "object") {
        Object.keys(oldProps[key]).forEach((styleKey) => {
          target.style[styleKey] = "";
        });
      } else {
        target.removeAttribute(key);
      }
    }
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 노드가 없는 경우 처리
  if (!newNode && !oldNode) return;
  if (!newNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }
  if (!oldNode) {
    parentElement.insertBefore(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }

  // 텍스트 노드 처리
  if (typeof newNode === "string" || typeof newNode === "number") {
    if (newNode !== oldNode) {
      parentElement.replaceChild(
        document.createTextNode(String(newNode)),
        parentElement.childNodes[index],
      );
    }
    return;
  }

  // vNode 타입이 다른 경우
  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }

  // 속성 업데이트
  const currentElement = parentElement.childNodes[index];
  updateAttributes(currentElement, newNode.props, oldNode.props);

  // 자식 노드 업데이트
  const maxLength = Math.max(
    newNode.children?.length || 0,
    oldNode.children?.length || 0,
  );

  for (let i = 0; i < maxLength; i++) {
    updateElement(
      currentElement,
      newNode.children?.[i],
      oldNode.children?.[i],
      i,
    );
  }
}
