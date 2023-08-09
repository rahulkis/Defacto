function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();
  _getRequireWildcardCache = function _getRequireWildcardCache() {
    return cache;
  };
  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }
  if (
    obj === null ||
    (_typeof(obj) !== "object" && typeof obj !== "function")
  ) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache();
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) ||
    _iterableToArrayLimit(arr, i) ||
    _unsupportedIterableToArray(arr, i) ||
    _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError(
    "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

var createPopup = function createPopup(_ref) {
  var url = _ref.url,
    title = _ref.title,
    height = _ref.height,
    width = _ref.width;
  var left = window.screenX + (window.outerWidth - width) / 2;
  var top = window.screenY + (window.outerHeight - height) / 2.5;
  var externalPopup = window.open(
    url,
    title,
    "width="
      .concat(width, ",height=")
      .concat(height, ",left=")
      .concat(left, ",top=")
      .concat(top)
  );
  return externalPopup;
};

var OauthPopup = function OauthPopup(_ref2) {
  var _ref2$title = _ref2.title,
    title = _ref2$title === void 0 ? "" : _ref2$title,
    _ref2$width = _ref2.width,
    width = _ref2$width === void 0 ? 500 : _ref2$width,
    _ref2$height = _ref2.height,
    height = _ref2$height === void 0 ? 500 : _ref2$height,
    url = _ref2.url,
    children = _ref2.children,
    onCode = _ref2.onCode,
    onClose = _ref2.onClose;

  var _useState = (0, _react.useState)(),
    _useState2 = _slicedToArray(_useState, 2),
    externalWindow = _useState2[0],
    setExternalWindow = _useState2[1];

  var intervalRef = (0, _react.useRef)();

  var clearTimer = function clearTimer() {
    window.clearInterval(intervalRef.current);
  };

  var onContainerClick = function onContainerClick() {
    setExternalWindow(
      createPopup({
        url: url,
        title: title,
        width: width,
        height: height,
      })
    );
  };

  (0, _react.useEffect)(function() {
    if (externalWindow) {
      intervalRef.current = window.setInterval(function() {
        try {
          var currentUrl = externalWindow.location.href;
          var _params = new URL(currentUrl).searchParams;

          var _code = _params.get("code");

          if (currentUrl.includes("#token")) {
            _code = currentUrl.split("#token=")[1];
          }
          if (!_code) {
            return;
          }

          onCode(_code, _params);
          clearTimer();
        } catch (error) {
          // eslint-ignore-line
        } finally {
          if (!externalWindow || externalWindow.closed) {
            onClose();
            clearTimer();
          }
        }
      }, 700);
    }

    return function() {
      if (externalWindow) externalWindow.close();
      // if (onClose) onClose();
    };
  });
  return (
    /*#__PURE__*/
    // eslint-disable-next-line
    _react.default.createElement(
      "div",
      {
        onClick: function onClick() {
          onContainerClick();
        },
      },
      children
    )
  );
};

var _default = OauthPopup;
exports.default = _default;
//# sourceMappingURL=index.js.map
