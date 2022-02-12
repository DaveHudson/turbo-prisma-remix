export default function TagList() {
  return (
    <>
      <p>Need to list all tags and colours so they get inserted into the CSS</p>
      <div className="flex justify-center space-x-3 pt-3">
        <span className="inline-flex items-center rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
          Remix
        </span>
        <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
          React
        </span>
        <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
          Tailwind
        </span>
        <span className="inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
          Testing
        </span>
        <span className="inline-flex items-center rounded bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-800">
          React Native
        </span>
        <span className="inline-flex items-center rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
          PWA
        </span>
        <span className="inline-flex items-center rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
          Design
        </span>
        <span className="inline-flex items-center rounded bg-lime-100 px-2 py-0.5 text-xs font-medium text-lime-800">
          DevOps
        </span>
      </div>
    </>
  );
}
