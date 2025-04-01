import { createVNode } from "./createVNode";

export function createElement(type, props, ...children) {
  return createVNode(type, props, children);
}

function updateAttributes($el, props) {
  const propsKeys = Object.keys(props);

  for (const key of propsKeys) {
    if (key.startsWith("on") && typeof props[key] === "function") {
      const eventType = key.slice(2).toLowerCase();
      addEvent($el, eventType, props[key]);
    } else if (key === "className") {
      $el.className = props[key];
    } else if (key === "style" && typeof props[key] === "object") {
      Object.assign($el.style, props[key]);
    } else {
      $el.setAttribute(key, props[key]);
    }
  }
}
