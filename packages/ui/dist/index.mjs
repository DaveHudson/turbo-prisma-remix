// src/Button.tsx
import * as React from "react";
var Button = () => {
  return /* @__PURE__ */ React.createElement("button", null, "Boop op");
};

// src/Search.tsx
import * as React2 from "react";
import { SearchIcon } from "@heroicons/react/solid";
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
  }, /* @__PURE__ */ React2.createElement(SearchIcon, {
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
export {
  Button,
  Search
};
