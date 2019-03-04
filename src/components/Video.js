import React from 'react';
import { withGetScreen } from 'react-getscreen';

const Video = ({ url, isMobile }) => {
  const videoId = url.split('/')[3];

  return (
    <div
      className='w-100 mt-4'
      style={{ paddingLeft: isMobile() ? '0px' : '80px' }}
    >
      <iframe
        title='project-video'
        src={`https://player.vimeo.com/video/${videoId}`}
        width={isMobile() ? '100%' : '640px'}
        height={isMobile() ? '220px' : '360px'}
        frameBorder='0'
        allowFullScreen
      />
    </div>
  );
};

export default withGetScreen(Video);
