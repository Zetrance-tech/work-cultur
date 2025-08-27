
// import { useCourse } from "@/contexts/CourseContext";
// import VideoContent from "./VideoContent";


// const VideoPlayerComponent = ({ isReading, setIsReading, isPaused, setIsPaused, audioRef, abortSignal }) => {

//      const { currentTopicId, currentSubTopicId, course } = useCourse();
      
    
//       if (!course || !currentTopicId || !currentSubTopicId) {
//         return <div className="p-4 text-gray-500">No content available.</div>;
//       }
    
//       const currentTopic = course.topics.find(t => t.id === currentTopicId);
//       const currentSubTopic = currentTopic?.subTopics.find(st => st.id === currentSubTopicId);

//       let videofileUrl: string | undefined;
//       if(currentSubTopic?.type == 'text') {
//         videofileUrl = 'https://www.youtube.com/watch?v=0bAVd9jJE2Q';
//       }
    
//       if (!currentTopic || !currentSubTopic) {
//         return <div className="p-4 text-gray-500">No content available.</div>;
//       }

//   return (
    
//       currentSubTopic.type !== "text" ? 
//      <h2>view content at side bar
//      </h2> :
//      <div>
//        <p>isReading: {isReading ? "Yes" : "No"}</p>
//        <p>isPaused: {isPaused ? "Yes" : "No"}</p>

//        <VideoContent subTopic={{ ...currentSubTopic, videoUrl: videofileUrl }} /> 
//      </div>
//   );
// };

// export default VideoPlayerComponent;



// import { useCourse } from "@/contexts/CourseContext";
// import { Button } from "@/components/ui/button";
// import { Play, X } from "lucide-react";
// import { Player } from "video-react";
// import "video-react/dist/video-react.css";
// import { useToast } from "@/hooks/use-toast";
// import { useEffect, useRef } from "react";

// interface VideoPlayerComponentProps {
//   isReading: boolean;
//   setIsReading: (value: boolean) => void;
//   isPaused: boolean;
//   setIsPaused: (value: boolean) => void;
//   abortSignal: AbortSignal;
// }

// const VideoPlayerComponent = ({ isReading, setIsReading, isPaused, setIsPaused, abortSignal }: VideoPlayerComponentProps) => {
//   const { currentTopicId, currentSubTopicId, course, isVideoFullScreen, setIsVideoFullScreen, videofileUrl } = useCourse();
//   const { toast } = useToast();
//   const playerRef = useRef<any>(null);

//   // Handle Escape key for exiting fullscreen
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape" && isVideoFullScreen) {
//         setIsVideoFullScreen(false);
//         setIsPaused(true);
//         setIsReading(false);
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [isVideoFullScreen, setIsVideoFullScreen, setIsPaused, setIsReading]);

//   // Sync video playback with isReading and isPaused states
//   useEffect(() => {
//     if (!videofileUrl || !playerRef.current) return;

//     if (isReading && !isPaused) {
//       // Play video
//       playerRef.current.play();
//     } else {
//       // Pause video
//       playerRef.current.pause();
//     }
//   }, [isReading, isPaused, videofileUrl]);

//   const handleVideoError = () => {
//     toast({
//       title: "Video Error",
//       description: "Failed to load video. Please check the URL.",
//       variant: "destructive",
//     });
//   };

//   // Early return for missing course or topic data
//   if (!course || !currentTopicId || !currentSubTopicId) {
//     return <div className="p-4 text-gray-500">No content available.</div>;
//   }

//   const currentTopic = course.topics.find(t => t.id === currentTopicId);
//   const currentSubTopic = currentTopic?.subTopics.find(st => st.id === currentSubTopicId);

//   if (!currentTopic || !currentSubTopic) {
//     return <div className="p-4 text-gray-500">No content available.</div>;
//   }

//   // Early return for non-text subtopics
//   if (currentSubTopic.type !== "text") {
//     return <h2 className="p-4 text-gray-500">View content at sidebar</h2>;
//   }

//   // Fullscreen video view
//   // if (isVideoFullScreen) {
//   //   return (
//   //     <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
//   //       <Button
//   //         variant="outline"
//   //         className="absolute top-4 right-4 z-50 bg-white/90 hover:bg-white"
//   //         onClick={() => {
//   //           setIsVideoFullScreen(false);
//   //           setIsPaused(true);
//   //           setIsReading(false);
//   //         }}
//   //         aria-label="Close fullscreen"
//   //       >
//   //         <X className="w-5 h-5" />
//   //       </Button>
//   //       <Player
//   //         ref={playerRef}
//   //         autoPlay={isReading && !isPaused}
//   //         fluid
//   //         src={videofileUrl}
//   //         className="max-w-[90vw] max-h-[90vh]"
//   //         onError={handleVideoError}
//   //       />
//   //     </div>
//   //   );
//   // }

