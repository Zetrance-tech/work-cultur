// import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronDown, ChevronUp, Hand, Mic, MicOff } from 'lucide-react';
// import { useCourse } from '@/contexts/CourseContext';
// import { Button } from '@/components/ui/button';
// import { useToast } from '@/hooks/use-toast';
// import axios from "axios";

// const DB_NAME = 'AvatarImagesDB';
// const STORE_NAME = 'frames';
// const NATURAL_PREFIX = 'natural';
// const SPEAKING_PREFIX = 'speaking';

// interface VisemeData {
//   viseme: number;
//   timestamp: number;
// }

// interface AnimatedAvatarProps {
//   isReading?: boolean;
//   altText?: string;
//   backgroundImageUrl?: string;
//   currentTopic?: any;
//   isImageLoading?: boolean;
//   onImageLoad?: () => void;
// }

// const pendingRequests = new Map<string, Promise<string | null>>();
// const globalImageCache = new Map<string, HTMLImageElement>();

// const AnimatedAvatar: React.FC<AnimatedAvatarProps> = memo(({ 
//   isReading, 
//   altText = "Course avatar", 
//   backgroundImageUrl, 
//   currentTopic ,
//   isImageLoading,
//   onImageLoad,
// }) => {
//   // UI State
//   const [isMinimized, setIsMinimized] = useState<boolean>(!!backgroundImageUrl);
//   const [hasUserToggled, setHasUserToggled] = useState<boolean>(false);
//   const [isListening, setIsListening] = useState<boolean>(false);
//   const [isMuted, setIsMuted] = useState<boolean>(false);
//   const [currentEmotion, setCurrentEmotion] = useState<string>("neutral");
//   const [loadingStates, setLoadingStates] = useState<Record<string, 'idle' | 'loading' | 'loaded' | 'error'>>({
//     neutral: 'idle',
//     speaking: 'idle',
//   });
//   const [frameCache, setFrameCache] = useState<Record<string, string>>({});
//   const [error, setError] = useState<string | null>(null);
//   const [visemeData, setVisemeData] = useState<VisemeData[]>([]);
//   const [frameTransitionData, setFrameTransitionData] = useState<any[]>([]);
//   const [currentFrame, setCurrentFrame] = useState<string | null>(null);
  
//   // Context and hooks
//   const { 
//     toggleChat, 
//     addChatMessage, 
//     setChatloading, 
//     isAvatarSpeaking, 
//     setIsAvatarSpeaking, 
//     course,
//     chatMessages 
//   } = useCourse();
//   const { toast } = useToast();
  
//   // Refs
//   const isMounted = useRef(true);
//   const dbRef = useRef<IDBDatabase | null>(null);
//   const animationRef = useRef<number | null>(null);
//   const recognitionRef = useRef<any>(null);
//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const loadingPromiseRef = useRef<Promise<void> | null>(null);
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const currentVisemeIndex = useRef<number>(0);

//   const courseId = useMemo(() => course?.id, [course?.id]);
//   const courseAvatarId: string = course?.courseAvatar?.avatarAzureResourcesId;
//   //need to set azureUrl from corseAvatar Id
//   const azureUrl = 'https://workcultur.blob.core.windows.net/avatars/avatar-3';
//   // const naturalFrame = course?.courseAvatar?.naturalFrame || 80;
//   const naturalFrame = 192
//   // const naturalFps = course?.courseAvatar?.naturalFPS || 10;
//    const naturalFps = 30;
//   const speakingFrame = course?.courseAvatar?.speakingFrame || 21;

//   const SPRITE_CONFIG = useMemo(() => ({
//     neutral: { 
//       baseUrl: `${azureUrl}/natural/`, 
//       frames: naturalFrame, 
//       fps: naturalFps,
//       fileExtension: 'jpg'
//     },
//     speaking: { 
//       baseUrl: `${azureUrl}/speaking/`, 
//       frames: 22, 
//       fps: 1,
//       fileExtension: 'jpg'
//     },
//   }), [azureUrl, naturalFrame, naturalFps, speakingFrame, courseAvatarId]);

//   // Initialize IndexedDB
//   const initDB = useCallback(() => {
//     return new Promise<void>((resolve, reject) => {
//       if (dbRef.current) {
//         resolve();
//         return;
//       }

//       const request = indexedDB.open(DB_NAME, 1);
      
//       request.onupgradeneeded = () => {
//         const db = request.result;
//         if (!db.objectStoreNames.contains(STORE_NAME)) {
//           db.createObjectStore(STORE_NAME);
//         }
//       };
      
//       request.onsuccess = () => {
//         dbRef.current = request.result;
//         resolve();
//       };
      
//       request.onerror = () => {
//         reject(request.error);
//       };
//     });
//   }, []);

//   const storeImage = useCallback(async (key: string, blob: Blob) => {
//     return new Promise<void>((resolve, reject) => {
//       if (!dbRef.current) {
//         reject(new Error('Database not initialized'));
//         return;
//       }

//       const tx = dbRef.current.transaction([STORE_NAME], 'readwrite');
//       const store = tx.objectStore(STORE_NAME);
//       const request = store.put(blob, key);
      
//       request.onsuccess = () => resolve();
//       request.onerror = () => reject(request.error);
//     });
//   }, []);

//   const getImage = useCallback(async (key: string): Promise<Blob | null> => {
//     return new Promise((resolve, reject) => {
//       if (!dbRef.current) {
//         resolve(null);
//         return;
//       }

//       const tx = dbRef.current.transaction([STORE_NAME], 'readonly');
//       const store = tx.objectStore(STORE_NAME);
//       const request = store.get(key);
      
//       request.onsuccess = () => resolve(request.result as Blob | null);
//       request.onerror = () => reject(request.error);
//     });
//   }, []);

