import { NodeViewWrapper } from "@tiptap/react";
import { TwitterTweetEmbed } from "react-twitter-embed";

const Component = (props: any) => {
  return (
    <NodeViewWrapper className="react-component">
      <div className="content">
        <TwitterTweetEmbed tweetId={props.node.attrs.src} />
      </div>
    </NodeViewWrapper>
  );
};

Component.displayName = "Component";

export default Component;
// 1762550298881724777
