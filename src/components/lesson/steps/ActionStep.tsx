'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { useSound } from '@/hooks/useSound';
import type { Lesson } from '@/types';

interface ActionStepProps {
  lesson: Lesson;
  onComplete: (completed: boolean) => void;
}

export function ActionStep({ lesson, onComplete }: ActionStepProps) {
  const [timerState, setTimerState] = useState<'idle' | 'running' | 'paused' | 'done'>('idle');
  const [timeRemaining, setTimeRemaining] = useState(lesson.actionDurationSeconds);
  const { playSuccess, playTap, playCorrect, playWhoosh, playDing } = useSound();
  const soundPlayedRef = useRef(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerState === 'running' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimerState('done');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerState, timeRemaining]);

  // Play sound when timer completes
  useEffect(() => {
    if (timerState === 'done' && !soundPlayedRef.current) {
      soundPlayedRef.current = true;
      playSuccess();
    }
  }, [timerState, playSuccess]);

  const handleStartTimer = () => {
    playTap();
    playDing();
    setTimerState('running');
  };

  const handlePause = () => {
    playTap();
    setTimerState('paused');
  };

  const handleResume = () => {
    playTap();
    setTimerState('running');
  };

  const handleReset = () => {
    playTap();
    setTimeRemaining(lesson.actionDurationSeconds);
    setTimerState('idle');
    soundPlayedRef.current = false;
  };

  const handleComplete = (completed: boolean) => {
    if (completed) {
      playCorrect();
    }
    playWhoosh();
    onComplete(completed);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getActionIcon = () => {
    switch (lesson.actionType) {
      case 'write':
        return '✍️';
      case 'reflect':
        return '🧘';
      case 'observe':
        return '👁️';
      case 'breathe':
        return '🌬️';
      case 'act':
        return '⚡';
      default:
        return '🎯';
    }
  };

  const progress = ((lesson.actionDurationSeconds - timeRemaining) / lesson.actionDurationSeconds) * 100;

  return (
    <div className="text-center">
      {/* Action type indicator */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
        className="text-4xl mb-4"
      >
        {getActionIcon()}
      </motion.div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-sm font-medium text-indigo-400 mb-2"
      >
        Micro-Action
      </motion.p>

      {/* Action prompt */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg text-white mb-8 leading-relaxed"
      >
        {lesson.actionPrompt}
      </motion.p>

      {/* Timer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        {/* Circular progress */}
        <div className="relative w-40 h-40 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#27272a"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={440}
              strokeDashoffset={440 - (440 * progress) / 100}
              transition={{ duration: 0.5 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          {/* Time display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        {/* Timer controls */}
        <div className="flex items-center justify-center gap-4">
          {timerState === 'idle' && (
            <Button
              onClick={handleStartTimer}
              className="flex items-center gap-2"
            >
              <Play size={20} />
              Start Timer
            </Button>
          )}
          {timerState === 'running' && (
            <Button
              variant="secondary"
              onClick={handlePause}
              className="flex items-center gap-2"
            >
              <Pause size={20} />
              Pause
            </Button>
          )}
          {timerState === 'paused' && (
            <>
              <Button
                onClick={handleResume}
                className="flex items-center gap-2"
              >
                <Play size={20} />
                Resume
              </Button>
              <Button
                variant="ghost"
                onClick={handleReset}
              >
                <RotateCcw size={20} />
              </Button>
            </>
          )}
          {timerState === 'done' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 text-emerald-400"
            >
              <CheckCircle size={24} />
              <span className="font-medium">Time complete!</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Completion buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <Button
          size="lg"
          onClick={() => handleComplete(true)}
          className="w-full"
          disabled={timerState === 'idle'}
        >
          I did it
        </Button>
        <button
          onClick={() => handleComplete(false)}
          className="w-full text-zinc-500 hover:text-zinc-400 text-sm transition-colors py-2"
        >
          I couldn&apos;t do it this time (that&apos;s okay)
        </button>
      </motion.div>
    </div>
  );
}

export default ActionStep;