//   const fetchImage = useCallback(async (url: string, retries = 1): Promise<Blob> => {
//     console.log(`Fetching image from azure URL: ${url}`);
//     try {
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}`);
//       }
//       return await response.blob();
//     } catch (err) {
//       throw err;
//     }
//   }, []);

//   const fetchNaturalImages = useCallback(async (): Promise<string[]> => {
//     console.log("Fetching natural images...");
//     if (!azureUrl) return [];
    
//     const stored: string[] = [];
//     const { baseUrl, frames, fileExtension } = SPRITE_CONFIG.neutral;

//     for (let i = 0; i <= frames; i++) {
//       console.log(`Fetching natural image ${i}--->`);
//       const imageName = `${i}.${fileExtension}`;
//       const imageUrl = `${baseUrl}${imageName}`;
//       const storageKey = `${NATURAL_PREFIX}:${imageName}`;

//       try {
//         if (frameCache[storageKey]) {
//           stored.push(storageKey);
//           continue;
//         }

//         let blob = await getImage(storageKey);
        
//         if (!blob) {
//           console.log(`Fetching image from URL ---> : ${imageUrl}`);
//           blob = await fetchImage(imageUrl);
//           await storeImage(storageKey, blob);
//         }

//         const blobUrl = URL.createObjectURL(blob);
//         setFrameCache(prev => ({ ...prev, [storageKey]: blobUrl }));
//         stored.push(storageKey);

//         const img = new Image();
//         img.src = blobUrl;
//         globalImageCache.set(storageKey, img);
//       } catch (err) {
//         console.error(`Error processing natural frame ${i}:`, err);
//       }
//     }
//     return stored;
//   }, [azureUrl, SPRITE_CONFIG, frameCache, getImage, storeImage]);

//   const fetchSpeakingImages = useCallback(async (): Promise<string[]> => {
//     if (!azureUrl) return [];
    
//     const stored: string[] = [];
//     const { baseUrl, frames, fileExtension } = SPRITE_CONFIG.speaking;
    
//     console.log('Loading speaking frames...');

//     // First load the basic viseme frames (0 to frames-1)
//     for (let i = 0; i < frames; i++) {
//       const imageName = `${i}.${fileExtension}`;
//       const imageUrl = `${baseUrl}${imageName}`;
//       const storageKey = `${SPEAKING_PREFIX}:${imageName}`;

//       try {
//         if (frameCache[storageKey]) {
//           console.log(`Frame already in cache: ${storageKey}`);
//           stored.push(storageKey);
//           continue;
//         }

//         console.log(`Loading speaking image: ${imageUrl}`);
//         let blob = await getImage(storageKey);
        
//         if (!blob) {
//           blob = await fetchImage(imageUrl);
//           await storeImage(storageKey, blob);
//         }

//         const blobUrl = URL.createObjectURL(blob);
//         setFrameCache(prev => ({ ...prev, [storageKey]: blobUrl }));
//         stored.push(storageKey);

//         const img = new Image();
//         img.src = blobUrl;
//         globalImageCache.set(storageKey, img);
//       } catch (err) {
//         console.error(`Error processing viseme ${i}:`, err);
//       }
//     }

//     // Then load transition frames
//     for (let i = 0; i < frames; i++) {
//       for (let j = 0; j < frames; j++) {
//         for (const blend of ['25', '50', '75']) {
//           try {
//             const imageName = `${i}-${j}_${blend}.${fileExtension}`;
//             const imageUrl = `${baseUrl}${imageName}`;
//             const storageKey = `${SPEAKING_PREFIX}:${imageName}`;

//             // Only fetch if not already cached
//             if (!frameCache[storageKey]) {
//               let blob = await getImage(storageKey);
//               if (!blob) {
//                 blob = await fetchImage(imageUrl);
//                 await storeImage(storageKey, blob);
//               }
//               const blobUrl = URL.createObjectURL(blob);
//               setFrameCache(prev => ({ ...prev, [storageKey]: blobUrl }));
              
//               // Preload image
//               const img = new Image();
//               img.src = blobUrl;
//               globalImageCache.set(storageKey, img);
//             }
//             stored.push(storageKey);
//           } catch (err) {
//             console.error(`Error processing transition ${i}-${j}_${blend}:`, err);
//           }
//         }
//       }
//     }

//     return stored;
//   }, [azureUrl, SPRITE_CONFIG, frameCache, getImage, storeImage]);

//   const loadModeFrames = useCallback(async (mode: string) => {
//     console.log(`Loading ${mode} frames...`);
//     console.log(`Current loading state for ${mode}:`, loadingStates[mode]);
//     if (loadingStates[mode] !== 'idle') return;
//     console.log(`Setting loading state for ${mode}`);
//     setLoadingStates(prev => ({ ...prev, [mode]: 'loading' }));

//     try {
//       await initDB();
      
//       const storedImages = mode === 'neutral' 
//         ? await fetchNaturalImages()
//         : await fetchSpeakingImages();

//       if (storedImages.length > 0) {
//         setLoadingStates(prev => ({ ...prev, [mode]: 'loaded' }));
//         // Set initial frame
//         if (mode === 'neutral') {
//           const initialFrameKey = `${NATURAL_PREFIX}:1.${SPRITE_CONFIG.neutral.fileExtension}`;
//           if (frameCache[initialFrameKey]) {
//             setCurrentFrame(frameCache[initialFrameKey]);
//           }
//         } else if (mode === 'speaking') {
//           const initialFrameKey = `${SPEAKING_PREFIX}:0.${SPRITE_CONFIG.speaking.fileExtension}`;
//           if (frameCache[initialFrameKey]) {
//             setCurrentFrame(frameCache[initialFrameKey]);
//           }
//           onImageLoad?.();
//         }
//       } else {
//         throw new Error(`No ${mode} images loaded`);
//       }
//     } catch (err) {
//       console.error(`Error loading ${mode} frames:`, err);
//       setLoadingStates(prev => ({ ...prev, [mode]: 'error' }));
//       setError(err instanceof Error ? err.message : 'Unknown error');
//     }
//   }, [loadingStates, initDB, fetchNaturalImages, fetchSpeakingImages, frameCache, SPRITE_CONFIG, onImageLoad]);

//   // Initialize loading
//   useEffect(() => {
//     loadModeFrames('neutral');
//     const timer = setTimeout(() => {
//       loadModeFrames('speaking');
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, [loadModeFrames]);

//   const animateNaturalMode = useCallback(() => {
//     const { fps, frames } = SPRITE_CONFIG.neutral;
//     let lastFrameTime = Date.now();
//     let currentFrameIndex = 1; // Start from frame 1

//     const animate = () => {
//       if (currentEmotion !== 'neutral') return;

//       const now = Date.now();
//       const delta = now - lastFrameTime;

//       if (delta > 1000 / fps) {
//         currentFrameIndex = (currentFrameIndex % frames) + 1; // Loop through frames 1 to frames
        
//         const frameKey = `${NATURAL_PREFIX}:${currentFrameIndex}.${SPRITE_CONFIG.neutral.fileExtension}`;
//         if (frameCache[frameKey]) {
//           setCurrentFrame(frameCache[frameKey]);
//         }
        
//         lastFrameTime = now - (delta % (1000 / fps));
//       }

//       animationRef.current = window.requestAnimationFrame(animate);
//     };

//     animationRef.current = requestAnimationFrame(animate);
//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//     };
//   }, [currentEmotion, SPRITE_CONFIG, frameCache]);

//   const checkFrameExists = useCallback((frameKey: string): boolean => {
//     return frameCache[frameKey] !== undefined;
//   }, [frameCache]);

//   const buildFrameTransitionData = useCallback((visemes: VisemeData[], audioDuration?: number) => {
//     console.log('Building frame transition data...', { visemes, audioDuration });
//     if (visemes.length === 0) return [];
    
//     const frames: any[] = [];
    
//     // Add initial silence frame if needed
//     if (visemes[0].timestamp > 0) {
//       const silentFrameKey = `${SPEAKING_PREFIX}:0.${SPRITE_CONFIG.speaking.fileExtension}`;
//       frames.push({
//         frameKey: silentFrameKey,
//         startTime: 0,
//         duration: visemes[0].timestamp,
//         viseme: 0
//       });
//     }
    
//     for (let i = 0; i < visemes.length; i++) {
//       const currentViseme = visemes[i].viseme;
//       const timestamp = visemes[i].timestamp;
//       const nextTimestamp = i < visemes.length - 1 
//         ? visemes[i + 1].timestamp 
//         : (audioDuration || 0) * 1000;
      
//       const duration = nextTimestamp - timestamp;
//       console.log(`Processing viseme ${currentViseme} at ${timestamp}ms, duration: ${duration}ms`);
      
//       // Ensure the viseme frame exists
//       const visemeFrameKey = `${SPEAKING_PREFIX}:${currentViseme}.${SPRITE_CONFIG.speaking.fileExtension}`;
//       const fallbackFrameKey = `${SPEAKING_PREFIX}:0.${SPRITE_CONFIG.speaking.fileExtension}`;
      
//       const frameToUse = checkFrameExists(visemeFrameKey) ? visemeFrameKey : fallbackFrameKey;
      
//       frames.push({
//         frameKey: frameToUse,
//         startTime: timestamp,
//         duration: duration,
//         viseme: currentViseme,
//         isFallback: !checkFrameExists(visemeFrameKey)
//       });
//     }
    
//     console.log('Generated frame transition data:', frames);
//     return frames;
//   }, [SPRITE_CONFIG, checkFrameExists]);

//   const animateSpeakingMode = useCallback(() => {
//     console.log('Starting speaking mode animation', { 
//       hasAudio: !!audioRef.current, 
//       hasFrames: frameTransitionData.length > 0,
//       emotion: currentEmotion 
//     });
    
//     if (!audioRef.current || frameTransitionData.length === 0) {
//       console.log('Animation skipped - missing audio or frames');
//       return;
//     }

//     const audio = audioRef.current;
//     let isAnimating = true;

//     const animate = () => {
//       if (!isAnimating || audio.paused || audio.ended) {
//         console.log('Animation stopped', { isAnimating, paused: audio.paused, ended: audio.ended });
//         // Set to neutral frame when stopping
//         const neutralFrameKey = `${SPEAKING_PREFIX}:0.${SPRITE_CONFIG.speaking.fileExtension}`;
//         if (frameCache[neutralFrameKey]) {
//           setCurrentFrame(frameCache[neutralFrameKey]);
//         }
//         return;
//       }

//       const currentTime = audio.currentTime * 1000; // Convert to milliseconds
      
//       // Find the appropriate frame for the current time
//       const activeFrameData = frameTransitionData.find(frameData => {
//         return currentTime >= frameData.startTime && 
//                currentTime < frameData.startTime + frameData.duration;
//       });

//       if (activeFrameData && frameCache[activeFrameData.frameKey]) {
//         const newFrame = frameCache[activeFrameData.frameKey];
//         setCurrentFrame(newFrame);
//         console.log(`Setting frame for time ${currentTime}ms: viseme ${activeFrameData.viseme}`);
//       } else {
//         // Fallback to neutral frame
//         const neutralFrameKey = `${SPEAKING_PREFIX}:0.${SPRITE_CONFIG.speaking.fileExtension}`;
//         if (frameCache[neutralFrameKey]) {
//           setCurrentFrame(frameCache[neutralFrameKey]);
//         }
//       }
      
//       animationRef.current = requestAnimationFrame(animate);
//     };

//     console.log('Starting animation loop');
//     animationRef.current = requestAnimationFrame(animate);
    
//     return () => {
//       console.log('Cleaning up animation');
//       isAnimating = false;
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//         animationRef.current = null;
//       }
//     };
//   }, [frameTransitionData, frameCache, SPRITE_CONFIG]);

//   // Build frame transition data when viseme data changes
//   useEffect(() => {
//     if (visemeData.length > 0 && audioRef.current) {
//       console.log('Building frame transitions for visemes:', visemeData.length);
//       const transitions = buildFrameTransitionData(visemeData, audioRef.current.duration);
//       setFrameTransitionData(transitions);
//     }
//   }, [visemeData, buildFrameTransitionData]);

//   // Handle emotion changes and animations
//   useEffect(() => {
//     console.log('Animation effect triggered', { 
//       currentEmotion, 
//       loadingState: loadingStates[currentEmotion],
//       frameDataLength: frameTransitionData.length
//     });
    
//     if (loadingStates[currentEmotion] !== 'loaded') return;

//     // Clean up existing animation
//     if (animationRef.current) {
//       cancelAnimationFrame(animationRef.current);
//       animationRef.current = null;
//     }

//     const cleanup = currentEmotion === 'neutral' 
//       ? animateNaturalMode() 
//       : animateSpeakingMode();

//     return cleanup;
//   }, [currentEmotion, loadingStates, animateNaturalMode, animateSpeakingMode, frameTransitionData]);

//   const stopOngoingProcesses = useCallback(() => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current = null;
//       setIsAvatarSpeaking(false);
//     }
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//       recognitionRef.current = null;
//     }
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//       timeoutRef.current = null;
//     }
//     if (animationRef.current) {
//       cancelAnimationFrame(animationRef.current);
//       animationRef.current = null;
//     }
//     setIsListening(false);
//     setChatloading(false);
//     setVisemeData([]);
//     setFrameTransitionData([]);
//     setCurrentEmotion('neutral');
//     currentVisemeIndex.current = 0;
//   }, [setChatloading, setIsAvatarSpeaking]);

//   const playAIAudio = useCallback(async (audioUrl: string, text: string, visemes: VisemeData[]) => {
//     console.log('Playing AI audio', { audioUrl, text, visemesLength: visemes.length });
//     stopOngoingProcesses();
    
//     if (isMuted) {
//       setIsAvatarSpeaking(true);
//       setTimeout(() => setIsAvatarSpeaking(false), 3000);
//       return;
//     }

//     try {
//       const audio = new Audio();
//       audioRef.current = audio;
//       audio.src = audioUrl;
//       audio.preload = "auto";

//       // Wait for metadata to load
//       await new Promise((resolve, reject) => {
//         audio.addEventListener('loadedmetadata', resolve, { once: true });
//         audio.addEventListener('error', reject, { once: true });
//         audio.load();
//       });
      
//       console.log('Audio metadata loaded, duration:', audio.duration);
      
//       // Set visemes and build transitions
//       setVisemeData(visemes);
//       const transitions = buildFrameTransitionData(visemes, audio.duration);
//       setFrameTransitionData(transitions);
      
//       // Set speaking mode BEFORE playing
//       setCurrentEmotion('speaking');

//       const handlePlay = () => {
//         console.log('Audio started playing');
//         setIsAvatarSpeaking(true);
//       };

//       const handleEnded = () => {
//         console.log('Audio playback ended');
//         setIsAvatarSpeaking(false);
//         setCurrentEmotion('neutral');
//         setChatloading(false);
//         setVisemeData([]);
//         setFrameTransitionData([]);
//       };

//       const handleError = (event: Event) => {
//         console.error("Audio playback error:", event);
//         toast({
//           title: "Audio Playback Error",
//           description: "Failed to play the AI response audio. Please try again.",
//           variant: "destructive",
//         });
//         setIsAvatarSpeaking(false);
//         setCurrentEmotion('neutral');
//         setChatloading(false);
//       };

//       // Add event listeners
//       audio.addEventListener('play', handlePlay);
//       audio.addEventListener('ended', handleEnded);
//       audio.addEventListener('error', handleError);

//       // Start playback
//       await audio.play();

//       // Cleanup function
//       return () => {
//         audio.removeEventListener('play', handlePlay);
//         audio.removeEventListener('ended', handleEnded);
//         audio.removeEventListener('error', handleError);
//       };
//     } catch (error) {
//       console.error("Error playing audio:", error);
//       toast({
//         title: "Audio Playback Error",
//         description: "Failed to play the AI response audio. Please try again.",
//         variant: "destructive",
//       });
//       setIsAvatarSpeaking(false);
//       setCurrentEmotion('neutral');
//       setChatloading(false);
//     }
//   }, [stopOngoingProcesses, toast, isMuted, setChatloading, setIsAvatarSpeaking, buildFrameTransitionData]);

//   useEffect(() => {
//     const handlePlayAIAudio = (event: CustomEvent) => {
//       const { text, audioUrl, visemeData } = event.detail;
//       if (text && audioUrl && visemeData) {
//         addChatMessage({
//           sender: 'avatar',
//           text: text.trim(),
//         });
//         playAIAudio(audioUrl, text, visemeData);
//       }
//     };

//     window.addEventListener("play-ai-audio", handlePlayAIAudio as EventListener);
//     return () => {
//       window.removeEventListener("play-ai-audio", handlePlayAIAudio as EventListener);
//     };
//   }, [addChatMessage, playAIAudio]);

//   const handleMicClick = useCallback(() => {
//     stopOngoingProcesses();
//     setIsListening((prev) => !prev);

//     if (!isListening) {
//       toggleChat(true);
//       if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         const recognition = new SpeechRecognition();
//         recognitionRef.current = recognition;

//         recognition.lang = 'en-US';
//         recognition.interimResults = false;
//         recognition.maxAlternatives = 1;

//         recognition.onstart = () => {
//           timeoutRef.current = setTimeout(() => {
//             recognition.stop();
//             toast({
//               title: "No Speech Detected",
//               description: "Speech recognition stopped due to inactivity. Please try again.",
//             });
//           }, 5000);
//         };

//         recognition.onresult = async (event: SpeechRecognitionEvent) => {
//           const speechResult = event.results[0][0].transcript;
        
//           if (timeoutRef.current) {
//             clearTimeout(timeoutRef.current);
//             timeoutRef.current = null;
//           }

//           addChatMessage({
//             sender: 'user',
//             text: speechResult.trim(),
//           });

//           try {
//             setChatloading(true);
//             const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/v1/process-query`, {
//               query: speechResult,
//             });
//             console.log("Response from process-query endpoint on animated avatar:", response.data);
//             const { aiResponse, audioData, visemeData } = response.data;
//             if (!aiResponse || !audioData.audioUrl || !visemeData) {
//               throw new Error("Invalid response format from process-query endpoint");
//             }

//             addChatMessage({
//               sender: 'avatar',
//               text: aiResponse.trim(),
//             });
//             playAIAudio(audioData.audioUrl, aiResponse, visemeData);

//             const speechEvent = new CustomEvent("speech-to-text", {
//               detail: { text: speechResult },
//             });
//             window.dispatchEvent(speechEvent);
//           } catch (error) {
//             console.error("Error sending speech to process-query endpoint:", error);
//             let errorMessage = "Unable to get response from AI. Please try again.";
//             if (axios.isAxiosError(error)) {
//               if (error.response) {
//                 errorMessage = `Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`;
//               } else if (error.request) {
//                 errorMessage = "Network error: Could not reach the server.";
//               }
//             }
//             toast({
//               title: "Request Failed",
//               description: errorMessage,
//               variant: "destructive",
//             });
//             setChatloading(false);
//           }
//         };

//         recognition.onend = () => {
//           setIsListening(false);
//           recognitionRef.current = null;
//           if (timeoutRef.current) {
//             clearTimeout(timeoutRef.current);
//             timeoutRef.current = null;
//           }
//         };

//         recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
//           console.error('Speech recognition error:', event.error);
//           setIsListening(false);
//           recognitionRef.current = null;
//           if (timeoutRef.current) {
//             clearTimeout(timeoutRef.current);
//             timeoutRef.current = null;
//           }
//           if (event.error === 'no-speech') {
//             toast({
//               title: "No Speech Detected",
//               description: "Please speak to continue or try again.",
//             });
//           } else if (event.error === 'not-allowed') {
//             toast({
//               title: "Microphone Access Denied",
//               description: "Please grant microphone permission to use speech recognition.",
//               variant: "destructive",
//             });
//           }
//         };

//         try {
//           recognition.start();
//         } catch (error) {
//           console.error('Failed to start speech recognition:', error);
//           setIsListening(false);
//           recognitionRef.current = null;
//           toast({
//             title: "Speech Recognition Error",
//             description: "Failed to start speech recognition. Please try again.",
//             variant: "destructive",
//           });
//         }
//       } else {
//         console.warn('Speech recognition not supported in this browser.');
//         setIsListening(false);
//         toast({
//           title: "Speech Recognition Not Supported",
//           description: "Your browser does not support speech recognition.",
//           variant: "destructive",
//         });
//       }
//     }
//   }, [isListening, toggleChat, toast, addChatMessage, setChatloading, playAIAudio]);

//   const toggleStop = useCallback(() => {
//     stopOngoingProcesses();
//   }, [stopOngoingProcesses]);

//   const toggleMinimize = useCallback(() => {
//     setHasUserToggled(true);
//     setIsMinimized((prev) => !prev);
//   }, []);

//   const isLoading = loadingStates[currentEmotion] === 'loading';
//   const isLoaded = loadingStates[currentEmotion] === 'loaded';
//   const hasError = loadingStates[currentEmotion] === 'error' || error;

//   if (isImageLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-lg">Loading avatar images...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative h-screen w-full">
//       <AnimatePresence>
//         {isMinimized && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="absolute inset-0 flex items-center justify-center"
//             style={{
//               backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none',
//               backgroundSize: 'cover',
//               backgroundPosition: 'center',
//               backgroundColor: backgroundImageUrl ? 'transparent' : '#f5f5f5',
//             }}
//           >
//             {!backgroundImageUrl && (
//               <div className="w-full h-full flex items-center justify-center">
//                 <div className="text-center">
//                   <h2 className="text-2xl font-bold">Course Content</h2>
//                   <p className="text-gray-500">Visual materials will appear here</p>
//                 </div>
//               </div>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <motion.div
//         layout
//         className={`${isMinimized
//           ? 'absolute bottom-4 right-4 h-32 w-32 rounded-full overflow-hidden shadow-lg border-2 border-blue-500 z-50'
//           : 'absolute inset-0 overflow-hidden bg-gray-100'}`}
//       >
//         <div className="h-full w-full relative flex flex-col">
//           {/* Image for Avatar */}
//           <div className="flex-grow relative">
//             {isLoaded && currentFrame && (
//               <img
//                 src={currentFrame}
//                 alt={altText}
//                 className="h-full w-full object-cover"
//                 onError={(e) => {
//                   // Fallback to first frame if current frame fails to load
//                   const fallbackFrame = currentEmotion === 'neutral' 
//                     ? `${NATURAL_PREFIX}:1.${SPRITE_CONFIG.neutral.fileExtension}`
//                     : `${SPEAKING_PREFIX}:0.${SPRITE_CONFIG.speaking.fileExtension}`;
//                   if (frameCache[fallbackFrame]) {
//                     setCurrentFrame(frameCache[fallbackFrame]);
//                   }
//                 }}
//               />
//             )}
//             {(isLoading || hasError) && (
//               <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-black">
//                 {isLoading && (
//                   <div className="text-center">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
//                     <div>Loading {currentEmotion} frames...</div>
//                   </div>
//                 )}
//                 {hasError && (
//                   <div className="text-center text-red-600">
//                     <div>Unable to load avatar</div>
//                     <button 
//                       onClick={() => {
//                         setLoadingStates(prev => ({ ...prev, [currentEmotion]: 'idle' }));
//                         setError(null);
//                       }}
//                       className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                     >
//                       Retry
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//             {!isMinimized && currentTopic?.title && (
//               <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/50 to-transparent">
//                 <h2 className="text-white text-3xl font-bold">{currentTopic.title}</h2>
//               </div>
//             )}
//           </div>
//         </div>
//       </motion.div>

//       {/* Control buttons */}
//       <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
//         <button
//           onClick={handleMicClick}
//           className={`rounded-full h-16 w-16 flex items-center justify-center transition-all ${isListening
//             ? 'bg-red-500 hover:bg-red-600 text-white border-red-400 animate-pulse'
//             : 'bg-white/80 hover:bg-white border-gray-200 shadow-md'}`}
//           aria-label={isListening ? "Stop listening" : "Start listening"}
//         >
//           {isListening ? <MicOff size={24} /> : <Mic size={24} />}
//         </button>
        
//         <button
//           onClick={toggleStop}
//           className="rounded-full h-16 w-16 flex items-center justify-center transition-all bg-white/80 hover:bg-white border-gray-200 shadow-md"
//         >
//           <Hand size={24} />
//         </button>
//       </div>

//       <button
//         onClick={toggleMinimize}
//         className="absolute top-4 right-4 z-50 bg-white/80 hover:bg-white shadow-md rounded p-2"
//         aria-label={isMinimized ? "Maximize avatar" : "Minimize avatar"}
//       >
//         {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//       </button>

//       {/* Debug info - remove in production */}
//       {process.env.NODE_ENV === 'development' && (
//         <div className="absolute top-4 left-4 bg-black/70 text-white p-2 rounded text-xs">
//           <div>Emotion: {currentEmotion}</div>
//           <div>Speaking: {isAvatarSpeaking ? 'Yes' : 'No'}</div>
//           <div>Frames loaded: {Object.keys(frameCache).length}</div>
//           <div>Visemes: {visemeData.length}</div>
//           <div>Transitions: {frameTransitionData.length}</div>
//         </div>
//       )}
//     </div>
//   );
// });

// AnimatedAvatar.displayName = 'AnimatedAvatar';

// export default AnimatedAvatar;
import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Hand, Mic, MicOff } from 'lucide-react';
import { useCourse } from '@/contexts/CourseContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import axios from "axios";

