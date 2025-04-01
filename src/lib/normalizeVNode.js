export function normalizeVNode(vNode) {
  // 1. null, undefined, boolean 처리
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // 2. 문자열 또는 숫자 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 3. 함수 타입 처리 (컴포넌트)
  if (typeof vNode.type === "function") {
    const result = vNode.type(vNode.props || {});
    return normalizeVNode(result);
  }

  // 4. 일반 vNode 처리
  if (vNode.type && vNode.props) {
    return {
      type: vNode.type,
      props: vNode.props,
      children: vNode.children
        .map((child) => normalizeVNode(child))
        .filter((child) => child !== null && child !== undefined),
    };
  }

  return vNode;
}
