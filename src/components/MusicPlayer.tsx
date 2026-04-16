import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Radio, Disc } from 'lucide-react';
import { Track } from '@/src/types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'NEON_DREAMS_v1',
    artist: 'CYBER_SYNTH',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon/400/400',
  },
  {
    id: '2',
    title: 'MIDNIGHT_DRIVE_v2',
    artist: 'LO_FI_AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/midnight/400/400',
  },
  {
    id: '3',
    title: 'DIGITAL_RAIN_v3',
    artist: 'SYNTH_BOT',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/rain/400/400',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  return (
    <div className="w-full bg-black border border-[#ff00ff]/30 p-6 relative">
      <div className="absolute top-0 right-0 w-16 h-1 bg-[#ff00ff]/50" />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />

      <div className="flex flex-col gap-6">
        {/* Track Info */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0 border border-[#00ffff]/20">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale contrast-125 brightness-75"
            />
            {isPlaying && (
              <motion.div
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 0.1, repeat: Infinity }}
                className="absolute inset-0 bg-[#00ffff]/20"
              />
            )}
          </div>
          
          <div className="flex flex-col overflow-hidden">
            <h3 className="text-sm font-bold text-[#00ffff] truncate uppercase tracking-widest glitch-text" data-text={currentTrack.title}>
              {currentTrack.title}
            </h3>
            <p className="text-[#ff00ff] text-[10px] font-mono uppercase opacity-70">
              SRC: {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-1 w-full bg-[#00ffff]/10 relative overflow-hidden">
            <motion.div
              className="h-full bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-[8px] text-white/20 font-mono uppercase tracking-widest">
            <span>BUFFERING...</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={prevTrack}
            className="p-2 text-[#00ffff]/60 hover:text-[#00ffff] transition-colors"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center border border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-all"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-2 text-[#00ffff]/60 hover:text-[#00ffff] transition-colors"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 text-[8px] text-[#00ffff]/40 uppercase tracking-[0.2em]">
          <Radio className="w-3 h-3 animate-pulse" />
          <span>TRANSMITTING_SIGNAL_STABLE</span>
        </div>
      </div>
    </div>
  );
}

