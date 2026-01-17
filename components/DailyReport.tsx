import React, { useState, useEffect } from 'react';
import { UserStats } from '../types';
import { generateDailyReport } from '../services/geminiService';
import { ArrowLeft, Share2, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  stats: UserStats;
  onBack: () => void;
}

const DailyReport: React.FC<Props> = ({ stats, onBack }) => {
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const text = await generateDailyReport(stats);
        setReport(text);
      } catch (e) {
        setReport("连接赛博虚空失败。");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [stats]);

  return (
    <div className="h-full w-full bg-cyber-black text-cyber-white flex flex-col overflow-y-auto">
      <div className="p-6 sticky top-0 bg-cyber-black/90 backdrop-blur z-10 flex justify-between items-center border-b border-cyber-gray">
        <button onClick={onBack}>
          <ArrowLeft />
        </button>
        <h1 className="font-mono text-cyber-neon">今日修仙日报</h1>
        <button className="text-cyber-gray hover:text-cyber-pink">
          <Share2 />
        </button>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="animate-spin text-cyber-neon w-12 h-12" />
            <p className="font-mono text-sm animate-pulse">正在计算功德...</p>
          </div>
        ) : (
          <div className="w-full max-w-md bg-cyber-dark p-6 border-2 border-cyber-white shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
            {/* Report Header Visual */}
            <div className="border-b-2 border-dashed border-cyber-gray pb-4 mb-4 flex justify-between items-end">
                <span className="text-3xl font-black italic">赛博修仙</span>
                <span className="font-mono text-xs">{new Date().toLocaleDateString()}</span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 font-mono text-xs">
                <div className="bg-black p-2 border border-cyber-gray">
                    <div className="text-cyber-gray">功德</div>
                    <div className="text-xl text-cyber-neon">{stats.woodenFishCount}</div>
                </div>
                <div className="bg-black p-2 border border-cyber-gray">
                    <div className="text-cyber-gray">撕花</div>
                    <div className="text-xl text-red-500">{stats.rosePetalsTorn}</div>
                </div>
                <div className="bg-black p-2 border border-cyber-gray">
                    <div className="text-cyber-gray">去蕉</div>
                    <div className="text-xl text-yellow-500">{stats.bananaRubTimeSec}s</div>
                </div>
                <div className="bg-black p-2 border border-cyber-gray">
                    <div className="text-cyber-gray">盘串</div>
                    <div className="text-xl text-amber-600">{stats.beadsCount}</div>
                </div>
            </div>

            {/* AI Text */}
            <div className="prose prose-invert prose-p:font-mono prose-headings:text-cyber-pink text-sm">
                <ReactMarkdown>{report}</ReactMarkdown>
            </div>
            
            {/* Footer Stamp */}
            <div className="mt-8 flex justify-end">
                <div className="border-2 border-red-600 text-red-600 font-bold p-2 rotate-[-12deg] opacity-80">
                    功德圆满
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyReport;