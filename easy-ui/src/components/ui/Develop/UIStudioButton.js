import React, { useState, useEffect, useRef } from "react";
import "./UIStudioButton.css";

export default function UIStudioButton({ onClick, isMobile }) {
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);
  const [isExploding, setIsExploding] = useState(false);
  const [isDissolving, setIsDissolving] = useState(false);
  const [isDisappeared, setIsDisappeared] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(1); // Control shake intensity
  
  // Increase shake intensity over time when idle
  useEffect(() => {
    if (!isHovered && !isActive && !isDissolving && !isDisappeared) {
      const intensityInterval = setInterval(() => {
        setShakeIntensity(prev => {
          // Cycle between 1-3 intensity to create attention-grabbing pattern
          return (prev >= 3) ? 1 : prev + 0.5;
        });
      }, 3000);
      
      return () => clearInterval(intensityInterval);
    } else {
      setShakeIntensity(1);
    }
  }, [isHovered, isActive, isDissolving, isDisappeared]);
  
  // Track mouse position for pixel effect
  const handleMouseMove = (e) => {
    if (!buttonRef.current || isDissolving || isDisappeared) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  // Handle hover with explosion effect
  const handleMouseEnter = () => {
    if (!isDissolving && !isDisappeared) {
      setIsHovered(true);
      setIsExploding(true);
      
      // Reset explosion effect after animation
      setTimeout(() => {
        setIsExploding(false);
      }, 700);
    }
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    if (!isDissolving && !isDisappeared) {
      setIsHovered(false);
    }
  };

  // Handle click with animation state and dissolution
  const handleClick = () => {
    if (!isDissolving && !isDisappeared) {
      setIsActive(true);
      setIsDissolving(true);
      
      // Call the onClick prop
      if (onClick) onClick();
      
      // Reset the active animation state quickly
      setTimeout(() => {
        setIsActive(false);
      }, 200);
      
      // After dissolution is complete, show the space with continuous meteor shower
      setTimeout(() => {
        setIsDisappeared(true);
        setIsDissolving(false);
        // Do not reset dissolution state - keep it permanent
      }, 2000);
    }
  };
  
  // Generate explosion particles
  const renderExplosionParticles = () => {
    if (!isExploding || isDissolving || isDisappeared) return null;
    
    const particles = [];
    const colors = ['#FF5722', '#FFC107', '#FF9800', '#FFEB3B', '#F44336'];
    
    for (let i = 0; i < 20; i++) {
      const size = Math.random() * 8 + 4;
      const style = {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0,
        animation: `explode ${Math.random() * 0.6 + 0.4}s forwards ease-out`,
        animationDelay: `${Math.random() * 0.2}s`,
        // Make particles explode in random directions
        '--explode-x': `${(Math.random() * 200 - 100)}%`,
        '--explode-y': `${(Math.random() * 200 - 100)}%`
      };
      
      particles.push(
        <span key={`particle-${i}`} className="explosion-particle" style={style}></span>
      );
    }
    
    return particles;
  };
  
  // Generate continuous meteor shower after button disappears
  const renderContinuousMeteorShower = () => {
    if (!isDisappeared) return null;
    
    const meteors = [];
    const colors = [
      'rgba(255, 255, 255, 0.9)',
      'rgba(255, 200, 200, 0.9)',
      'rgba(200, 200, 255, 0.9)',
      'rgba(255, 230, 180, 0.9)',
      'rgba(180, 255, 230, 0.9)'
    ];
    
    // Generate many meteors
    for (let i = 0; i < 30; i++) {
      const size = 1 + Math.random() * 2; // Size between 1-3px
      const length = 30 + Math.random() * 70; // Length between 30-100px
      const color = colors[Math.floor(Math.random() * colors.length)];
      const delay = Math.random() * 15; // Random delay for continuous effect
      const duration = 1 + Math.random() * 2; // Duration between 1-3s
      const xPos = Math.random() * 100; // Random horizontal position
      
      const style = {
        position: 'absolute',
        width: `${size}px`,
        height: `${length}px`,
        left: `${xPos}%`,
        top: '-50px',
        background: `linear-gradient(to bottom, ${color}, transparent)`,
        borderRadius: '50%',
        filter: `blur(${size > 2 ? 1 : 0}px) drop-shadow(0 0 3px ${color})`,
        opacity: 0.8,
        animation: `continuous-meteor ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
        transform: 'rotate(15deg)',
        zIndex: Math.floor(size * 10),
      };
      
      meteors.push(
        <div key={`meteor-cont-${i}`} className="continuous-meteor" style={style}></div>
      );
    }
    
    return (
      <div className="continuous-meteor-container">
        {meteors}
      </div>
    );
  };
  
  // Generate dissolution pixels
  const renderDissolutionPixels = () => {
    if (!isDissolving) return null;
    
    const pixels = [];
    const buttonWidth = buttonRef.current?.offsetWidth || 160;
    const buttonHeight = buttonRef.current?.offsetHeight || 50;
    const gridSize = 4; // Size of each pixel
    const colors = [
      'rgba(255, 255, 255, 0.9)',
      'rgba(255, 200, 200, 0.8)',
      'rgba(255, 150, 150, 0.7)',
      'rgba(255, 100, 100, 0.8)',
      'rgba(255, 50, 100, 0.7)'
    ];
    
    // Generate grid of dissolution pixels
    for (let x = 0; x < buttonWidth; x += gridSize) {
      for (let y = 0; y < buttonHeight; y += gridSize) {
        // Random values for animation
        const delay = Math.random() * 1.5; // Random delay up to 1.5s
        const duration = 0.5 + Math.random() * 1; // Random duration between 0.5-1.5s
        const dirX = (Math.random() - 0.5) * 2; // Random direction X
        const dirY = (Math.random() - 0.5) * 2; // Random direction Y
        const distance = 20 + Math.random() * 80; // Random float distance
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const style = {
          position: 'absolute',
          width: `${gridSize - 1}px`,
          height: `${gridSize - 1}px`,
          backgroundColor: color,
          left: `${x}px`,
          top: `${y}px`,
          opacity: 1,
          borderRadius: '1px',
          boxShadow: '0 0 2px rgba(255, 255, 255, 0.5)',
          animation: `dissolve ${duration}s forwards ease-out`,
          animationDelay: `${delay}s`,
          // CSS variables for animation
          '--dissolve-x': `${dirX * distance}px`,
          '--dissolve-y': `${dirY * distance}px`,
          '--dissolve-r': `${Math.random() * 360}deg`
        };
        
        pixels.push(
          <span key={`dissolve-${x}-${y}`} className="dissolution-pixel" style={style}></span>
        );
      }
    }
    
    return (
      <div className="dissolution-container">
        {pixels}
      </div>
    );
  };
  
  // Generate pixel text effect
  const renderPixelText = () => {
    if (!isHovered || isDissolving || isDisappeared) {
      return (
        <span 
          className="ui-studio-text-content" 
          style={{ 
            // Apply dynamic inline transform for extra intensity based on shakeIntensity
            transform: !isHovered && !isActive && !isDissolving && !isDisappeared ? 
              `scale(${1 + 0.05 * shakeIntensity})` : 'scale(1)',
            transition: 'transform 0.3s ease',
            opacity: isDissolving || isDisappeared ? 0 : 1
          }}
        >
          UI STUDIO
        </span>
      );
    }
    
    const pixels = [];
    const text = "UI STUDIO";
    const fontSize = 16;
    const gridSize = 4;
    
    // Calculate text dimensions
    const textWidth = text.length * fontSize;
    const textHeight = fontSize * 1.2;
    
    // Generate pixels in a grid
    for (let x = 0; x < textWidth; x += gridSize) {
      for (let y = 0; y < textHeight; y += gridSize) {
        // Only include positions that would be part of the text
        const charIndex = Math.floor(x / fontSize);
        if (charIndex < text.length && text[charIndex] !== " ") {
          // Calculate distance from mouse
          const distanceToMouse = Math.sqrt(
            Math.pow(x - mousePos.x + 30, 2) + 
            Math.pow(y - mousePos.y + 15, 2)
          );
          
          // Only show pixels close to mouse
          const maxDistance = 60;
          const probability = Math.max(0, 1 - distanceToMouse / maxDistance);
          
          if (probability > 0.3 && Math.random() < probability) {
            const style = {
              position: 'absolute',
              width: `${gridSize - 1}px`,
              height: `${gridSize - 1}px`,
              backgroundColor: 'white',
              left: `${x}px`,
              top: `${y}px`,
              opacity: 0.7 + probability * 0.3,
              transform: `translate(${(Math.random() * 2 - 1) * 3}px, ${(Math.random() * 2 - 1) * 3}px)`,
              borderRadius: '1px'
            };
            
            pixels.push(
              <span key={`pixel-${x}-${y}`} className="text-pixel" style={style}></span>
            );
          }
        }
      }
    }
    
    return (
      <div className="pixel-text-container">
        {pixels}
      </div>
    );
  };

  // Determine button classes based on state
  const buttonClasses = [
    'ui-studio-button-simple',
    isActive ? 'active' : '',
    isHovered ? 'hovered' : '',
    isMobile ? 'mobile' : '',
    !isHovered && !isActive && !isDissolving && !isDisappeared ? 'idle' : '',
    isDissolving ? 'dissolving' : '',
    isDisappeared ? 'disappeared' : '',
    `shake-intensity-${Math.round(shakeIntensity)}`
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={buttonRef}
      className={buttonClasses}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      disabled={isDissolving || isDisappeared}
    >
      {/* Meteor container - only show before disappearance */}
      {!isDisappeared && !isDissolving && (
        <div className="meteor-container">
          <div className="meteor meteor-1"></div>
          <div className="meteor meteor-2"></div>
          <div className="meteor meteor-3"></div>
          <div className="meteor meteor-4"></div>
          <div className="meteor meteor-5"></div>
          <div className="meteor meteor-6"></div>
          <div className="meteor meteor-7"></div>
          <div className="meteor meteor-8"></div>
        </div>
      )}
      
      {/* Idle animations - only show before dissolution */}
      {!isDissolving && !isDisappeared && (
        <div className="fire-container">
          <div className="fire-base"></div>
          <div className="fire-wave fire-wave-1"></div>
          <div className="fire-wave fire-wave-2"></div>
          <div className="fire-particles"></div>
        </div>
      )}
      
      {/* Lightning effect - only show before dissolution */}
      {!isDissolving && !isDisappeared && (
        <div className="lightning-container">
          <div className="lightning-bolt"></div>
          <div className="lightning-glow"></div>
        </div>
      )}
      
      {/* Text content - only show before dissolution */}
      {!isDisappeared && (
        <div className="text-container">
          {renderPixelText()}
        </div>
      )}
      
      {/* Explosion particles - only show on hover before dissolution */}
      {renderExplosionParticles()}
      
      {/* Dissolution pixels when clicked */}
      {renderDissolutionPixels()}
      
      {/* Continuous meteor shower after disappearance */}
      {renderContinuousMeteorShower()}
      
      {/* Inner glow and effects - only show before dissolution */}
      {!isDisappeared && !isDissolving && (
        <span className="ui-studio-effect"></span>
      )}
    </button>
  );
} 