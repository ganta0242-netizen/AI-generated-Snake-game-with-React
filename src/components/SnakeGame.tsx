import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, RefreshCw, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Direction, Point } from '@/src/types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 120;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        if (score > highScore) {
          setHighScore(score);
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#00ffff', '#ff00ff']
          });
        }
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 1);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood, isGameOver, isPaused, score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (directionRef.current !== 'DOWN') directionRef.current = 'UP'; break;
        case 'ArrowDown': if (directionRef.current !== 'UP') directionRef.current = 'DOWN'; break;
        case 'ArrowLeft': if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT'; break;
        case 'ArrowRight': if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT'; break;
        case ' ': setIsPaused((p) => !p); break;
      }
      setDirection(directionRef.current);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Food (Magenta Glitch)
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff00ff';
    ctx.fillRect(
      food.x * cellSize + 2,
      food.y * cellSize + 2,
      cellSize - 4,
      cellSize - 4
    );

    // Snake (Cyan Glitch)
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00ffff' : 'rgba(0, 255, 255, 0.6)';
      ctx.shadowBlur = isHead ? 15 : 5;
      ctx.shadowColor = '#00ffff';
      
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );

      if (isHead) {
        ctx.fillStyle = '#000';
        ctx.fillRect(
          segment.x * cellSize + cellSize / 4,
          segment.y * cellSize + cellSize / 4,
          cellSize / 2,
          cellSize / 2
        );
      }
    });

    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-4 bg-black border border-[#00ffff]/30 p-6 relative">
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00ffff]" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00ffff]" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00ffff]" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00ffff]" />

      <div className="flex justify-between w-full font-mono">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-[#00ffff]/50 tracking-widest">DATA_COLLECTED</span>
          <span className="text-2xl font-bold text-[#00ffff]">{score.toString().padStart(3, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase text-[#ff00ff]/50 tracking-widest">PEAK_EFFICIENCY</span>
          <span className="text-2xl font-bold text-[#ff00ff]">{highScore.toString().padStart(3, '0')}</span>
        </div>
      </div>

      <div className="relative border border-[#00ffff]/20">
        <canvas
          ref={canvasRef}
          width={360}
          height={360}
          className="bg-black"
        />
        
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-10"
            >
              <div className="text-center p-8 border border-[#ff00ff]/50">
                {isGameOver ? (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-black text-[#ff00ff] glitch-text" data-text="CRITICAL_FAILURE">CRITICAL_FAILURE</h2>
                    <p className="text-[#00ffff]/60 text-xs uppercase tracking-widest">Neural_link_severed. Re-initialize?</p>
                    <button
                      onClick={resetGame}
                      className="flex items-center gap-2 mx-auto px-6 py-2 border border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-all uppercase text-xs font-bold"
                    >
                      <RefreshCw className="w-4 h-4" />
                      RE_INITIALIZE
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-black text-[#00ffff] glitch-text" data-text="LINK_SUSPENDED">LINK_SUSPENDED</h2>
                    <button
                      onClick={() => setIsPaused(false)}
                      className="flex items-center gap-2 mx-auto px-8 py-3 border border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all uppercase text-xs font-bold"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      RESUME_SIGNAL
                    </button>
                    <p className="text-[8px] text-white/30 uppercase tracking-[0.4em]">Waiting for transmission...</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-6 text-[8px] uppercase tracking-[0.3em] text-white/20">
        <span>[DIR_KEYS] NAVIGATION</span>
        <span>[SPACE] TOGGLE_LINK</span>
      </div>
    </div>
  );
}

