
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface VideoPlayerProps {
  src: string;
  title?: string;
  description?: string;
  autoPlay?: boolean;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  className?: string;
  allowUpload?: boolean;
}

interface UploadFormValues {
  mediaSource: string;
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
  allowUpload = false,
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [mediaSource, setMediaSource] = useState(src);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const form = useForm<UploadFormValues>({
    defaultValues: {
      mediaSource: ""
    }
  });

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

  const handleFormSubmit = (values: UploadFormValues) => {
    if (values.mediaSource) {
      setMediaSource(values.mediaSource);
      setShowUploadForm(false);
    }
  };

  const isVideo = mediaSource.match(/\.(mp4|webm|ogg|mov)($|\?)/i) || 
                  mediaSource.includes('vimeo.com') || 
                  mediaSource.includes('youtube.com') ||
                  mediaSource.includes('player.vimeo.com');

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="relative">
        {isVideo ? (
          <video
            ref={videoRef}
            src={mediaSource}
            autoPlay={autoPlay}
            controls={controls}
            width={width}
            height={height}
            className="w-full"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          <img 
            src={mediaSource} 
            alt={title || "Media content"} 
            className="w-full" 
            width={width} 
            height={height}
          />
        )}
        
        {isVideo && !controls && (
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

      <div className="p-4">
        {(title || description) && (
          <div className="mb-4">
            {title && <h3 className="text-lg font-medium mb-1">{title}</h3>}
            {description && <p className="text-gray-500 text-sm">{description}</p>}
          </div>
        )}
        
        {allowUpload && (
          <div className="mt-2">
            <Button 
              variant="outline" 
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="w-full"
            >
              {showUploadForm ? "Cancel" : "Attach Media"}
            </Button>
            
            {showUploadForm && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="mediaSource"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Media URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter image or video URL" 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Attach
                  </Button>
                </form>
              </Form>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
