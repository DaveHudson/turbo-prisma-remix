import hudsonai from "../images/hudson-ai.png";
import { LinkIcon } from "@heroicons/react/24/outline";

export default function Hudson() {
  return (
    <div className="px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-16 lg:pb-14">
      <div className="relative mx-auto max-w-lg divide-y-2 divide-gray-200 lg:max-w-7xl">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-light dark:text-dark sm:text-4xl">
            Hudson AI
          </h2>
          <p className="mt-3 text-xl sm:mt-4">
            Hudson is an attempt to build an AI interface version of myself. An
            OpenAI GPT-4 RAG based chatbot that can answer questions about my
            CV, blog posts, and more.
          </p>
        </div>
        <div className="mt-12 pt-12 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12 space-y-6 text-slate-200 font-sans first-line:uppercase first-line:tracking-widest tracking-wider first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left ">
          <p>
            The front-end of Hudson is a Next.js web app paired with the Vercel
            AI SDK, providing a chat UI to interact with the AI.
          </p>
          <p>
            The back-end is Node.js app pairing LangChain with a Supabase
            Postgres vector database to implement Retriveval Augmented
            Generation (RAG) on top of the Open AI GPT-4 model.
          </p>
          <p>
            The initial use case is to provide an AI version of my CV that you
            can talk to. Hudson has access to my CV and details on the specifics
            of what I achieved in each role. It also has access to a corpus of
            my thoughts &amp; views from blog posts and specific markdown files
            which have been provided during RAG.
          </p>
          <div className="flex justify-center flex-wrap">
            <LinkIcon className="h-5 w-5 inline-block mr-1 stroke-white" />
            Try it out at{" "}
            <a
              href="https://ai-cv.applification.net/"
              target="_blank"
              rel="noreferrer"
              className="pl-1 pr-1"
            >
              https://ai-cv.applification.net/
            </a>{" "}
            and view the full source code at{" "}
            <a
              href="https://github.com/DaveHudson/hudson"
              target="_blank"
              rel="noreferrer"
              className="pl-1 pr-1"
            >
              Github
            </a>
          </div>
          <div className="rounded-lg ring-1 ring-slate-300 overflow-hidden m-10">
            <a
              href="https://ai-cv.applification.net/"
              target="_blank"
              rel="noreferrer"
            >
              <img src={hudsonai} alt="Hudson" className="object-fill" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
