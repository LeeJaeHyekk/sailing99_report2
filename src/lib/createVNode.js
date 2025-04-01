export function createVNode(type, props, ...children) {
  // children 배열을 평탄화하고 null/undefined/boolean 값을 제거
  const flattenedChildren = children
    .flat()
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
