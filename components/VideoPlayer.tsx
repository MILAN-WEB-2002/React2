
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';

interface VideoPlayerProps {
  file: File;
}

export interface VideoPlayerHandle {
  seekTo: (seconds: number) => void;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(({ file }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useImperativeHandle(ref, () => ({
    seekTo: (seconds: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = seconds;
        videoRef.current.play().catch(() => {
          // Auto-play might be blocked, that's okay
        });
      }
    }
  }));

  return (
    <div className="w-full bg-black rounded-xl overflow-hidden shadow-lg border border-slate-200">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-auto max-h-[400px]"
        controls
        playsInline
      />
      <div className="bg-slate-900 px-4 py-2 flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider">
        <span>Video Preview</span>
        <span className="text-indigo-400">Standard Player</span>
      </div>
    </div>
  );
});

export default VideoPlayer;
