import React from 'react';
import { Microscope, Telescope } from 'lucide-react';

export const CosmicMap: React.FC = () => {
  return (
    <div className="w-full border border-[#00FFFF]/20 bg-black/80 p-1 relative overflow-hidden group rounded-xl">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <h3 className="font-tech text-[#00FFFF] text-sm tracking-[0.2em] uppercase">Visual Parity Audit</h3>
        <p className="text-[10px] text-gray-400 font-mono">Scale: 10^-6 vs 10^24</p>
      </div>

      <div className="flex flex-col md:flex-row h-[500px]">
        {/* Left: The Brain */}
        <div className="flex-1 relative border-b md:border-b-0 md:border-r border-[#00FFFF]/10 bg-gradient-to-b from-purple-900/10 to-black p-6 flex flex-col justify-end">
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
             {/* Abstract representation of neurons using CSS gradients */}
             <div className="w-64 h-64 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/40 via-transparent to-transparent blur-xl"></div>
             <svg className="absolute w-full h-full opacity-30" viewBox="0 0 100 100">
                <path d="M20,50 Q50,20 80,50 T20,50" fill="none" stroke="#a855f7" strokeWidth="0.5" />
                <path d="M30,30 Q50,80 70,30" fill="none" stroke="#a855f7" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="2" fill="#a855f7" />
             </svg>
          </div>
          <div className="relative z-10">
            <Microscope className="w-6 h-6 text-purple-400 mb-2" />
            <h4 className="font-tech text-white text-lg">The Micro</h4>
            <p className="text-gray-400 text-xs font-mono">Biological Neural Network</p>
            <div className="mt-4 flex gap-2 text-[9px] text-gray-500 uppercase">
               <span className="border border-gray-700 px-2 py-1 rounded">2.5 Petabytes</span>
               <span className="border border-gray-700 px-2 py-1 rounded">77% Water</span>
            </div>
          </div>
        </div>

        {/* Right: The Cosmos */}
        <div className="flex-1 relative bg-gradient-to-b from-blue-900/10 to-black p-6 flex flex-col justify-end">
           <div className="absolute inset-0 flex items-center justify-center opacity-40">
             <div className="w-64 h-64 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/40 via-transparent to-transparent blur-xl"></div>
             <svg className="absolute w-full h-full opacity-30" viewBox="0 0 100 100">
                <path d="M10,10 Q90,90 50,50" fill="none" stroke="#00FFFF" strokeWidth="0.5" />
                <path d="M90,10 Q10,90 50,50" fill="none" stroke="#00FFFF" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="2" fill="#00FFFF" />
             </svg>
          </div>
          <div className="relative z-10">
            <Telescope className="w-6 h-6 text-[#00FFFF] mb-2" />
            <h4 className="font-tech text-white text-lg">The Macro</h4>
            <p className="text-gray-400 text-xs font-mono">Cosmic Web of Galaxies</p>
            <div className="mt-4 flex gap-2 text-[9px] text-gray-500 uppercase">
               <span className="border border-gray-700 px-2 py-1 rounded">4.3 Petabytes</span>
               <span className="border border-gray-700 px-2 py-1 rounded">73% Dark Energy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Connector */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="w-12 h-12 rounded-full border border-[#00FFFF] bg-black flex items-center justify-center shadow-[0_0_15px_#00FFFF]">
            <span className="font-tech text-[8px] text-[#00FFFF] animate-pulse">SYNC</span>
        </div>
      </div>
    </div>
  );
};