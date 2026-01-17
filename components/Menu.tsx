import React from 'react';
import { View } from '../types';
import { Settings, Sparkles, Sprout, Banana as BananaIcon, CircleDot } from 'lucide-react';

interface Props {
  onNavigate: (view: View) => void;
  toggleSettings: () => void;
}

const Menu: React.FC<Props> = ({ onNavigate, toggleSettings }) => {
  return (
    <div className="h-full w-full bg-cyber-black text-cyber-white p-6 flex flex-col relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter">赛博修仙</h1>
          <p className="text-cyber-gray text-xs font-mono">抽象解压宝盒 v1.0</p>
        </div>
        <button onClick={toggleSettings} className="p-2 border border-cyber-gray rounded hover:bg-cyber-gray transition-colors">
          <Settings size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1 mb-20">
        <button 
          onClick={() => onNavigate(View.WOODEN_FISH)}
          className="bg-cyber-dark border border-cyber-gray p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform hover:border-cyber-neon group"
        >
          <div className="text-cyber-neon group-hover:animate-pulse">
             <CircleDot size={48} />
          </div>
          <span className="font-mono text-sm">电子木鱼</span>
        </button>

        <button 
          onClick={() => onNavigate(View.ROSE)}
          className="bg-cyber-dark border border-cyber-gray p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform hover:border-red-500 group"
        >
          <div className="text-red-500 group-hover:animate-pulse">
             <Sprout size={48} />
          </div>
          <span className="font-mono text-sm">赛博撕花</span>
        </button>

        <button 
          onClick={() => onNavigate(View.BANANA)}
          className="bg-cyber-dark border border-cyber-gray p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform hover:border-yellow-400 group"
        >
           <div className="text-yellow-400 group-hover:animate-bounce">
             <BananaIcon size={48} />
          </div>
          <span className="font-mono text-sm">禁止蕉绿</span>
        </button>

        <button 
          onClick={() => onNavigate(View.BEADS)}
          className="bg-cyber-dark border border-cyber-gray p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform hover:border-amber-600 group"
        >
           <div className="text-amber-600 group-hover:rotate-180 transition-transform duration-700">
             <CircleDot size={48} className="border-2 border-amber-600 rounded-full border-dashed" />
          </div>
          <span className="font-mono text-sm">赛博盘串</span>
        </button>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <button 
            onClick={() => onNavigate(View.REPORT)}
            className="w-full bg-cyber-pink text-black font-bold py-4 border-2 border-cyber-white shadow-[4px_4px_0px_0px_#ffffff] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#ffffff] transition-all flex items-center justify-center gap-2"
        >
            <Sparkles size={20} />
            今日修仙日报
        </button>
      </div>
    </div>
  );
};

export default Menu;