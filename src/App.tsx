/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal, Activity, Zap, ShieldAlert } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#00ffff] font-mono relative overflow-hidden">
      {/* CRT & Noise Overlays */}
      <div className="crt-overlay" />
      <div className="noise" />
      <div className="scanline" />

      {/* Glitchy Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-px h-full bg-[#ff00ff] animate-pulse" />
        <div className="absolute top-1/2 right-1/3 w-full h-px bg-[#00ffff] animate-pulse" />
      </div>

      {/* Main Interface */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header Bar */}
        <header className="h-16 border-b border-[#00ffff]/30 flex items-center px-8 justify-between bg-black/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <Terminal className="w-6 h-6 animate-pulse" />
            <h1 className="text-2xl font-bold tracking-[0.2em] glitch-text" data-text="SYSTEM_OVERRIDE_v0.9">
              SYSTEM_OVERRIDE_v0.9
            </h1>
          </div>
          <div className="flex items-center gap-8 text-xs tracking-widest opacity-70">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>CORE_TEMP: 42°C</span>
            </div>
            <div className="flex items-center gap-2 text-[#ff00ff]">
              <Zap className="w-4 h-4" />
              <span>UPLINK: ACTIVE</span>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row p-8 gap-8 items-center justify-center">
          {/* Left Sidebar: Cryptic Logs */}
          <aside className="hidden xl:flex flex-col w-64 gap-4 self-stretch">
            <div className="flex-1 border border-[#00ffff]/20 p-4 bg-black/40 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#00ffff]/20" />
              <h3 className="text-[10px] uppercase mb-4 opacity-50 tracking-tighter">Kernel_Logs</h3>
              <div className="space-y-2 text-[10px] leading-tight opacity-80">
                <p className="text-[#ff00ff]">[0.000000] Initializing neural_link...</p>
                <p>[0.000412] Memory_leak detected in sector_7G</p>
                <p>[0.001923] Loading audio_buffer_01.mp3</p>
                <p className="text-yellow-500">[0.002841] WARNING: Glitch_detected in visual_processor</p>
                <p>[0.003112] Snake_protocol initiated...</p>
                <p>[0.004551] Waiting for user_input...</p>
                <p className="animate-pulse">_</p>
              </div>
            </div>
            <div className="h-32 border border-[#ff00ff]/20 p-4 bg-black/40 flex flex-col justify-center items-center gap-2">
              <ShieldAlert className="w-8 h-8 text-[#ff00ff] animate-bounce" />
              <span className="text-[10px] text-center uppercase tracking-widest">Security_Protocol_Bypassed</span>
            </div>
          </aside>

          {/* Center: The Game */}
          <section className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="relative p-1 bg-gradient-to-br from-[#00ffff] via-[#ff00ff] to-[#00ffff] animate-gradient-xy">
              <div className="bg-black p-2">
                <SnakeGame />
              </div>
            </div>
          </section>

          {/* Right: Music & Controls */}
          <aside className="flex flex-col gap-8 w-full lg:w-96">
            <div className="relative p-1 bg-[#ff00ff]/20">
              <MusicPlayer />
            </div>

            <div className="border border-[#00ffff]/30 p-6 bg-black/60 space-y-4">
              <h4 className="text-xs uppercase tracking-[0.3em] text-[#ff00ff] font-bold">Neural_Feedback</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px]">
                  <span>SYNC_RATE</span>
                  <span className="text-[#ff00ff]">98.2%</span>
                </div>
                <div className="h-1 w-full bg-[#00ffff]/10 overflow-hidden">
                  <motion.div
                    animate={{ x: ["-100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-full w-1/2 bg-[#00ffff]"
                  />
                </div>
                <p className="text-[9px] leading-relaxed opacity-40 italic">
                  "The ghost in the machine is hungry. Feed the snake. Listen to the static. The signal is everything."
                </p>
              </div>
            </div>
          </aside>
        </main>

        {/* Footer */}
        <footer className="h-10 border-t border-[#00ffff]/30 flex items-center px-8 justify-between text-[10px] tracking-widest bg-black/50">
          <div className="flex gap-6">
            <span>LOC: ASIA_EAST_1</span>
            <span className="text-[#ff00ff]">ENCRYPTION: AES-256</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ffff] animate-ping" />
            <span>SIGNAL_STRENGTH: OPTIMAL</span>
          </div>
        </footer>
      </div>
    </div>
  );
}


