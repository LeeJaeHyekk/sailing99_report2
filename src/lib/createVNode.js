export function createVNode(type, props, ...children) {
  // children 배열을 평탄화하고 null/undefined/boolean 값을 제거
  const flattenedChildren = children
    .flat(Infinity)
    .filter(
      (child) =>
        child !== null &&
        child !== undefined &&
        child !== true &&
        child !== false,
    );

  return {
    type,
    props: props || null,
    children: flattenedChildren,
  };
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
