
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface VideoPlayerProps {
  src: string;
  title?: string;
  description?: string;
  autoPlay?: boolean;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const VideoPlayer = ({
  src,
  title,
  description,
  autoPlay = false,
  controls = true,
  width = "100%",
  height = "auto",
  className = "",
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="relative">
        <video
          ref={videoRef}
          src={src}
          autoPlay={autoPlay}
          controls={controls}
          width={width}
          height={height}
          className="w-full"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        {!controls && (
          <div className="absolute bottom-4 left-4 z-10">
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-black/30 backdrop-blur-sm text-white border-0 hover:bg-black/50"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </Button>
          </div>
        )}
      </div>

      {(title || description) && (
        <div className="p-4">
          {title && <h3 className="text-lg font-medium mb-1">{title}</h3>}
          {description && <p className="text-gray-500 text-sm">{description}</p>}
        </div>
      )}
    </Card>
  );
};
