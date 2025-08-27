
import { useEffect, useRef, useState } from 'react';

interface AvatarProps {
  imagePath: string;
  isReading: boolean;
  altText?: string;
}

const Avatar = ({ imagePath, isReading, altText = "Course avatar" }: AvatarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  
  // Calculate the height of the container on mount and window resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.offsetHeight);
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-neutral-100"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src={imagePath} 
          alt={altText}
          className={`h-full w-full object-cover ${isReading ? 'animate-subtle-movement' : ''}`}
        />
      </div>
      
      {/* Overlay with course title */}
      {/* <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/50 to-transparent">
        <h2 className="text-white text-3xl font-bold">Introduction to Marketing</h2>
      </div> */}
    </div>
  );
};

export default Avatar;
