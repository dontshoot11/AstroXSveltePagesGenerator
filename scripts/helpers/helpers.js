export function debounce(func, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export function throttle(callback, timeout) {
  let timer = null;

  return function perform(...args) {
    if (timer) {
      return;
    }

    timer = setTimeout(() => {
      callback(...args);

      if (timer !== null) {
        clearTimeout(timer);
      }

      timer = null;
    }, timeout);
  };
}

export function getOS() {
  const userAgent = window.navigator.userAgent;
  if (userAgent.includes("Macintosh")) {
    const isIpad =
      /Macintosh/i.test(navigator.userAgent) &&
      navigator.maxTouchPoints &&
      navigator.maxTouchPoints > 1;
    if (isIpad) {
      return "iOS";
    }
    return "Mac OS";
  }
  if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    return "iOS";
  }
  if (userAgent.includes("Android")) {
    return "Android";
  }
  if (userAgent.includes("Windows")) {
    return "Windows";
  }
  if (userAgent.includes("Linux")) {
    return "Linux";
  }
}

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export function checkDate(dateString) {
  const date = new Date(dateString);
  const dt = new Date();
  const diffTZ = dt.getTimezoneOffset();
  return Date.now() > date.getTime() + diffTZ;
}
