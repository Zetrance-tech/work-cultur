
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const TalkingAvatar = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentFrame, setCurrentFrame] = useState('/visemes/0.jpg');
  const audioRef = useRef(null);
  const animationFrameRef = useRef(null);


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);
    setCurrentFrame('/visemes/0.jpg');

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/process-query`, { query });
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process query');
      setIsLoading(false);
    }
  };

  // Check if a frame exists (synchronous check via preloaded images or assumption)
  const checkFrameExists = (frame) => {
    // Since we're in the browser, assume frames are preloaded in /visemes/
    // Alternatively, you can pre-check frames during development
    return true; // Assume exists; browser will handle 404 with onerror
  };

  // Handle viseme animation
  useEffect(() => {
    if (!response || !response.visemeData || !response.audioData?.audioUrl) {
      return;
    }

    const visemeData = response.visemeData;
    const audio = audioRef.current;

    // Reset audio
    audio.src = response.audioData.audioUrl;
    console.log('Audio source set:', audio.src);
    audio.currentTime = 0;
    audio.load(); // Preload audio to minimize delay

    // Create frames with durations (55% main, 45% transitions)
    const framesWithDurations = [];
    for (let i = 0; i < visemeData.length; i++) {
      const currentViseme = visemeData[i].viseme;
      const timestamp = visemeData[i].timestamp;
      const nextTimestamp = i < visemeData.length - 1 ? visemeData[i + 1].timestamp : response.audioData.duration;
      const duration = nextTimestamp - timestamp;

      if (duration <= 0) {
        console.warn(`Skipping zero/negative duration for viseme ${currentViseme} at timestamp ${timestamp}`);
        continue;
      }

      let frameName = `${currentViseme}.jpg`;
      const framePath = checkFrameExists(frameName) ? `/visemes/${frameName}` : '/visemes/0.jpg';
      framesWithDurations.push({ frame: framePath, duration, startTime: timestamp });

      // Add transition frames if available
      if (i < visemeData.length - 1) {
        const nextViseme = visemeData[i + 1].viseme;
        if (currentViseme !== nextViseme) {
          const transitionFrames = ['25', '50', '75'];
          const mainFrameDuration = duration * 0.55;
          const transitionTotalDuration = duration * 0.45;
          const singleTransitionDuration = transitionTotalDuration / transitionFrames.length;

          // Update main frame duration
          framesWithDurations[framesWithDurations.length - 1].duration = mainFrameDuration;

          // Add transition frames
          transitionFrames.forEach((blend) => {
            const transitionFrame = `/visemes/${currentViseme}-${nextViseme}_${blend}.jpg`;
            if (checkFrameExists(transitionFrame)) {
              framesWithDurations.push({
                frame: transitionFrame,
                duration: singleTransitionDuration,
                startTime: timestamp + mainFrameDuration + (transitionFrames.indexOf(blend) * singleTransitionDuration)
              });
            } else {
              console.warn(`Transition frame ${transitionFrame} not found, skipping`);
            }
          });
        }
      }
    }

    console.log('Frames with durations:', framesWithDurations);

    // Animation loop synchronized with audio.currentTime
    const animate = () => {
      if (audio.paused || audio.ended) {
        setCurrentFrame('/visemes/0.jpg');
        cancelAnimationFrame(animationFrameRef.current);
        console.log('Animation stopped: audio paused or ended');
        return;
      }

      const currentAudioTime = audio.currentTime * 1000; // Convert to milliseconds
      let activeFrame = '/visemes/0.jpg';

      for (const frameData of framesWithDurations) {
        if (
          currentAudioTime >= frameData.startTime &&
          currentAudioTime < frameData.startTime + frameData.duration
        ) {
          activeFrame = frameData.frame;
          break;
        }
      }

      setCurrentFrame(activeFrame);
      // console.log(`Audio Time: ${currentAudioTime.toFixed(2)}ms, Frame: ${activeFrame}`);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation when audio plays
    const handlePlay = () => {
      console.log('Audio started playing');
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Handle audio loaded
    const handleLoaded = () => {
      console.log('Audio loaded, attempting to play');
      audio.play().catch((err) => {
        setError('Failed to play audio: ' + err.message);
        console.error('Audio play error:', err);
      });
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('loadeddata', handleLoaded);

    // Start audio playback
    audio.load();
    setIsLoading(false);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('loadeddata', handleLoaded);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [response]);

  return (
    <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Talking Avatar</h1>
      
      <div className="mb-4">
        <img
          src={currentFrame}
          alt="Avatar"
          className="w-64 h-64 mx-auto object-cover rounded"
          onError={() => {
            console.warn(`Frame ${currentFrame} not found, falling back to /visemes/0.jpg`);
            setCurrentFrame('/visemes/0.jpg');
          }}
        />
      </div>

      <audio ref={audioRef} className="hidden" />

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question..."
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Processing...' : 'Ask'}
        </button>
      </form>

      {response && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Response:</h2>
          <p className="text-gray-700">{response.aiResponse}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-500">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default TalkingAvatar;