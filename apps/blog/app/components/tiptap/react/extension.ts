import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import Component from "./Component.jsx";

export interface ReactComponentOptions {
  allowFullscreen: boolean;
  HTMLAttributes: {
    [key: string]: any;
  };
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    reactComponent: {
      /**
       * Add a react component
       */
      setReactComponent: (options: { src: string }) => ReturnType;
    };
  }
}

export default Node.create<ReactComponentOptions>({
  name: "reactComponent",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  addCommands() {
    return {
      setReactComponent:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: "reactComponent",
            attrs: {
              src: options.src,
            },
          });
        },
    };
  },

  parseHTML() {
    return [
      {
        tag: "react-component",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["react-component", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component);
  },
});
