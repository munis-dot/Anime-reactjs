import React, { useEffect, useRef } from 'react';
import  cloudinary  from 'cloudinary-video-player';

const CloudinaryVideoPlayer = ({ videoUrl }) => {

  const cloudinaryRef = useRef();
  const playerRef = useRef();

  useEffect(() => {
    if (cloudinaryRef.current) return;

    cloudinaryRef.current = cloudinary;

    const player = cloudinaryRef.current.videoPlayer(playerRef.current, {
      cloud_name: 'dlliku5ku',
      secure: true,
      controls: true,
    });
    player.source(videoUrl);
  }, []);

  return (
    <video
      ref={playerRef}
      className="cld-video-player cld-fluid"
    />
  );
};

export default CloudinaryVideoPlayer;
