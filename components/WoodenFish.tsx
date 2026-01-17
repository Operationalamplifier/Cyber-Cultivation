import React, { useState, useRef } from 'react';
import { FloatingText, GameSettings } from '../types';
import { audioService } from '../services/audioService';
import { ArrowLeft, Image as ImageIcon, RotateCcw } from 'lucide-react';

interface Props {
  onBack: () => void;
  onUpdateStats: (type: 'fish') => void;
  settings: GameSettings;
}

const FEEDBACK_TEXTS = ["功德 +1", "冷静 +1", "格局打开", "原谅他", "离苦得乐", "不生气", "财富 +1"];

const WoodenFish: React.FC<Props> = ({ onBack, onUpdateStats, settings }) => {
  const [count, setCount] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [scale, setScale] = useState(1);
  const [targetImage, setTargetImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerHaptic = () => {
    if (settings.hapticsEnabled && navigator.vibrate) {
      navigator.vibrate(50); // Heavy impact
    }
  };

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default to stop double firing on some touch devices
    // e.preventDefault(); 
    
    // Play sound
    if (settings.soundEnabled) audioService.playWoodSound();
    
    // Haptics
    triggerHaptic();

    // Stats
    setCount(prev => prev + 1);
    onUpdateStats('fish');

    // Animation
    setScale(0.9);
    setTimeout(() => setScale(1), 100);

    // Floating Text
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const text = targetImage 
      ? FEEDBACK_TEXTS[Math.floor(Math.random() * FEEDBACK_TEXTS.length)] 
      : "功德 +1";

    const newText: FloatingText = {
      id: Date.now(),
      text,
      x: clientX,
      y: clientY - 50,
    };

    setFloatingTexts(prev => [...prev, newText]);

    // Cleanup text
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== newText.id));
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTargetImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full w-full bg-cyber-black flex flex-col items-center justify-between py-6 relative overflow-hidden">
      {/* Header */}
      <div className="w-full px-6 flex justify-between items-center z-10">
        <button onClick={onBack} className="p-2 text-cyber-white">
          <ArrowLeft size={24} />
        </button>
        <div className="text-cyber-neon font-mono text-xl">功德: {count}</div>
        <div className="flex gap-2">
          <button onClick={() => fileInputRef.current?.click()} className="p-2 text-cyber-gray hover:text-cyber-white">
            <ImageIcon size={24} />
          </button>
          {targetImage && (
            <button onClick={() => setTargetImage(null)} className="p-2 text-red-500">
              <RotateCcw size={24} />
            </button>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleImageUpload}
        />
      </div>

      {/* Floating Texts Layer */}
      {floatingTexts.map(ft => (
        <div
          key={ft.id}
          className="fixed pointer-events-none text-cyber-white text-xl font-bold animate-float-up z-50"
          style={{ left: ft.x, top: ft.y }}
        >
          {ft.text}
        </div>
      ))}

      {/* Main Fish Interaction */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div 
          className="relative w-64 h-52 transition-transform duration-100 ease-in-out cursor-pointer"
          style={{ transform: `scale(${scale})` }}
          onClick={handleClick}
        >
           {/* Abstract Wooden Fish Shape (SVG) */}
          <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-2xl filter">
            <defs>
              <radialGradient id="fishGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor:'#4a4a4a', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#1a1a1a', stopOpacity:1}} />
              </radialGradient>
            </defs>
            <path 
              d="M20,80 Q20,10 100,10 T180,80 Q180,150 100,150 T20,80 Z" 
              fill="url(#fishGrad)" 
              stroke="#cyber-neon" 
              strokeWidth="2"
            />
            {/* Texture lines */}
            <path d="M50,80 Q100,120 150,80" fill="none" stroke="#000" strokeWidth="4" opacity="0.3" />
            
            {/* Stick (Hammer) Hint */}
            <circle cx="140" cy="40" r="10" fill="#333" className="animate-pulse" opacity="0.5" />
          </svg>

          {/* Target Image Overlay */}
          {targetImage && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full overflow-hidden border-2 border-cyber-neon opacity-80 pointer-events-none">
              <img src={targetImage} alt="Target" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        
        <p className="mt-12 text-cyber-gray font-mono text-sm animate-pulse">
          点击积攒功德
        </p>
      </div>
    </div>
  );
};

export default WoodenFish;