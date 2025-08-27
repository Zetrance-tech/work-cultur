

import { useCourse, SubTopic } from "@/contexts/CourseContext";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";
import { Player,BigPlayButton } from "video-react";
import "video-react/dist/video-react.css";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface VideoContentProps {
  subTopic: SubTopic;
}

const VideoContent = ({ subTopic }: VideoContentProps) => {
  const { isVideoFullScreen, setIsVideoFullScreen} = useCourse();
  const { toast } = useToast();

  const isEmbedUrl = (url: string) => {
    return (
      url.includes("youtube.com") ||
      url.includes("youtu.be") ||
      url.includes("vimeo.com")
    );
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&?]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
    } else if (url.includes("vimeo.com")) {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1` : url;
    }
    return url;
  };

  const handleVideoError = () => {
    toast({
      title: "Video Error",
      description: "Failed to load video. Please check the URL.",
      variant: "destructive",
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVideoFullScreen) {
        setIsVideoFullScreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVideoFullScreen]);

  if (isVideoFullScreen) {
    return (
      <div  className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <Button
          variant="outline"
          className="absolute top-4 right-4 z-50 bg-white/90 hover:bg-white"
          onClick={() => setIsVideoFullScreen(false)}
          aria-label="Close fullscreen"
        >
          <X className="w-5 h-5" />
        </Button>

        {subTopic.videoUrl && isEmbedUrl(subTopic.videoUrl) ? (
          <iframe
            src={getEmbedUrl(subTopic.videoUrl)}
            className="w-full h-full"
            title={subTopic.title}
            allow="autoplay; fullscreen"
            allowFullScreen
            onError={handleVideoError}
          />

         
            
        ) : (
           <Player
                    muted={false}
                    autoPlay={true}
                    fluid = {false}
                    width= "100%"
                     height="100%"
                    src={subTopic.videoUrl}
                    controls={false}
                    bigPlayButton={false}
                    className="w-full h-full"
                    onError={handleVideoError}
                    aspectRatio="16:9"
                  >
            
                  </Player>

        )}
      </div>
    );
  }

  return (
    <div className="p-4 relative">
      <h3 className="text-xl font-semibold mb-4">{subTopic.title}</h3>
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Button
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center"
            onClick={() => setIsVideoFullScreen(true) }
            aria-label="Play video"
          >
            <Play className="w-8 h-8 text-black " />
          </Button>
        </div>

        {subTopic.videoUrl && isEmbedUrl(subTopic.videoUrl) ? (
          <iframe
            src={getEmbedUrl(subTopic.videoUrl)}
            className="w-full h-full pointer-events-none opacity-50"
            title={subTopic.title}
            loading="lazy"
            onError={handleVideoError}
          />

         
        ) : (
         
           <Player
                   
                    muted
                    autoPlay={false}
                    fluid
                    src={subTopic.videoUrl}
                    controls={false}
                    bigPlayButton={true}
                     className="pointer-events-none opacity-50"
                    onError={handleVideoError}
                    aspectRatio="16:9"
                  
                  >
           
                  </Player>
        )}
      </div>
    </div>
  );
};

export default VideoContent;
