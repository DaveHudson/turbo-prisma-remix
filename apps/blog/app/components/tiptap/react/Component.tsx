import { NodeViewWrapper } from "@tiptap/react";
import { TwitterTweetEmbed } from "react-twitter-embed";

const Component = (props: any) => {
  return (
    <NodeViewWrapper className="react-component flex justify-center">
      <div className="content min-w-[550px]">
        <TwitterTweetEmbed tweetId={props.node.attrs.src} options={{ width: 550 }} />
      </div>
    </NodeViewWrapper>
  );
};

Component.displayName = "Component";

export default Component;
// 1762550298881724777
