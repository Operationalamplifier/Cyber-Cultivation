import React, { useState, useEffect } from 'react';
import { GameSettings } from '../types';
import { audioService } from '../services/audioService';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
  onUpdateStats: (type: 'rose') => void;
  settings: GameSettings;
}

const MODES = {
  DEFAULT: ["霉运退散", "水逆退散"],
  OFFER: ["Offer +1", "Offer +1"],
  LOVE: ["他爱我", "他不爱我"],
  WORK: ["准时下班", "还要加班"],
};

const Rose: React.FC<Props> = ({ onBack, onUpdateStats, settings }) => {
  const [petals, setPetals] = useState<number[]>([0, 45, 90, 135, 180, 225, 270, 315]);
  const [mode, setMode] = useState<keyof typeof MODES>('DEFAULT');
  const [feedback, setFeedback] = useState("");
  const [bgDarkness, setBgDarkness] = useState(0);
  const [resetting, setResetting] = useState(false);

  const resetFlower = () => {
    setResetting(true);
    setFeedback("心想事成");
    if (settings.soundEnabled) audioService.playWinSound();
    
    setTimeout(() => {
      setPetals([0, 45, 90, 135, 180, 225, 270, 315]);
      setBgDarkness(0);
      setFeedback("");
      setResetting(false);
    }, 2000);
  };

  const handleTear = (index: number, angle: number) => {
    if (resetting) return;

    if (settings.soundEnabled) audioService.playTearSound();
    if (settings.hapticsEnabled && navigator.vibrate) navigator.vibrate(15);

    const newPetals = petals.filter(p => p !== angle);
    setPetals(newPetals);
    onUpdateStats('rose');
    setBgDarkness(prev => Math.min(prev + 0.1, 0.8));

    // Feedback logic
    const texts = MODES[mode];
    // Simple toggle logic based on remaining count
    const textIndex = newPetals.length % 2;
    setFeedback(texts[textIndex]);

    if (newPetals.length === 0) {
      resetFlower();
    }
  };

  return (
    <div 
      className="h-full w-full flex flex-col items-center relative transition-colors duration-500"
      style={{ backgroundColor: `rgba(10, 10, 10, ${1 - bgDarkness * 0.5})` }}
    >
      <div className="w-full px-6 py-6 flex justify-between items-center z-10">
        <button onClick={onBack} className="p-2 text-cyber-white">
          <ArrowLeft size={24} />
        </button>
        <select 
          value={mode} 
          onChange={(e) => setMode(e.target.value as any)}
          className="bg-cyber-gray text-cyber-white p-2 rounded text-xs font-mono border border-cyber-dark"
        >
          <option value="DEFAULT">默认模式</option>
          <option value="LOVE">情感模式</option>
          <option value="OFFER">求Offer</option>
          <option value="WORK">下班模式</option>
        </select>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full relative">
        <div className="relative w-64 h-64 flex items-center justify-center">
           {/* Stem/Center */}
           <div className="absolute w-8 h-8 bg-yellow-600 rounded-full z-20 shadow-inner"></div>
           
           {/* Petals */}
           {petals.map((angle, i) => (
             <div
               key={angle}
               onClick={() => handleTear(i, angle)}
               className="absolute w-24 h-32 bg-red-600 rounded-full origin-bottom-center border-2 border-red-800 cursor-pointer hover:bg-red-500 transition-colors shadow-lg"
               style={{
                 transformOrigin: '50% 100%',
                 transform: `rotate(${angle}deg) translateY(-40px)`,
                 zIndex: 10,
               }}
             >
                <div className="w-full h-full bg-gradient-to-t from-red-900 to-transparent opacity-30 rounded-full"></div>
             </div>
           ))}
        </div>

        {/* Feedback Text */}
        <div className="mt-12 h-12 text-cyber-neon font-bold text-2xl font-mono text-center px-4">
          {feedback}
        </div>
      </div>
    </div>
  );
};

export default Rose;