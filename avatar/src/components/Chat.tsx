
// import { useState, useEffect, useRef, useCallback } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useCourse } from "@/contexts/CourseContext";
// import { Mic, MicOff } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import axios from "axios";

// interface AskAIResponse {
//   text: string;
//   audioBase64: string;
// }

// const Chat = () => {
//   const { course,chatMessages, addChatMessage, chatLoading, setChatloading, setIsAvatarSpeaking } = useCourse();
//   const [message, setMessage] = useState("");
//   const [isListening, setIsListening] = useState(false);
//   const { toast } = useToast();
//   const recognitionRef = useRef<SpeechRecognition | null>(null);
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);
 
//   useEffect(() => {
//     const handleSpeechInput = (event: CustomEvent) => {
//       const speechText = event.detail.text;
//       if (speechText) {
//         setMessage(speechText);
//       }
//     };

//     window.addEventListener("speech-to-text", handleSpeechInput as EventListener);
//     return () => {
//       window.removeEventListener("speech-to-text", handleSpeechInput as EventListener);
//     };
//   }, []);

//   const stopOngoingProcesses = useCallback(() => {
//     // Stop speech recognition
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//       recognitionRef.current = null;
//     }
//     // Clear timeout
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//       timeoutRef.current = null;
//     }
//     setIsListening(false);
//     setChatloading(false);
//     setIsAvatarSpeaking(false);
//   }, [setChatloading, setIsAvatarSpeaking]);

//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!message.trim()) return;

//     // Stop any ongoing processes
//     stopOngoingProcesses();

//     addChatMessage({ sender: "user", text: message.trim() });
//     const question = message.trim();
//     setMessage("");

//     try {
//       setChatloading(true);
//       // const response = await axios.post("http://localhost:4000/api/v1/askAI", {
//       //   question,courseId: course.id
//       // });
//       const response = await axios.post("http://localhost:4000/api/v1/process-query", {

//        query: question
//         // courseId: course.id,
//       });

//       console.log("Response from askAI endpoint:", response.data);

//       const { text: aiResponse, audioBase64 } = response.data;
// ``
//       if (!text || !audioBase64) {
//         throw new Error("Invalid response format from askAI endpoint");
//       }

//       // Dispatch event to AnimatedAvatar to handle audio and animation
//       const playAudioEvent = new CustomEvent("play-ai-audio", {
//         detail: { text, audioBase64 },
//       });
//       window.dispatchEvent(playAudioEvent);
//     } catch (error) {
//       console.error("Error sending question to askAI endpoint:", error);
//       let errorMessage = "Unable to get response from AI. Please try again.";

//       if (axios.isAxiosError(error)) {
//         if (error.response) {
//           errorMessage = `Server error: ${error.response.status} - ${error.response.data.message || "Unknown error"}`;
//         } else if (error.request) {
//           errorMessage = "Network error: Could not reach the server.";
//         }
//       }

//       toast({
//         title: "Request Failed",
//         description: errorMessage,
//         variant: "destructive",
//       });
//       setChatloading(false);
//     }
//   };

//   const toggleListening = () => {
//     // Stop any ongoing processes
//     stopOngoingProcesses();

//     if (!isListening) {
//       setIsListening(true);

//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       if (!SpeechRecognition) {
      
//         setIsListening(false);
//         toast({
//           title: "Speech Recognition Not Supported",
//           description: "Your browser does not support speech recognition.",
//           variant: "destructive",
//         });
//         return;
//       }

//       const recognition = new SpeechRecognition();
//       recognitionRef.current = recognition;
//       recognition.lang = "en-US";
//       recognition.interimResults = false;
//       recognition.maxAlternatives = 1;

//       recognition.onresult = (event) => {
//         const speechResult = event.results[0][0].transcript;
//         setMessage(speechResult);
//       };

//       recognition.onend = () => {
//         setIsListening(false);
//         recognitionRef.current = null;
//         if (timeoutRef.current) {
//           clearTimeout(timeoutRef.current);
//           timeoutRef.current = null;
//         }
//       };

//       recognition.onerror = (event) => {
//         console.error("Speech recognition error", event.error);
//         setIsListening(false);
//         recognitionRef.current = null;
//         if (timeoutRef.current) {
//           clearTimeout(timeoutRef.current);
//           timeoutRef.current = null;
//         }
//         toast({
//           title: "Speech Recognition Error",
//           description: `Error: ${event.error}. Please try again.`,
//           variant: "destructive",
//         });
//       };

//       recognition.start();

     
//       timeoutRef.current = setTimeout(() => {
//         recognition.stop();
//         toast({
//           title: "No Speech Detected",
//           description: "Speech recognition stopped due to inactivity. Please try again.",
//         });
//       }, 5000);
//     }
//   };


