// 이벤트 핸들러를 저장하기 위한 WeakMap
const eventHandlerMap = new WeakMap();

export function addEvent(element, eventType, handler) {
  // 요소별 이벤트 핸들러 맵을 가져오거나 새로 생성
  let handlers = eventHandlerMap.get(element) || {};

  // 이벤트 타입별 핸들러 배열을 가져오거나 새로 생성
  if (!handlers[eventType]) {
    handlers[eventType] = [];
  }

  // 핸들러가 이미 등록되어 있지 않은 경우에만 추가
  if (!handlers[eventType].includes(handler)) {
    handlers[eventType].push(handler);
  }

  // 핸들러 맵을 WeakMap에 저장
  eventHandlerMap.set(element, handlers);
}

export function removeEvent(element, eventType, handler) {
  const handlers = eventHandlerMap.get(element);

  if (handlers && handlers[eventType]) {
    // 핸들러 배열에서 특정 핸들러 제거
    handlers[eventType] = handlers[eventType].filter((h) => h !== handler);

    // 이벤트 타입에 핸들러가 없으면 해당 타입 삭제
    if (handlers[eventType].length === 0) {
      delete handlers[eventType];
    }

    // 요소에 등록된 핸들러가 없으면 WeakMap에서 제거
    if (Object.keys(handlers).length === 0) {
      eventHandlerMap.delete(element);
    }
  }
}

export function setupEventListeners(root) {
  // 이벤트 위임을 위한 이벤트 리스너
  const eventListener = (event) => {
    const target = event.target;
    const handlers = eventHandlerMap.get(target);

    if (handlers && handlers[event.type]) {
      // 해당 이벤트 타입의 모든 핸들러 실행
      handlers[event.type].forEach((handler) => {
        handler(event);
      });
    }
  };

  // 모든 이벤트 타입에 대해 이벤트 리스너 등록
  const eventTypes = [
    "click",
    "mousedown",
    "mouseup",
    "mousemove",
    "mouseover",
    "mouseout",
    "keydown",
    "keyup",
    "focus",
    "blur",
    "submit",
    "change",
    "input",
  ];

  eventTypes.forEach((eventType) => {
    root.addEventListener(eventType, eventListener, true);
  });

  // cleanup 함수 반환
  return () => {
    eventTypes.forEach((eventType) => {
      root.removeEventListener(eventType, eventListener, true);
    });
  };
}
