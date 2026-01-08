import { useRef, useState } from 'react';
import SvgSliderVideo from './icons/SliderVideo';

interface VideoPlayerProps {
  url: string;
  className?: string;
}

export default function VideoPlayer({ url, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div className='relative flex items-center justify-center group'>
      <video
        ref={videoRef}
        src={url}
        controls
        className={className}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      {!isPlaying && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <button onClick={handlePlay} className='cursor-pointer'>
            <SvgSliderVideo className='w-24 h-24 fill-white drop-shadow-2xl' />
          </button>
        </div>
      )}
    </div>
  );
}