const DB_NAME = 'AvatarImagesDB';
const STORE_NAME = 'frames';
const NATURAL_PREFIX = 'natural';
const SPEAKING_PREFIX = 'speaking';

interface VisemeData {
  viseme: number;
  timestamp: number;
}

interface AnimatedAvatarProps {
  isReading?: boolean;
  altText?: string;
  backgroundImageUrl?: string;
  currentTopic?: any;
  isImageLoading?: boolean;
  onImageLoad?: () => void;
}

const pendingRequests = new Map<string, Promise<string | null>>();
const globalImageCache = new Map<string, HTMLImageElement>();

const AnimatedAvatar: React.FC<AnimatedAvatarProps> = memo(({ 
  isReading, 
  altText = "Course avatar", 
  backgroundImageUrl, 
  currentTopic ,
  isImageLoading,
  onImageLoad,
}) => {
  // UI State
  const [isMinimized, setIsMinimized] = useState<boolean>(!!backgroundImageUrl);
  const [hasUserToggled, setHasUserToggled] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>("neutral");
  const [loadingStates, setLoadingStates] = useState<Record<string, 'idle' | 'loading' | 'loaded' | 'error'>>({
    neutral: 'idle',
    speaking: 'idle',
  });
  const [frameCache, setFrameCache] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [visemeData, setVisemeData] = useState<VisemeData[]>([]);
  const [frameTransitionData, setFrameTransitionData] = useState<any[]>([]);
  const [currentFrame, setCurrentFrame] = useState<string | null>(null);
  
  // Context and hooks
  const { 
    toggleChat, 
    addChatMessage, 
    setChatloading, 
    isAvatarSpeaking, 
    setIsAvatarSpeaking, 
    course,
    chatMessages 
  } = useCourse();
  const { toast } = useToast();
  
  // Refs
  const isMounted = useRef(true);
  const dbRef = useRef<IDBDatabase | null>(null);
  const animationRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadingPromiseRef = useRef<Promise<void> | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentVisemeIndex = useRef<number>(0);

  const courseId = useMemo(() => course?.id, [course?.id]);
  const courseAvatarId: string = course?.courseAvatar?.avatarAzureResourcesId;
  //need to set azureUrl from corseAvatar Id
  const azureUrl = 'https://workcultur.blob.core.windows.net/avatars/avatar-3';
  // const naturalFrame = course?.courseAvatar?.naturalFrame || 80;
  const naturalFrame = 192
  // const naturalFps = course?.courseAvatar?.naturalFPS || 10;
   const naturalFps = 30;
  const speakingFrame = course?.courseAvatar?.speakingFrame || 21;

  const SPRITE_CONFIG = useMemo(() => ({
    neutral: { 
      baseUrl: `${azureUrl}/natural/`, 
      frames: naturalFrame, 
      fps: naturalFps,
      fileExtension: 'jpg'
    },
    speaking: { 
      baseUrl: `${azureUrl}/speaking/`, 
      frames: 22, 
      fps: 1,
      fileExtension: 'jpg'
    },
  }), [azureUrl, naturalFrame, naturalFps, speakingFrame, courseAvatarId]);

  // Initialize IndexedDB
  const initDB = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (dbRef.current) {
        resolve();
        return;
      }

      const request = indexedDB.open(DB_NAME, 1);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      
      request.onsuccess = () => {
        dbRef.current = request.result;
        resolve();
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }, []);

  const storeImage = useCallback(async (key: string, blob: Blob) => {
    return new Promise<void>((resolve, reject) => {
      if (!dbRef.current) {
        reject(new Error('Database not initialized'));
        return;
      }

      const tx = dbRef.current.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(blob, key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }, []);

  const getImage = useCallback(async (key: string): Promise<Blob | null> => {
    return new Promise((resolve, reject) => {
      if (!dbRef.current) {
        resolve(null);
        return;
      }

      const tx = dbRef.current.transaction([STORE_NAME], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result as Blob | null);
      request.onerror = () => reject(request.error);
    });
  }, []);

  const fetchImage = useCallback(async (url: string, retries = 1): Promise<Blob> => {
    console.log(`Fetching image from azure URL: ${url}`);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.blob();
    } catch (err) {
      throw err;
    }
  }, []);

  const fetchNaturalImages = useCallback(async (): Promise<string[]> => {
    console.log("Fetching natural images...");
    if (!azureUrl) return [];
    
    const stored: string[] = [];
    const { baseUrl, frames, fileExtension } = SPRITE_CONFIG.neutral;

    for (let i = 0; i <= frames; i++) {
      console.log(`Fetching natural image ${i}--->`);
      const imageName = `${i}.${fileExtension}`;
      const imageUrl = `${baseUrl}${imageName}`;
      const storageKey = `${NATURAL_PREFIX}:${imageName}`;

      try {
        if (frameCache[storageKey]) {
          stored.push(storageKey);
          continue;
        }

        let blob = await getImage(storageKey);
        
        if (!blob) {
          console.log(`Fetching image from URL ---> : ${imageUrl}`);
          blob = await fetchImage(imageUrl);
          await storeImage(storageKey, blob);
        }

        const blobUrl = URL.createObjectURL(blob);
        setFrameCache(prev => ({ ...prev, [storageKey]: blobUrl }));
        stored.push(storageKey);

        const img = new Image();
        img.src = blobUrl;
        globalImageCache.set(storageKey, img);
      } catch (err) {
        console.error(`Error processing natural frame ${i}:`, err);
      }
    }
    return stored;
  }, [azureUrl, SPRITE_CONFIG, frameCache, getImage, storeImage]);

  const fetchSpeakingImages = useCallback(async (): Promise<string[]> => {
    if (!azureUrl) return [];
    
    const stored: string[] = [];
    const { baseUrl, frames, fileExtension } = SPRITE_CONFIG.speaking;
    
    console.log('Loading speaking frames...');

    // First load the basic viseme frames (0 to frames-1)
    for (let i = 0; i < frames; i++) {
      const imageName = `${i}.${fileExtension}`;
      const imageUrl = `${baseUrl}${imageName}`;
      const storageKey = `${SPEAKING_PREFIX}:${imageName}`;

      try {
        if (frameCache[storageKey]) {
          console.log(`Frame already in cache: ${storageKey}`);
          stored.push(storageKey);
          continue;
        }

        console.log(`Loading speaking image: ${imageUrl}`);
        let blob = await getImage(storageKey);
        
        if (!blob) {
          blob = await fetchImage(imageUrl);
          await storeImage(storageKey, blob);
        }

        const blobUrl = URL.createObjectURL(blob);
        setFrameCache(prev => ({ ...prev, [storageKey]: blobUrl }));
        stored.push(storageKey);

        const img = new Image();
        img.src = blobUrl;
        globalImageCache.set(storageKey, img);
      } catch (err) {
        console.error(`Error processing viseme ${i}:`, err);
      }
    }

    // Then load transition frames
    for (let i = 0; i < frames; i++) {
      for (let j = 0; j < frames; j++) {
        for (const blend of ['25', '50', '75']) {
          try {
            const imageName = `${i}-${j}_${blend}.${fileExtension}`;
            const imageUrl = `${baseUrl}${imageName}`;
            const storageKey = `${SPEAKING_PREFIX}:${imageName}`;

            // Only fetch if not already cached
            if (!frameCache[storageKey]) {
              let blob = await getImage(storageKey);
              if (!blob) {
                blob = await fetchImage(imageUrl);
                await storeImage(storageKey, blob);
              }
              const blobUrl = URL.createObjectURL(blob);
              setFrameCache(prev => ({ ...prev, [storageKey]: blobUrl }));
              
              // Preload image
              const img = new Image();
              img.src = blobUrl;
              globalImageCache.set(storageKey, img);
            }
            stored.push(storageKey);
          } catch (err) {
            console.error(`Error processing transition ${i}-${j}_${blend}:`, err);
          }
        }
      }
    }

    return stored;
  }, [azureUrl, SPRITE_CONFIG, frameCache, getImage, storeImage]);

  const loadModeFrames = useCallback(async (mode: string) => {
    console.log(`Loading ${mode} frames...`);
    console.log(`Current loading state for ${mode}:`, loadingStates[mode]);
    if (loadingStates[mode] !== 'idle') return;
    console.log(`Setting loading state for ${mode}`);
    setLoadingStates(prev => ({ ...prev, [mode]: 'loading' }));

    try {
      await initDB();
      
      const storedImages = mode === 'neutral' 
        ? await fetchNaturalImages()
        : await fetchSpeakingImages();

      if (storedImages.length > 0) {
        setLoadingStates(prev => ({ ...prev, [mode]: 'loaded' }));
        // Set initial frame
        if (mode === 'neutral') {
          const initialFrameKey = `${NATURAL_PREFIX}:1.${SPRITE_CONFIG.neutral.fileExtension}`;
          if (frameCache[initialFrameKey]) {
            setCurrentFrame(frameCache[initialFrameKey]);
          }
        } else if (mode === 'speaking') {
          const initialFrameKey = `${SPEAKING_PREFIX}:0.${SPRITE_CONFIG.speaking.fileExtension}`;
          if (frameCache[initialFrameKey]) {
            setCurrentFrame(frameCache[initialFrameKey]);
          }
          onImageLoad?.();
        }
      } else {
        throw new Error(`No ${mode} images loaded`);
      }
    } catch (err) {
      console.error(`Error loading ${mode} frames:`, err);
      setLoadingStates(prev => ({ ...prev, [mode]: 'error' }));
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [loadingStates, initDB, fetchNaturalImages, fetchSpeakingImages, frameCache, SPRITE_CONFIG, onImageLoad]);

  // Initialize loading
  useEffect(() => {
    loadModeFrames('neutral');
    const timer = setTimeout(() => {
      loadModeFrames('speaking');
    }, 2000);

    return () => clearTimeout(timer);
  }, [loadModeFrames]);

  const animateNaturalMode = useCallback(() => {
    const { fps, frames } = SPRITE_CONFIG.neutral;
    let lastFrameTime = Date.now();
    let currentFrameIndex = 1; // Start from frame 1

    const animate = () => {
      if (currentEmotion !== 'neutral') return;

      const now = Date.now();
      const delta = now - lastFrameTime;

      if (delta > 1000 / fps) {
        currentFrameIndex = (currentFrameIndex % frames) + 1; // Loop through frames 1 to frames
        
        const frameKey = `${NATURAL_PREFIX}:${currentFrameIndex}.${SPRITE_CONFIG.neutral.fileExtension}`;
        if (frameCache[frameKey]) {
          setCurrentFrame(frameCache[frameKey]);
        }
        
        lastFrameTime = now - (delta % (1000 / fps));
      }

      animationRef.current = window.requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentEmotion, SPRITE_CONFIG, frameCache]);

  const checkFrameExists = useCallback((frameKey: string): boolean => {
    return frameCache[frameKey] !== undefined;
  }, [frameCache]);

  const buildFrameTransitionData = useCallback((visemes: VisemeData[], audioDuration?: number) => {
    if (visemes.length === 0) return [];
    
    const frames: any[] = [];
    
    // Add initial silence frame if needed
    if (visemes[0].timestamp > 0) {
      const silentFrameKey = `${SPEAKING_PREFIX}:0.${SPRITE_CONFIG.speaking.fileExtension}`;
      frames.push({
        frameKey: silentFrameKey,
        startTime: 0,
        duration: visemes[0].timestamp,
        viseme: 0
      });
    }
    
    for (let i = 0; i < visemes.length; i++) {
      const currentViseme = visemes[i].viseme;
      const timestamp = visemes[i].timestamp;
      const nextTimestamp = i < visemes.length - 1 
        ? visemes[i + 1].timestamp 
        : (audioDuration || 0) * 1000;
      
      const duration = nextTimestamp - timestamp;
      
      // Ensure the viseme frame exists
      const visemeFrameKey = `${SPEAKING_PREFIX}:${currentViseme}.${SPRITE_CONFIG.speaking.fileExtension}`;
      const fallbackFrameKey = `${SPEAKING_PREFIX}:0.${SPRITE_CONFIG.speaking.fileExtension}`;
      
      const frameToUse = checkFrameExists(visemeFrameKey) ? visemeFrameKey : fallbackFrameKey;
      
      frames.push({
        frameKey: frameToUse,
        startTime: timestamp,
        duration: duration,
        viseme: currentViseme,
        isFallback: !checkFrameExists(visemeFrameKey)
      });
    }
    
    return frames;
  }, [SPRITE_CONFIG, checkFrameExists]);

  const animateSpeakingMode = useCallback(() => {
    if (!audioRef.current || frameTransitionData.length === 0) {
      return;
    }

    const audio = audioRef.current;
    let isAnimating = true;

    const animate = () => {
      if (!isAnimating || audio.paused || audio.ended) {
        // Set to neutral frame when stopping
        const neutralFrameKey = `${SPEAKING_PREFIX}:0.${SPRITE_CONFIG.speaking.fileExtension}`;
        if (frameCache[neutralFrameKey]) {
          setCurrentFrame(frameCache[neutralFrameKey]);
        }
        return;
      }

      const currentTime = audio.currentTime * 1000; // Convert to milliseconds
      
      // Find the appropriate frame for the current time
      const activeFrameData = frameTransitionData.find(frameData => {
        return currentTime >= frameData.startTime && 
               currentTime < frameData.startTime + frameData.duration;
      });

      if (activeFrameData && frameCache[activeFrameData.frameKey]) {
        const newFrame = frameCache[activeFrameData.frameKey];
        setCurrentFrame(newFrame);
      } else {
        // Fallback to neutral frame
        const neutralFrameKey = `${SPEAKING_PREFIX}:0.${SPRITE_CONFIG.speaking.fileExtension}`;
        if (frameCache[neutralFrameKey]) {
          setCurrentFrame(frameCache[neutralFrameKey]);
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      isAnimating = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [frameTransitionData, frameCache, SPRITE_CONFIG]);

  // Build frame transition data when viseme data changes
  useEffect(() => {
    if (visemeData.length > 0 && audioRef.current) {
      console.log('Building frame transitions for visemes:', visemeData.length);
      const transitions = buildFrameTransitionData(visemeData, audioRef.current.duration);
      setFrameTransitionData(transitions);
    }
  }, [visemeData, buildFrameTransitionData]);

  // Handle emotion changes and animations
  useEffect(() => {
    console.log('Animation effect triggered', { 
      currentEmotion, 
      loadingState: loadingStates[currentEmotion],
      frameDataLength: frameTransitionData.length
    });
    
    if (loadingStates[currentEmotion] !== 'loaded') return;

    // Clean up existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    const cleanup = currentEmotion === 'neutral' 
      ? animateNaturalMode() 
      : animateSpeakingMode();

    return cleanup;
  }, [currentEmotion, loadingStates, animateNaturalMode, animateSpeakingMode, frameTransitionData]);

  const stopOngoingProcesses = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsAvatarSpeaking(false);
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsListening(false);
    setChatloading(false);
    setVisemeData([]);
    setFrameTransitionData([]);
    setCurrentEmotion('neutral');
    currentVisemeIndex.current = 0;
  }, [setChatloading, setIsAvatarSpeaking]);

  const playAIAudio = useCallback(async (audioUrl: string, text: string, visemes: VisemeData[]) => {
    console.log('Playing AI audio', { audioUrl, text, visemesLength: visemes.length });
    stopOngoingProcesses();
    
    if (isMuted) {
      setIsAvatarSpeaking(true);
      setTimeout(() => setIsAvatarSpeaking(false), 3000);
      return;
    }

    try {
      const audio = new Audio();
      audioRef.current = audio;
      audio.src = audioUrl;
      audio.preload = "auto";

      // Wait for metadata to load
      await new Promise((resolve, reject) => {
        audio.addEventListener('loadedmetadata', resolve, { once: true });
        audio.addEventListener('error', reject, { once: true });
        audio.load();
      });
      
      console.log('Audio metadata loaded, duration:', audio.duration);
      
      // Set visemes and build transitions
      setVisemeData(visemes);
      const transitions = buildFrameTransitionData(visemes, audio.duration);
      setFrameTransitionData(transitions);
      
      // Set speaking mode BEFORE playing
      setCurrentEmotion('speaking');

      const handlePlay = () => {
        console.log('Audio started playing');
        setIsAvatarSpeaking(true);
      };

      const handleEnded = () => {
        console.log('Audio playback ended');
        setIsAvatarSpeaking(false);
        setCurrentEmotion('neutral');
        setChatloading(false);
        setVisemeData([]);
        setFrameTransitionData([]);
      };

      const handleError = (event: Event) => {
        console.error("Audio playback error:", event);
        toast({
          title: "Audio Playback Error",
          description: "Failed to play the AI response audio. Please try again.",
          variant: "destructive",
        });
        setIsAvatarSpeaking(false);
        setCurrentEmotion('neutral');
        setChatloading(false);
      };

      // Add event listeners
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      // Start playback
      await audio.play();

      // Cleanup function
      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };
    } catch (error) {
      console.error("Error playing audio:", error);
      toast({
        title: "Audio Playback Error",
        description: "Failed to play the AI response audio. Please try again.",
        variant: "destructive",
      });
      setIsAvatarSpeaking(false);
      setCurrentEmotion('neutral');
      setChatloading(false);
    }
  }, [stopOngoingProcesses, toast, isMuted, setChatloading, setIsAvatarSpeaking, buildFrameTransitionData]);

  useEffect(() => {
    const handlePlayAIAudio = (event: CustomEvent) => {
      const { text, audioUrl, visemeData } = event.detail;
      if (text && audioUrl && visemeData) {
        addChatMessage({
          sender: 'avatar',
          text: text.trim(),
        });
        playAIAudio(audioUrl, text, visemeData);
      }
    };

    window.addEventListener("play-ai-audio", handlePlayAIAudio as EventListener);
    return () => {
      window.removeEventListener("play-ai-audio", handlePlayAIAudio as EventListener);
    };
  }, [addChatMessage, playAIAudio]);

  const handleMicClick = useCallback(() => {
    stopOngoingProcesses();
    setIsListening((prev) => !prev);

    if (!isListening) {
      toggleChat(true);
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          timeoutRef.current = setTimeout(() => {
            recognition.stop();
            toast({
              title: "No Speech Detected",
              description: "Speech recognition stopped due to inactivity. Please try again.",
            });
          }, 5000);
        };

        recognition.onresult = async (event: SpeechRecognitionEvent) => {
          const speechResult = event.results[0][0].transcript;
        
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }

          addChatMessage({
            sender: 'user',
            text: speechResult.trim(),
          });

          try {
            setChatloading(true);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/v1/process-query`, {
              query: speechResult,
            });
            console.log("Response from process-query endpoint on animated avatar:", response.data);
            const { aiResponse, audioData, visemeData } = response.data;
            if (!aiResponse || !audioData.audioUrl || !visemeData) {
              throw new Error("Invalid response format from process-query endpoint");
            }

            addChatMessage({
              sender: 'avatar',
              text: aiResponse.trim(),
            });
            playAIAudio(audioData.audioUrl, aiResponse, visemeData);

            const speechEvent = new CustomEvent("speech-to-text", {
              detail: { text: speechResult },
            });
            window.dispatchEvent(speechEvent);
          } catch (error) {
            console.error("Error sending speech to process-query endpoint:", error);
            let errorMessage = "Unable to get response from AI. Please try again.";
            if (axios.isAxiosError(error)) {
              if (error.response) {
                errorMessage = `Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`;
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

        recognition.onend = () => {
          setIsListening(false);
          recognitionRef.current = null;
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          recognitionRef.current = null;
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          if (event.error === 'no-speech') {
            toast({
              title: "No Speech Detected",
              description: "Please speak to continue or try again.",
            });
          } else if (event.error === 'not-allowed') {
            toast({
              title: "Microphone Access Denied",
              description: "Please grant microphone permission to use speech recognition.",
              variant: "destructive",
            });
          }
        };

        try {
          recognition.start();
        } catch (error) {
          console.error('Failed to start speech recognition:', error);
          setIsListening(false);
          recognitionRef.current = null;
          toast({
            title: "Speech Recognition Error",
            description: "Failed to start speech recognition. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        console.warn('Speech recognition not supported in this browser.');
        setIsListening(false);
        toast({
          title: "Speech Recognition Not Supported",
          description: "Your browser does not support speech recognition.",
          variant: "destructive",
        });
      }
    }
  }, [isListening, toggleChat, toast, addChatMessage, setChatloading, playAIAudio]);

  const toggleStop = useCallback(() => {
    stopOngoingProcesses();
  }, [stopOngoingProcesses]);

  const toggleMinimize = useCallback(() => {
    setHasUserToggled(true);
    setIsMinimized((prev) => !prev);
  }, []);

  const isLoading = loadingStates[currentEmotion] === 'loading';
  const isLoaded = loadingStates[currentEmotion] === 'loaded';
  const hasError = loadingStates[currentEmotion] === 'error' || error;

  if (isImageLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading avatar images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      <AnimatePresence>
        {isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: backgroundImageUrl ? 'transparent' : '#f5f5f5',
            }}
          >
            {!backgroundImageUrl && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold">Course Content</h2>
                  <p className="text-gray-500">Visual materials will appear here</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        className={`${isMinimized
          ? 'absolute bottom-4 right-4 h-32 w-32 rounded-full overflow-hidden shadow-lg border-2 border-blue-500 z-50'
          : 'absolute inset-0 overflow-hidden bg-gray-100'}`}
      >
        <div className="h-full w-full relative flex flex-col">
          {/* Image for Avatar */}
          <div className="flex-grow relative">
            {isLoaded && currentFrame && (
              <img
                src={currentFrame}
                alt={altText}
                className="h-full w-full object-cover"
                onError={(e) => {
                  // Fallback to first frame if current frame fails to load
                  const fallbackFrame = currentEmotion === 'neutral' 
                    ? `${NATURAL_PREFIX}:1.${SPRITE_CONFIG.neutral.fileExtension}`
                    : `${SPEAKING_PREFIX}:0.${SPRITE_CONFIG.speaking.fileExtension}`;
                  if (frameCache[fallbackFrame]) {
                    setCurrentFrame(frameCache[fallbackFrame]);
                  }
                }}
              />
            )}
            {(isLoading || hasError) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-black">
                {isLoading && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <div>Loading {currentEmotion} frames...</div>
                  </div>
                )}
                {hasError && (
                  <div className="text-center text-red-600">
                    <div>Unable to load avatar</div>
                    <button 
                      onClick={() => {
                        setLoadingStates(prev => ({ ...prev, [currentEmotion]: 'idle' }));
                        setError(null);
                      }}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            )}
            {!isMinimized && currentTopic?.title && (
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/50 to-transparent">
                <h2 className="text-white text-3xl font-bold">{currentTopic.title}</h2>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Control buttons */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
        <button
          onClick={handleMicClick}
          className={`rounded-full h-16 w-16 flex items-center justify-center transition-all ${isListening
            ? 'bg-red-500 hover:bg-red-600 text-white border-red-400 animate-pulse'
            : 'bg-white/80 hover:bg-white border-gray-200 shadow-md'}`}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        
        <button
          onClick={toggleStop}
          className="rounded-full h-16 w-16 flex items-center justify-center transition-all bg-white/80 hover:bg-white border-gray-200 shadow-md"
        >
          <Hand size={24} />
        </button>
      </div>

      <button
        onClick={toggleMinimize}
        className="absolute top-4 right-4 z-50 bg-white/80 hover:bg-white shadow-md rounded p-2"
        aria-label={isMinimized ? "Maximize avatar" : "Minimize avatar"}
      >
        {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>


    </div>
  );
});

AnimatedAvatar.displayName = 'AnimatedAvatar';

export default AnimatedAvatar;