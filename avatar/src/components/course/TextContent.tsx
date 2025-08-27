

// import { useEffect} from "react";
// import { SubTopic } from "@/contexts/CourseContext";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { MutableRefObject } from "react";

// interface TextContentProps {
//   subTopic: SubTopic;
//   isReading: boolean;
//   setIsReading: (isReading: boolean) => void;
//   isPaused: boolean;
//   setIsPaused: (isPaused: boolean) => void;
//   audioRef: MutableRefObject<HTMLAudioElement | null>;
// }

// const TextContent = ({ subTopic, setIsReading, isPaused, setIsPaused, audioRef ,isReading}: TextContentProps) => {
//   const { toast } = useToast();

//   const handleReadAloud = async () => {
//     if (!subTopic.audioUrl) {
//       toast({
//         title: "Audio Not Available",
//         description: "No audio file is available for this subtopic.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (audioRef.current && audioRef.current.paused && isPaused) {
//       // Resume playback
//       audioRef.current.play().then(() => {
//         setIsPaused(false);
//         setIsReading(true);
//       }).catch((error) => {
//         console.error('Audio playback error:', error);
//         toast({
//           title: "Playback Error",
//           description: "Failed to resume audio. Please try again.",
//           variant: "destructive",
//         });
//         setIsReading(false);
//         setIsPaused(false);
//         audioRef.current = null;
//       });
//       return;
//     }

//     if (audioRef.current && !audioRef.current.paused) {
//       // Pause playback
//       audioRef.current.pause();
//       setIsPaused(true);
//       setIsReading(false);
//       return;
//     }

//     // Start fresh playback
//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current = null;
//     }

//     const audio = new Audio(subTopic.audioUrl);
//     audioRef.current = audio;

//     audio.onplay = () => {
//       setIsReading(true);
//       setIsPaused(false);
//     };

//     audio.onended = () => {
//       setIsReading(false);
//       setIsPaused(false);
//       audioRef.current = null;
//     };

//     audio.onerror = () => {
//       console.error('Audio playback error:', audio.error);
//       toast({
//         title: "Playback Error",
//         description: "Failed to play the audio. Please try again.",
//         variant: "destructive",
//       });
//       setIsReading(false);
//       setIsPaused(false);
//       audioRef.current = null;
//     };

//     try {
//       await audio.play();
//     } catch (error) {
//       console.error('Audio playback error:', error);
//       toast({
//         title: "Playback Error",
//         description: "Failed to play the audio. Please try again.",
//         variant: "destructive",
//       });
//       setIsReading(false);
//       setIsPaused(false);
//       audioRef.current = null;
//     }

    
//   };

//   const handleStop = () => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current = null;
//     }
//     setIsReading(false);
//     setIsPaused(false);
//     toast({
//       title: "Audio Stopped",
//       description: "Audio playback has been stopped. Click 'Read Aloud' to start again.",
//     });
//   };

 
//   useEffect(() => {
//     return () => {
//       if (audioRef.current) {
//         audioRef.current.pause();
//         audioRef.current = null;
//       }
//       setIsReading(false);
//       setIsPaused(false);
//     };
//   }, [setIsReading, setIsPaused]);

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-xl font-semibold">{subTopic.title}</h3>
//         {subTopic.content && (
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handleReadAloud}
//               disabled={!subTopic.audioUrl}
//               aria-label={
//                 isReading
//                   ? isPaused
//                     ? "Resume audio"
//                     : "Pause audio"
//                   : "Play audio"
//               }
//             >
//               {subTopic.audioUrl
//                 ? isReading
//                   ? isPaused
//                     ? "Resume"
//                     : "Pause"
//                   : "Play Audio"
//                 : "No Audio Available"}
//             </Button>
//             {(isReading || isPaused) && (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleStop}
//                 aria-label="Stop audio"
//               >
//                 Stop
//               </Button>
//             )}
//           </div>
//         )}
//       </div>
//       <div className="prose max-w-none">
//         {subTopic.content}
//       </div>
//     </div>
//   );
// };

// export default TextContent;


import { useEffect } from "react";
import { SubTopic } from "@/contexts/CourseContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TextContentProps {
  subTopic: SubTopic;
  isReading: boolean;
  setIsReading: (isReading: boolean) => void;
  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
}

const TextContent = ({ subTopic, setIsReading, isPaused, setIsPaused, isReading }: TextContentProps) => {
  const { toast } = useToast();

  const fileurl = subTopic.type === "text" ? "https://www.youtube.com/watch?v=kIY7K-afaFE" : subTopic.videoUrl;

  const handlePlayPause = () => {
    if (!fileurl) {
      toast({
        title: "Video Not Available",
        description: "No video file is available for this subtopic.",
        variant: "destructive",
      });
      return;
    }

    if (isReading && !isPaused) {
      // Pause video
      setIsPaused(true);
      setIsReading(false);
    } else {
      // Play video
      setIsPaused(false);
      setIsReading(true);
    }
  };

  const handleStop = () => {
    setIsReading(false);
    setIsPaused(false);
    toast({
      title: "Video Stopped",
      description: "Video playback has been stopped. Click 'Play' to start again.",
    });
  };

  useEffect(() => {
    return () => {
      setIsReading(false);
      setIsPaused(false);
    };
  }, [setIsReading, setIsPaused]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{subTopic.title}</h3>
        {subTopic.content && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayPause}
              disabled={!fileurl}
              aria-label={
                isReading && !isPaused
                  ? "Pause video"
                  : "Play video"
              }
            >
              {fileurl
                ? isReading && !isPaused
                  ? "Pause"
                  : "Play"
                : "No Video Available"}
            </Button>
            {(isReading || isPaused) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleStop}
                aria-label="Stop video"
              >
                Stop
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="prose max-w-none">
        {subTopic.content}
      </div>
    </div>
  );
};

export default TextContent;