//   // Default video preview view
//   return (
//     <div className="p-4 relative">
//       <h3 className="text-xl font-semibold mb-4">{currentSubTopic.title}</h3>
//       <span>
//         {
//         "isReading : " + (isReading ? "Yes" : "No") + ", isPaused: " + (isPaused ? "Yes" : "No")
//         }
//       </span>
//       <div className="relative aspect-video bg-black rounded-lg overflow-hidden group w-full h-full">
//         {/* <div className="absolute inset-0 flex items-center justify-center z-10">
//           <Button
//             // className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center"
//             onClick={() => {
//               // setIsVideoFullScreen(true);
//               setIsPaused(false);
//               setIsReading(true);
//             }}
//           // aria-label="Play video"
//           >
//             <Play className="w-8 h-8 text-white " />
//           </Button>
//         </div> */}
//         <Player
//           ref={playerRef}
//           muted
//           autoPlay={false}
//           fluid
//           src={videofileUrl}
//           controls={false}
//           bigPlayButton={false}
//           className="pointer-events-none w-full h-full"
//           onError={handleVideoError} 
//         />
//       </div>
//     </div>
//   );
// };

// export default VideoPlayerComponent;





// import { useCourse } from "@/contexts/CourseContext";
// import { Button } from "@/components/ui/button";
// import { Play, X } from "lucide-react";
// import { Player ,BigPlayButton} from "video-react";
// import "video-react/dist/video-react.css";
// import { useToast } from "@/hooks/use-toast";
// import { useEffect, useRef } from "react";

// interface VideoPlayerComponentProps {
//   isReading: boolean;
//   setIsReading: (value: boolean) => void;
//   isPaused: boolean;
//   setIsPaused: (value: boolean) => void;
//   abortSignal: AbortSignal;
// }

// const VideoPlayerComponent = ({ isReading, setIsReading, isPaused, setIsPaused, abortSignal }: VideoPlayerComponentProps) => {
//   const { currentTopicId, currentSubTopicId, course, isVideoFullScreen, setIsVideoFullScreen, videofileUrl } = useCourse();
//   const { toast } = useToast();
//   const playerRef = useRef<any>(null);

//   // Handle Escape key for exiting fullscreen
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape" && isVideoFullScreen) {
//         setIsVideoFullScreen(false);
//         setIsPaused(true);
//         setIsReading(false);
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [isVideoFullScreen, setIsVideoFullScreen, setIsPaused, setIsReading]);

//   // Sync video playback with isReading and isPaused states
//   useEffect(() => {
//     if (!videofileUrl || !playerRef.current) return;

//     if (isReading && !isPaused) {
//       // Play video
//       playerRef.current.play();
//     } else {
//       // Pause video
//       playerRef.current.pause();
//       // Reset video to 0 seconds when stopped (isReading: false, isPaused: false)
//       if (!isReading && !isPaused) {
//         playerRef.current.seek(0);
//       }
//     }
//   }, [isReading, isPaused, videofileUrl]);

//   const handleVideoError = () => {
//     toast({
//       title: "Video Error",
//       description: "Failed to load video. Please check the URL.",
//       variant: "destructive",
//     });
//   };

//   // Early return for missing course or topic data
//   if (!course || !currentTopicId || !currentSubTopicId) {
//     return <div className="p-4 text-gray-500">No content available.</div>;
//   }

//   const currentTopic = course.topics.find(t => t.id === currentTopicId);
//   const currentSubTopic = currentTopic?.subTopics.find(st => st.id === currentSubTopicId);

//   if (!currentTopic || !currentSubTopic) {
//     return <div className="p-4 text-gray-500">No content available.</div>;
//   }

//   // Early return for non-text subtopics
//   if (currentSubTopic.type !== "text") {
//     return <h2 className="p-4 text-gray-500">View content at sidebar</h2>;
//   }

//   // Fullscreen video view
//   if (isVideoFullScreen) {
//     return (
//       <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
//         <Button
//           variant="outline"
//           className="absolute top-4 right-4 z-50 bg-white/90 hover:bg-white"
//           onClick={() => {
//             setIsVideoFullScreen(false);
//             setIsPaused(true);
//             setIsReading(false);
//           }}
//           aria-label="Close fullscreen"
//         >
//           <X className="w-5 h-5" />
//         </Button>
//         {/* <Player
//           ref={playerRef}
//           autoPlay={isReading && !isPaused}
//           fluid
//           src={videofileUrl}
//           className="w-full h-full"
//           onError={handleVideoError}
//         >
       
