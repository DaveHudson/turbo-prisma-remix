import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Document from "@tiptap/extension-document";
import Placeholder from "@tiptap/extension-placeholder";

const CustomDocument = Document.extend({
  content: "heading block*",
});

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      CustomDocument,
      StarterKit.configure({
        document: false,
      }),
      Placeholder.configure({
        // @ts-ignore
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "Whats the title?";
          }
        },
      }),
      Highlight,
      Typography,
    ],
    editorProps: {
      attributes: {
        class: "prose prose-pink focus:outline-none",
      },
    },
    content: ``,
  });

  const json = editor?.getJSON();
  console.log("json", json);
  // So essentially just pick up the JSON from the editor and save it to the database instead....

  return <EditorContent editor={editor} className="prose" />;
};

export default Tiptap;
