var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// src/index.tsx
var src_exports = {};
__export(src_exports, {
  Button: () => Button,
  Search: () => Search
});

// src/Button.tsx
var React = __toESM(require("react"));
var Button = () => {
  return /* @__PURE__ */ React.createElement("button", null, "Boop op");
};

// src/Search.tsx
var React2 = __toESM(require("react"));
var import_solid = require("@heroicons/react/solid");
var Search = () => {
  return /* @__PURE__ */ React2.createElement("div", {
    className: "relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0"
  }, /* @__PURE__ */ React2.createElement("div", {
    className: "w-full sm:max-w-xs"
  }, /* @__PURE__ */ React2.createElement("label", {
    htmlFor: "search",
    className: "sr-only"
  }, "Search"), /* @__PURE__ */ React2.createElement("div", {
    className: "relative"
  }, /* @__PURE__ */ React2.createElement("div", {
    className: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
  }, /* @__PURE__ */ React2.createElement(import_solid.SearchIcon, {
    className: "h-5 w-5 text-gray-400",
    "aria-hidden": "true"
  })), /* @__PURE__ */ React2.createElement("input", {
    id: "search",
    name: "search",
    className: "block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-sky-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm",
    placeholder: "Search",
    type: "search"
  }))));
};
module.exports = __toCommonJS(src_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Button,
  Search
});
