export default function TagList() {
  return (
    <>
      <p>Need to list all tags and colours so they get inserted into the CSS</p>
      <div className="flex justify-center space-x-3 pt-3">
        <span className="inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
          Remix
        </span>
        <span className="inline-flex items-center rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
          React
        </span>
        <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
          Databases
        </span>
        <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
          Tailwind
        </span>
        <span className="inline-flex items-center rounded bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800">
          Mono Repos
        </span>
        <span className="inline-flex items-center rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
          Design Systems
        </span>
        <span className="inline-flex items-center rounded bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-800">
          Testing
        </span>
      </div>
    </>
  );
}
