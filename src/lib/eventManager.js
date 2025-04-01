// 이벤트 핸들러를 저장하기 위한 WeakMap
const eventHandlerMap = new WeakMap();

// 이벤트 핸들러를 저장하기 위한 Map
const eventHandlers = new Map();

export function addEvent($el, eventName, handler) {
  $el.addEventListener(eventName, (e) => {
    e.preventDefault();
    handler(e);
  });
}

export function removeEvent(element, eventType, handler) {
  const elementHandlers = eventHandlers.get(element);
  if (elementHandlers) {
    const handlers = elementHandlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }
  }
}

export function setupEventListeners(root) {
  // 이벤트 위임을 위한 이벤트 리스너
  const eventListener = (event) => {
    const target = event.target;
    let currentTarget = target;

    while (currentTarget && currentTarget !== root) {
      const handlers = eventHandlerMap.get(currentTarget);

      if (handlers && handlers[event.type]) {
        // 해당 이벤트 타입의 모든 핸들러 실행
        handlers[event.type].forEach((handler) => {
          handler(event);
        });
        break; // 이벤트가 처리되면 상위로 전파하지 않음
      }

      currentTarget = currentTarget.parentElement;
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
