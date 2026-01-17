import React, { useRef, useEffect, useState } from 'react';
import { GameSettings } from '../types';
import { audioService } from '../services/audioService';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface Props {
  onBack: () => void;
  onUpdateStats: (type: 'banana', amount: number) => void;
  settings: GameSettings;
}

const WORDS = ["KPI", "房贷", "周一", "内耗", "焦虑", "Bug", "早八"];

const Banana: React.FC<Props> = ({ onBack, onUpdateStats, settings }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isWon, setIsWon] = useState(false);
  const [rubbing, setRubbing] = useState(false);
  const [clearedPercent, setClearedPercent] = useState(0);
  
  // Stats tracking
  const lastUpdateRef = useRef(Date.now());

  const initCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill with "Green" (Anxiety) color
    ctx.fillStyle = '#4a7c59'; // Dull green
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Anxiety Words
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    WORDS.forEach((word) => {
      const x = Math.random() * (canvas.width - 100) + 50;
      const y = Math.random() * (canvas.height - 100) + 50;
      const angle = (Math.random() - 0.5) * 1;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(word, 0, 0);
      ctx.restore();
    });

    ctx.globalCompositeOperation = 'destination-out';
  };

  useEffect(() => {
    initCanvas();
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, []);

  const handleRub = (x: number, y: number) => {
    if (isWon) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const touchX = x - rect.left;
    const touchY = y - rect.top;

    ctx.beginPath();
    ctx.arc(touchX, touchY, 30, 0, Math.PI * 2);
    ctx.fill();

    // Sound & Haptic
    if (!rubbing) {
        setRubbing(true);
        if (settings.soundEnabled) audioService.playRubSound();
        if (settings.hapticsEnabled && navigator.vibrate) navigator.vibrate(10);
        setTimeout(() => setRubbing(false), 100);
    }

    // Update Stats (Time based approximate)
    const now = Date.now();
    if (now - lastUpdateRef.current > 1000) {
        onUpdateStats('banana', 1);
        lastUpdateRef.current = now;
        checkWin(canvas);
    }
  };

  const checkWin = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Sample pixels to check clearance (Performance optimization: sample every 10th pixel)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let transparentPixels = 0;
    const totalPixels = data.length / 4;
    
    for (let i = 3; i < data.length; i += 40) {
        if (data[i] === 0) transparentPixels++;
    }
    
    const percent = transparentPixels / (totalPixels / 10);
    setClearedPercent(percent);

    if (percent > 0.85) {
        setIsWon(true);
        if (settings.soundEnabled) audioService.playWinSound();
        if (settings.hapticsEnabled && navigator.vibrate) navigator.vibrate([100, 50, 100]); // Long vib
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleRub(e.touches[0].clientX, e.touches[0].clientY);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
        handleRub(e.clientX, e.clientY);
    }
  };

  const handleReset = () => {
      setIsWon(false);
      setClearedPercent(0);
      initCanvas();
  };

  return (
    <div className="h-full w-full bg-yellow-400 flex flex-col relative overflow-hidden">
        {/* Navigation */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between z-20">
            <button onClick={onBack} className="p-2 bg-black/20 rounded-full text-white">
                <ArrowLeft size={24} />
            </button>
            <button onClick={handleReset} className="p-2 bg-black/20 rounded-full text-white">
                <RefreshCw size={24} />
            </button>
        </div>

        {/* Content Container */}
        <div ref={containerRef} className="flex-1 w-full h-full relative flex items-center justify-center">
            
            {/* The "Result" Layer (Yellow Banana / Smiley) */}
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                 {isWon ? (
                     <div className="text-center animate-bounce">
                         <div className="text-6xl mb-4">😎</div>
                         <h2 className="text-3xl font-black text-black">禁止蕉绿</h2>
                     </div>
                 ) : (
                    // Underlying bright yellow banana shape
                    <div className="w-64 h-64 bg-yellow-300 rounded-full blur-xl opacity-80"></div>
                 )}
            </div>

            {/* The "Scratch" Layer (Canvas) */}
            <canvas
                ref={canvasRef}
                className={`absolute inset-0 touch-none transition-opacity duration-1000 ${isWon ? 'opacity-0' : 'opacity-100'}`}
                onTouchMove={handleTouchMove}
                onMouseMove={handleMouseMove}
            />

            {!isWon && (
                <div className="absolute bottom-20 text-black/50 font-bold pointer-events-none animate-pulse">
                    摩擦消除焦虑
                </div>
            )}
        </div>
    </div>
  );
};

export default Banana;