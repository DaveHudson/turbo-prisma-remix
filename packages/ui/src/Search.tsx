import * as React from "react";
import { SearchIcon } from "@heroicons/react/solid";

export const Search = () => {
  return (
    <div className="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
      <div className="w-full sm:max-w-xs">
        <form action="/posts" method="get">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="search"
              name="search"
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-sky-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
              placeholder="Search"
              type="search"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
