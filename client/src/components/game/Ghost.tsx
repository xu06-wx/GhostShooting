import { useEffect, useState } from "react";
import { GhostData } from "../../lib/stores/useGhostGame";

interface GhostProps {
  ghost: GhostData;
  isClosest: boolean;
}

export default function Ghost({ ghost, isClosest }: GhostProps) {
  const [animationOffset, setAnimationOffset] = useState(0);

  // Add floating animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationOffset(prev => prev + 0.1);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const floatY = Math.sin(animationOffset + ghost.id) * 5;

  return (
    <div style={{
      width: '50px',
      height: '60px',
      position: 'relative',
      transform: `translateY(${floatY}px)`,
      transition: 'transform 0.05s ease-out'
    }}>
      {/* Ghost body */}
      <div style={{
        width: '50px',
        height: '60px',
        backgroundColor: isClosest ? '#ff6666' : '#ffffff',
        borderRadius: '25px 25px 0 0',
        position: 'relative',
        opacity: 0.9,
        border: isClosest ? '3px solid #ff3333' : '2px solid #cccccc',
        boxShadow: isClosest ? '0 0 20px #ff6666' : '0 0 10px #ffffff'
      }}>
        {/* Eyes */}
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '12px',
          width: '8px',
          height: '8px',
          backgroundColor: '#000000',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '12px',
          width: '8px',
          height: '8px',
          backgroundColor: '#000000',
          borderRadius: '50%'
        }} />

        {/* Mouth */}
        <div style={{
          position: 'absolute',
          top: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '20px',
          height: '8px',
          backgroundColor: '#000000',
          borderRadius: '0 0 10px 10px'
        }} />

        {/* Ghost bottom wavy edge */}
        <div style={{
          position: 'absolute',
          bottom: '-2px',
          left: 0,
          right: 0,
          height: '10px',
          backgroundImage: `linear-gradient(45deg, ${isClosest ? '#ff6666' : '#ffffff'} 25%, transparent 25%), 
                           linear-gradient(-45deg, ${isClosest ? '#ff6666' : '#ffffff'} 25%, transparent 25%), 
                           linear-gradient(45deg, transparent 75%, ${isClosest ? '#ff6666' : '#ffffff'} 75%), 
                           linear-gradient(-45deg, transparent 75%, ${isClosest ? '#ff6666' : '#ffffff'} 75%)`,
          backgroundSize: '8px 8px',
          backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
        }} />
      </div>
    </div>
  );
}
