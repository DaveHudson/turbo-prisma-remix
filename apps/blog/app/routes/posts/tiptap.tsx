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
    content: "",
  });

  return <EditorContent editor={editor} className="prose" />;
};

export default Tiptap;
