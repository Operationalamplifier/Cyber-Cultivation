import React, { useState, useEffect } from 'react';
import { View, UserStats, GameSettings } from './types';
import Menu from './components/Menu';
import WoodenFish from './components/WoodenFish';
import Rose from './components/Rose';
import Banana from './components/Banana';
import Beads from './components/Beads';
import DailyReport from './components/DailyReport';
import { audioService } from './services/audioService';
import { Volume2, VolumeX, Smartphone, SmartphoneNfc } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    hapticsEnabled: true,
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('cyber_zen_stats');
    return saved ? JSON.parse(saved) : {
      woodenFishCount: 0,
      rosePetalsTorn: 0,
      bananaRubTimeSec: 0,
      beadsCount: 0,
      lastReportDate: null,
    };
  });

  useEffect(() => {
    localStorage.setItem('cyber_zen_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    audioService.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const updateStats = (type: 'fish' | 'rose' | 'banana' | 'beads', amount: number = 1) => {
    setStats(prev => {
      const newStats = { ...prev };
      switch (type) {
        case 'fish': newStats.woodenFishCount += amount; break;
        case 'rose': newStats.rosePetalsTorn += amount; break;
        case 'banana': newStats.bananaRubTimeSec += amount; break;
        case 'beads': newStats.beadsCount += amount; break;
      }
      return newStats;
    });
  };

  const renderView = () => {
    switch (currentView) {
      case View.HOME:
        return <Menu onNavigate={setCurrentView} toggleSettings={() => setShowSettings(true)} />;
      case View.WOODEN_FISH:
        return <WoodenFish onBack={() => setCurrentView(View.HOME)} onUpdateStats={() => updateStats('fish')} settings={settings} />;
      case View.ROSE:
        return <Rose onBack={() => setCurrentView(View.HOME)} onUpdateStats={() => updateStats('rose')} settings={settings} />;
      case View.BANANA:
        return <Banana onBack={() => setCurrentView(View.HOME)} onUpdateStats={(t, a) => updateStats(t, a)} settings={settings} />;
      case View.BEADS:
        return <Beads onBack={() => setCurrentView(View.HOME)} onUpdateStats={() => updateStats('beads')} settings={settings} />;
      case View.REPORT:
        return <DailyReport stats={stats} onBack={() => setCurrentView(View.HOME)} />;
      default:
        return <div>Error</div>;
    }
  };

  return (
    <div className="w-full h-screen bg-cyber-black text-cyber-white overflow-hidden max-w-md mx-auto relative shadow-2xl">
      {renderView()}

      {/* Settings Modal Overlay */}
      {showSettings && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-cyber-dark border border-cyber-gray w-full max-w-sm p-6 rounded shadow-xl">
            <h2 className="text-xl font-mono text-cyber-neon mb-6 border-b border-cyber-gray pb-2">设置</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  <span>音效</span>
                </div>
                <button 
                  onClick={() => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.soundEnabled ? 'bg-cyber-neon' : 'bg-cyber-gray'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-black transition-transform ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {settings.hapticsEnabled ? <SmartphoneNfc size={20} /> : <Smartphone size={20} />}
                  <span>震动</span>
                </div>
                <button 
                  onClick={() => setSettings(s => ({ ...s, hapticsEnabled: !s.hapticsEnabled }))}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.hapticsEnabled ? 'bg-cyber-pink' : 'bg-cyber-gray'}`}
                >
                   <div className={`w-4 h-4 rounded-full bg-black transition-transform ${settings.hapticsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <button 
              onClick={() => setShowSettings(false)}
              className="mt-8 w-full py-3 bg-cyber-white text-black font-bold hover:bg-gray-200 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;