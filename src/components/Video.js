import React from "react";
import { withGetScreen } from "react-getscreen";

const Video = ({ url, isMobile }) => {
  const videoId = url.split("/")[3];

  return (
    <div className="embed-responsive embed-responsive-16by9 mb-4">
      <iframe
        className="embed-responsive-item"
        title="project-video"
        src={`https://player.vimeo.com/video/${videoId}`}
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
};

export default withGetScreen(Video);
