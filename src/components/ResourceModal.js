import React from 'react';

const ResourceModal = ({ url }) => {
  const ResourceModalId = url.split('/')[3];

  return (
    <div className='w-100' style={{ paddingLeft: '80px' }}>
      <iframe
        title='project-video'
        src={`https://player.vimeo.com/video/${videoId}`}
        width='640'
        height='360'
        frameBorder='0'
        allowFullScreen
      />
    </div>
  );
};

export default Video;
