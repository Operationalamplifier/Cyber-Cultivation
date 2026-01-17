import React, { useRef, useEffect, useState } from 'react';
import { GameSettings } from '../types';
import { audioService } from '../services/audioService';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
  onUpdateStats: (type: 'beads') => void;
  settings: GameSettings;
}

const BEAD_SIZE = 120;
const BEAD_GAP = 20;

const Beads: React.FC<Props> = ({ onBack, onUpdateStats, settings }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [skin, setSkin] = useState<'WOOD' | 'GOLD' | 'ENERGY'>('WOOD');
  
  // Track scroll for triggering logic
  const lastScrollRef = useRef(0);
  const accumulatedScrollRef = useRef(0);

  const getSkinStyles = () => {
    switch (skin) {
      case 'GOLD': return 'bg-gradient-to-br from-yellow-300 to-yellow-600 border-yellow-200';
      case 'ENERGY': return 'bg-black border-2 border-cyber-neon shadow-[0_0_15px_rgba(204,255,0,0.5)]';
      default: return 'bg-gradient-to-br from-amber-800 to-amber-950 border-amber-700'; // Wood
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const scrollTop = containerRef.current.scrollTop;
    const delta = scrollTop - lastScrollRef.current;
    
    // Only count downward scrolls (pulling beads down)
    if (delta > 0) {
        accumulatedScrollRef.current += delta;
        const threshold = BEAD_SIZE + BEAD_GAP;
        
        if (accumulatedScrollRef.current >= threshold) {
            // Trigger Bead Pass
            setCount(prev => prev + 1);
            onUpdateStats('beads');
            accumulatedScrollRef.current = 0; // Reset accumulator

            // Feedback
            if (settings.soundEnabled) audioService.playBeadSound();
            if (settings.hapticsEnabled && navigator.vibrate) navigator.vibrate(5);
        }
    } else {
        // Prevent accumulating negative scroll (upwards)
        accumulatedScrollRef.current = 0;
    }
    
    lastScrollRef.current = scrollTop;
  };

  // Generate infinite-looking list
  const beadsList = Array.from({ length: 50 }); // Enough to scroll a while

  // Reset scroll to middle to allow infinite feel (simplified implementation)
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
        // Start a bit down
        container.scrollTop = 100;
        lastScrollRef.current = 100;
    }
  }, []);

  return (
    <div className="h-full w-full bg-cyber-dark flex flex-col relative">
      <div className="absolute top-0 w-full p-6 flex justify-between z-10 bg-gradient-to-b from-cyber-black to-transparent">
        <button onClick={onBack} className="p-2 text-cyber-white">
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-2">
            <button onClick={() => setSkin('WOOD')} className={`w-6 h-6 rounded-full bg-amber-800 ${skin === 'WOOD' ? 'ring-2 ring-white' : ''}`} />
            <button onClick={() => setSkin('GOLD')} className={`w-6 h-6 rounded-full bg-yellow-500 ${skin === 'GOLD' ? 'ring-2 ring-white' : ''}`} />
            <button onClick={() => setSkin('ENERGY')} className={`w-6 h-6 rounded-full bg-black border border-cyber-neon ${skin === 'ENERGY' ? 'ring-2 ring-white' : ''}`} />
        </div>
      </div>

      <div className="absolute top-20 right-6 text-cyber-neon font-mono text-xl z-10 pointer-events-none">
        {count}
      </div>

      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-scroll no-scrollbar flex flex-col items-center py-48"
        style={{ scrollSnapType: 'y proximity' }}
      >
        {beadsList.map((_, i) => (
            <div 
                key={i}
                className={`flex-shrink-0 rounded-full transition-transform active:scale-95 ${getSkinStyles()}`}
                style={{
                    width: `${BEAD_SIZE}px`,
                    height: `${BEAD_SIZE}px`,
                    marginBottom: `${BEAD_GAP}px`,
                    scrollSnapAlign: 'center'
                }}
            >
                {/* Highlight/Reflection for 3D effect */}
                <div className="w-full h-full rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-50" />
            </div>
        ))}
        <div className="h-96 w-full" /> {/* Spacer */}
      </div>

      <div className="absolute bottom-10 w-full text-center text-cyber-gray text-xs font-mono pointer-events-none">
        向下滑动盘串
      </div>
    </div>
  );
};

export default Beads;