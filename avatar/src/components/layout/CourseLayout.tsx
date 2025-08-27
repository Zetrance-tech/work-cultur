

import { useCourse } from '@/contexts/CourseContext';
import TopicList from '@/components/TopicList';
import ContentDisplay from '@/components/ContentDisplay';
import AnimatedAvatar from '@/components/AnimatedAvatar';
import Chat from '@/components/Chat';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Video } from 'lucide-react';
import VideoPlayerComponent from '../course/VideoPlayerComponent';

const CourseLayout = () => {
  const { showChat, toggleChat, course, currentTopicId, currentSubTopicId } = useCourse();
  const [isReading, setIsReading] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();
  const [imagesLoading, setImagesLoading] = useState<boolean>(true);



  const handleImageLoad = () => {
    setImagesLoading(false);
  };


  useEffect(() => {
    if (window.speechSynthesis.speaking || isPaused) {
      toast({
        title: "Speech Stopped",
        description: "Speech was stopped because you switched to a new topic or subtopic.",
      });
    }
   
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
    speechRef.current = null;
    abortControllerRef.current = new AbortController();
  }, [currentTopicId, currentSubTopicId]);

  let backgroundImageUrl: string | undefined;
  let currentSubTopic: any;
  let currentTopic:any;
  if (course && currentTopicId && currentSubTopicId) {
     currentTopic = course.topics.find(t => t.id === currentTopicId);
    currentSubTopic = currentTopic?.subTopics.find(st => st.id === currentSubTopicId);
    
    if (currentSubTopic?.type === 'text' && currentSubTopic.imageUrl) {
      backgroundImageUrl = currentSubTopic.imageUrl;
    }
  }
  const audioRef = useRef<HTMLAudioElement | null>(null);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="w-1/2 h-full bg-gray-200">
      {
        showChat ? 
         <AnimatedAvatar 
          isImageLoading={imagesLoading}
          onImageLoad={handleImageLoad}
          isReading={isReading}
          backgroundImageUrl={backgroundImageUrl}
          currentTopic={currentTopic}
        /> :
        <VideoPlayerComponent
        isReading={isReading}
        setIsReading={setIsReading}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        // audioRef={audioRef} 
        abortSignal={abortControllerRef.current?.signal}
        />
      }
       
      </div>

      <div className="w-1/2 h-full flex flex-col">
        <div className="bg-white p-4 flex items-center justify-between border-b">
          <div className="text-lg font-medium">
            {showChat ? "CHAT" : "COURSE CONTENT"}
          </div>
          <div className="flex items-center">
            <Label htmlFor="chat-mode" className="mr-2 text-sm">
              {showChat ? "Course" : "Chat"}
            </Label>
            <Switch 
              id="chat-mode" 
              checked={showChat}
              onCheckedChange={toggleChat}
            />
            <Label htmlFor="chat-mode" className="ml-2 text-sm">
              {showChat ? "Chat" : "Course"}
            </Label>
          </div>
        </div>

        <div className="flex-grow overflow-hidden flex flex-col">
          {showChat ? (
            <Chat />
          ) : (
            <div className="flex flex-col h-full">
              <div className="border-b" style={{ height: '35%', minHeight: '200px', maxHeight: '300px' }}>
                <TopicList />
              </div>
              <div className="flex-grow overflow-auto">

              <ContentDisplay
                isReading={isReading}
                setIsReading={setIsReading}
                isPaused={isPaused}
                setIsPaused={setIsPaused}
                audioRef={audioRef} 
                abortSignal={abortControllerRef.current?.signal}
              />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseLayout;