//         </Player> */}

//          <Player
//                     muted={false}
//                     autoPlay={true}
//                     fluid = {false}
//                     width= "100%"
//                      height="100%"
//                     src={videofileUrl}
//                     controls={false}
//                     bigPlayButton={false}
//                     className="w-full h-full"
//                     onError={handleVideoError}
//                     aspectRatio="16:9"
                    
//                   >
            
//                   </Player>
//       </div>
//     );
//   }

//   // Default video preview view
//   return (
//     <div className="p-4 relative">
//       <h3 className="text-xl font-semibold mb-4">{currentSubTopic.title}</h3>
//       <div className="relative aspect-video bg-black rounded-lg overflow-hidden group w-full h-full"

//       >
        
//         <Player
//           ref={playerRef}
//           muted ={false}
//           autoPlay={false}
//           fluid = {false}
//           width= "100%"
//           height="100%"
//           src={videofileUrl}
//           controls={false}
//           bigPlayButton={false}
//           className="w-full h-full"
//           onError={handleVideoError}
//           aspectRatio="16:9"

//         >
//           <BigPlayButton position="center" />
//         </Player>
//       </div>
//     </div>
//   );
// };

// export default VideoPlayerComponent;





// import { useCourse } from "@/contexts/CourseContext";
// import { Button } from "@/components/ui/button";
// import { Play, X } from "lucide-react";
// import { Player, BigPlayButton } from "video-react";
// import "video-react/dist/video-react.css";
// import { useToast } from "@/hooks/use-toast";
// import { useEffect, useRef } from "react";

// interface VideoPlayerComponentProps {
//   isReading: boolean;
//   setIsReading: (value: boolean) => void;
//   isPaused: boolean;
//   setIsPaused: (value: boolean) => void;
//   abortSignal: AbortSignal;
// }

// const VideoPlayerComponent = ({
//   isReading,
//   setIsReading,
//   isPaused,
//   setIsPaused,
//   abortSignal,
// }: VideoPlayerComponentProps) => {
//   const {
//     currentTopicId,
//     currentSubTopicId,
//     course,
//     isVideoFullScreen,
//     setIsVideoFullScreen,
    
//   } = useCourse();
//   const { toast } = useToast();
//   const playerRef = useRef<any>(null);

//   // Handle Escape key for exiting fullscreen
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape" && isVideoFullScreen) {
//         setIsVideoFullScreen(false);
//         setIsPaused(true);
//         setIsReading(false);
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [isVideoFullScreen, setIsVideoFullScreen, setIsPaused, setIsReading]);

//   // Sync video playback with isReading and isPaused states


//   const handleVideoError = () => {
//     toast({
//       title: "Video Error",
//       description: "Failed to load video. Please check the URL.",
//       variant: "destructive",
//     });
//   };

//   // Early return for missing course or topic data
//   if (!course || !currentTopicId || !currentSubTopicId) {
//     return <div className="p-4 text-gray-500">No content available.</div>;
//   }

//   const currentTopic = course.topics.find((t) => t.id === currentTopicId);
//   const currentSubTopic = currentTopic?.subTopics.find(
//     (st) => st.id === currentSubTopicId
//   );

//   if (!currentTopic || !currentSubTopic) {
//     return <div className="p-4 text-gray-500">No content available.</div>;
//   }

//   // Early return for non-text subtopics
//   if (currentSubTopic.type !== "text") {
//     return <div className="flex items-center justify-center h-full">
//       <h2 className="text-gray-500 font-semibold text-lg">View content at sidebar</h2>
//     </div>;
//   }


//     useEffect(() => {
//     if (!currentSubTopic.avatarvideofile || !playerRef.current) return;

//     if (isReading && !isPaused) {
//       // Play video
//       playerRef.current.play();
//     } else {
//       // Pause video
//       playerRef.current.pause();
//       // Reset video to 0 seconds when stopped (isReading: false, isPaused: false)
//       if (!isReading && !isPaused) {
//         playerRef.current.seek(0);
//       }
//     }
//   }, [isReading, isPaused, currentSubTopic.avatarvideofile]);



//   return (
//     <div className="p-4 relative">
//       <h3 className="text-xl font-semibold mb-4">{currentSubTopic.title}</h3>
//       <div
//         className="relative aspect-video bg-black rounded-lg overflow-hidden group w-full h-full max-w-4xl mx-auto"
//         style={{ position: "relative" }}
//       >


//         <Player
//           ref={playerRef}
//           muted={false}
//           autoPlay={false}
//           fluid={false}
//           width="100%"
//           height="100%"
//           src={currentSubTopic.avatarvideofile.url}
//           controls={false}
//           bigPlayButton={false}
//           className="w-full h-full"
//           onError={handleVideoError}
//           aspectRatio="16:9"
//         >
//           <BigPlayButton position="center" />
//         </Player>

       
//       </div>
//     </div>
//   );
// };