//   useEffect(() => {
//     return () => {
//       stopOngoingProcesses();
//     };
//   }, [stopOngoingProcesses]);

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-grow overflow-auto p-4 space-y-4">
//         {chatMessages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
//           >
//             <div
//               className={`max-w-[80%] rounded-lg p-3 ${
//                 msg.sender === "user"
//                   ? "bg-blue-100 text-blue-800"
//                   : "bg-gray-100 text-gray-800"
//               }`}
//             >
//               {msg.text}
//             </div>
//           </div>
//         ))}

    
//         {chatLoading && (
//           <div className="flex justify-start">
//             <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[60%]">
//               <div className="flex items-center space-x-1 animate-pulse">
//                 <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
//                 <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
//                 <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>


//       <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
//         <Input
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Ask a question..."
//           className="flex-grow"
//         />
//         <Button
//           type="button"
//           onClick={toggleListening}
//           variant={isListening ? "destructive" : "outline"}
//           size="icon"
//           className="rounded-full"
//         >
//           {isListening ? <MicOff size={18} /> : <Mic size={18} />}
//         </Button>
//         <Button type="submit" disabled={chatLoading || !message.trim()}>
//           {chatLoading ? "Loading..." : "Send"}
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default Chat;




///////////////logic with visemas abd audio

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCourse } from "@/contexts/CourseContext";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface VisemeData {
  viseme: number;
  timestamp: number;
}

interface AskAIResponse {
  sessionId: string;
  query: string;
  aiResponse: string;
  audioData: {
    audioPath: string;
    audioFileName: string;
    duration: number;
    audioUrl: string;
  };
  visemeData: VisemeData[];
  timestamp: string;
}

const Chat = () => {
  const { course, chatMessages, addChatMessage, chatLoading, setChatloading, setIsAvatarSpeaking } = useCourse();
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleSpeechInput = (event: CustomEvent) => {
      const speechText = event.detail.text;
      if (speechText) {
        setMessage(speechText);
      }
    };

    window.addEventListener("speech-to-text", handleSpeechInput as EventListener);
    return () => {
      window.removeEventListener("speech-to-text", handleSpeechInput as EventListener);
    };
  }, []);

  const stopOngoingProcesses = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsListening(false);
    setChatloading(false);
    setIsAvatarSpeaking(false);
  }, [setChatloading, setIsAvatarSpeaking]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    stopOngoingProcesses();

    addChatMessage({ sender: "user", text: message.trim() });
    const question = message.trim();
    setMessage("");

    try {
      setChatloading(true);
      if(`${import.meta.env.VITE_BACKEND_API_URL}`) {
        console.log(`our backend url --->${import.meta.env.VITE_BACKEND_API_URL}`)
      }
      const response = await axios.post<AskAIResponse>(`${import.meta.env.VITE_BACKEND_API_URL}/api/v1/process-query`, {
        query: question,
      });

      console.log("Response from process-query endpoint:", response.data);

      const { aiResponse, audioData, visemeData } = response.data;

      if (!aiResponse || !audioData.audioUrl || !visemeData) {
        throw new Error("Invalid response format from process-query endpoint");
      }

      // Add AI response to chat messages
      // addChatMessage({ sender: "ai", text: aiResponse });

      // Dispatch event to AnimatedAvatar with text, audioUrl, and visemeData
      const playAudioEvent = new CustomEvent("play-ai-audio", {
        detail: {
          text: aiResponse,
          audioUrl: audioData.audioUrl,
          visemeData,
        },
      });
      window.dispatchEvent(playAudioEvent);
    } catch (error) {
      console.error("Error sending question to process-query endpoint:", error);
      let errorMessage = "Unable to get response from AI. Please try again.";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = `Server error: ${error.response.status} - ${error.response.data.message || "Unknown error"}`;
        } else if (error.request) {
          errorMessage = "Network error: Could not reach the server.";
        }
      }

      toast({
        title: "Request Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setChatloading(false);
    }
  };

  const toggleListening = () => {
    stopOngoingProcesses();

    if (!isListening) {
      setIsListening(true);

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsListening(false);
        toast({
          title: "Speech Recognition Not Supported",
          description: "Your browser does not support speech recognition.",
          variant: "destructive",
        });
        return;
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setMessage(speechResult);
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        recognitionRef.current = null;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        toast({
          title: "Speech Recognition Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive",
        });
      };

      recognition.start();

      timeoutRef.current = setTimeout(() => {
        recognition.stop();
        toast({
          title: "No Speech Detected",
          description: "Speech recognition stopped due to inactivity. Please try again.",
        });
      }, 5000);
    }
  };

  useEffect(() => {
    return () => {
      stopOngoingProcesses();
    };
  }, [stopOngoingProcesses]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto p-4 space-y-4">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.sender === "user"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {chatLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[60%]">
              <div className="flex items-center space-x-1 animate-pulse">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask a question..."
          className="flex-grow"
        />
        <Button
          type="button"
          onClick={toggleListening}
          variant={isListening ? "destructive" : "outline"}
          size="icon"
          className="rounded-full"
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </Button>
        <Button type="submit" disabled={chatLoading || !message.trim()}>
          {chatLoading ? "Loading..." : "Send"}
        </Button>
      </form>
    </div>
  );
};

export default Chat;