// export default VideoPlayerComponent;




import { useCourse } from "@/contexts/CourseContext";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";
import { Player, BigPlayButton } from "video-react";
import "video-react/dist/video-react.css";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";

interface VideoPlayerComponentProps {
  isReading: boolean;
  setIsReading: (value: boolean) => void;
  isPaused: boolean;
  setIsPaused: (value: boolean) => void;
  abortSignal: AbortSignal;
}

const VideoPlayerComponent = ({
  isReading,
  setIsReading,
  isPaused,
  setIsPaused,
  abortSignal,
}: VideoPlayerComponentProps) => {
  const {
    currentTopicId,
    currentSubTopicId,
    course,
    isVideoFullScreen,
    setIsVideoFullScreen,
  } = useCourse();
  const { toast } = useToast();
  const playerRef = useRef<any>(null);

  // Handle Escape key for exiting fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVideoFullScreen) {
        setIsVideoFullScreen(false);
        setIsPaused(true);
        setIsReading(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVideoFullScreen, setIsVideoFullScreen, setIsPaused, setIsReading]);

  // Sync video playback with isReading and isPaused states
  useEffect(() => {
    if (!currentSubTopicId || !currentTopicId || !course) return; // Early check to avoid unnecessary logic
    const currentTopic = course.topics.find((t) => t.id === currentTopicId);
    const currentSubTopic = currentTopic?.subTopics.find(
      (st) => st.id === currentSubTopicId
    );
    
    if (!currentSubTopic?.avatarvideofile || !playerRef.current) return;

    if (isReading && !isPaused) {
      // Play video
      playerRef.current.play();
    } else {
      // Pause video
      playerRef.current.pause();
      // Reset video to 0 seconds when stopped (isReading: false, isPaused: false)
      if (!isReading && !isPaused) {
        playerRef.current.seek(0);
      }
    }
  }, [isReading, isPaused, course, currentTopicId, currentSubTopicId]);

  const handleVideoError = () => {
    toast({
      title: "Video Error",
      description: "Failed to load video. Please check the URL.",
      variant: "destructive",
    });
  };

  // Early return for missing course or topic data
  if (!course || !currentTopicId || !currentSubTopicId) {
    return <div className="p-4 text-gray-500">No content available.</div>;
  }

  const currentTopic = course.topics.find((t) => t.id === currentTopicId);
  const currentSubTopic = currentTopic?.subTopics.find(
    (st) => st.id === currentSubTopicId
  );

  if (!currentTopic || !currentSubTopic) {
    return <div className="p-4 text-gray-500">No content available.</div>;
  }

  // Early return for non-text subtopics
  if (currentSubTopic.type !== "text") {
    return (
      <div className="flex items-center justify-center h-full">
        <h2 className="text-gray-500 font-semibold text-lg">
          View content at sidebar
        </h2>
      </div>
    );
  }

  // Fullscreen video view
  if (isVideoFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <Button
          variant="outline"
          className="absolute top-4 right-4 z-50 bg-white/90 hover:bg-white"
          onClick={() => {
            setIsVideoFullScreen(false);
            setIsPaused(true);
            setIsReading(false);
          }}
          aria-label="Close fullscreen"
        >
          <X className="w-5 h-5" />
        </Button>
        <Player
          ref={playerRef}
          muted={false}
          autoPlay={isReading && !isPaused}
          fluid={false}
          width="100%"
          height="100%"
          src={currentSubTopic.avatarvideofile.url}
          controls={false}
          bigPlayButton={false}
          className="w-full h-full"
          onError={handleVideoError}
          aspectRatio="16:9"
        >
          <BigPlayButton position="center" />
        </Player>
      </div>
    );
  }

  // Default video preview view
  return (
    <div className="p-4 relative">
      <h3 className="text-xl font-semibold mb-4">{currentSubTopic.title}</h3>
      <div
        className="relative aspect-video bg-black rounded-lg overflow-hidden group w-full h-full max-w-4xl mx-auto"
        style={{ position: "relative" }}
      >
        <Player
          ref={playerRef}
          muted={false}
          autoPlay={false}
          fluid={false}
          width="100%"
          height="100%"
          src={currentSubTopic.avatarvideofile.url}
          controls={false}
          bigPlayButton={false}
          className="w-full h-full"
          onError={handleVideoError}
          aspectRatio="16:9"
        >
          <BigPlayButton position="center" />
        </Player>
      </div>
    </div>
  );
};

export default VideoPlayerComponent;






