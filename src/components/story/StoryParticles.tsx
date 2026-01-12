'use client';

// ============================================================================
// STORY PARTICLES
// Cinematic particle effects that bring emotional depth to each slide.
// Particles respond to the mood and create an immersive atmosphere.
// ============================================================================

import React, { useEffect, useRef, useCallback, memo } from 'react';

type ParticleMood = 'ethereal' | 'celebration' | 'contemplative' | 'ascension' | 'warmth' | 'breakthrough';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  opacitySpeed: number;
  hue: number;
  saturation: number;
  lightness: number;
  life: number;
  maxLife: number;
  pulse: number;
  pulseSpeed: number;
}

interface StoryParticlesProps {
  mood: ParticleMood;
  intensity?: 'subtle' | 'medium' | 'intense';
  paused?: boolean;
}

const MOOD_CONFIG: Record<ParticleMood, {
  baseHue: number;
  hueVariation: number;
  saturation: number;
  lightness: number;
  particleCount: number;
  sizeRange: [number, number];
  speedRange: [number, number];
  drift: 'up' | 'down' | 'float' | 'radiate';
  glow: boolean;
}> = {
  ethereal: {
    baseHue: 240,
    hueVariation: 40,
    saturation: 60,
    lightness: 70,
    particleCount: 60,
    sizeRange: [2, 6],
    speedRange: [0.2, 0.8],
    drift: 'float',
    glow: true
  },
  celebration: {
    baseHue: 45,
    hueVariation: 60,
    saturation: 80,
    lightness: 65,
    particleCount: 80,
    sizeRange: [2, 5],
    speedRange: [0.5, 1.5],
    drift: 'radiate',
    glow: true
  },
  contemplative: {
    baseHue: 210,
    hueVariation: 20,
    saturation: 40,
    lightness: 60,
    particleCount: 30,
    sizeRange: [3, 8],
    speedRange: [0.1, 0.3],
    drift: 'float',
    glow: true
  },
  ascension: {
    baseHue: 150,
    hueVariation: 30,
    saturation: 70,
    lightness: 60,
    particleCount: 50,
    sizeRange: [2, 5],
    speedRange: [0.3, 1.0],
    drift: 'up',
    glow: true
  },
  warmth: {
    baseHue: 30,
    hueVariation: 20,
    saturation: 70,
    lightness: 60,
    particleCount: 40,
    sizeRange: [4, 10],
    speedRange: [0.1, 0.4],
    drift: 'float',
    glow: true
  },
  breakthrough: {
    baseHue: 280,
    hueVariation: 50,
    saturation: 75,
    lightness: 70,
    particleCount: 100,
    sizeRange: [1, 4],
    speedRange: [1, 3],
    drift: 'radiate',
    glow: true
  }
};

const INTENSITY_MULTIPLIER = {
  subtle: 0.5,
  medium: 1,
  intense: 1.5
};

function StoryParticlesComponent({ mood, intensity = 'medium', paused = false }: StoryParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const centerRef = useRef({ x: 0, y: 0 });

  const createParticle = useCallback((config: typeof MOOD_CONFIG[ParticleMood], width: number, height: number): Particle => {
    const intensityMult = INTENSITY_MULTIPLIER[intensity];
    let x = Math.random() * width;
    let y = Math.random() * height;
    let speedX = 0;
    let speedY = 0;

    const baseSpeed = config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]);

    switch (config.drift) {
      case 'up':
        speedY = -baseSpeed * intensityMult;
        speedX = (Math.random() - 0.5) * 0.5;
        y = height + 20;
        break;
      case 'down':
        speedY = baseSpeed * intensityMult;
        speedX = (Math.random() - 0.5) * 0.5;
        y = -20;
        break;
      case 'float':
        speedX = (Math.random() - 0.5) * baseSpeed * 0.5;
        speedY = (Math.random() - 0.5) * baseSpeed * 0.5;
        break;
      case 'radiate':
        const angle = Math.random() * Math.PI * 2;
        speedX = Math.cos(angle) * baseSpeed * intensityMult;
        speedY = Math.sin(angle) * baseSpeed * intensityMult;
        x = centerRef.current.x;
        y = centerRef.current.y;
        break;
    }

    const size = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]);
    const maxLife = 200 + Math.random() * 300;

    return {
      x,
      y,
      size,
      speedX,
      speedY,
      opacity: 0,
      opacitySpeed: 0.01 + Math.random() * 0.02,
      hue: config.baseHue + (Math.random() - 0.5) * config.hueVariation,
      saturation: config.saturation + (Math.random() - 0.5) * 20,
      lightness: config.lightness + (Math.random() - 0.5) * 15,
      life: 0,
      maxLife,
      pulse: 0,
      pulseSpeed: 0.02 + Math.random() * 0.03
    };
  }, [intensity]);

  const initializeParticles = useCallback((config: typeof MOOD_CONFIG[ParticleMood], width: number, height: number) => {
    const count = Math.floor(config.particleCount * INTENSITY_MULTIPLIER[intensity]);
    particlesRef.current = Array.from({ length: count }, () => {
      const particle = createParticle(config, width, height);
      // Randomize initial life so they don't all appear at once
      particle.life = Math.random() * particle.maxLife * 0.5;
      particle.opacity = Math.sin((particle.life / particle.maxLife) * Math.PI) * 0.6;
      return particle;
    });
  }, [intensity, createParticle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config = MOOD_CONFIG[mood];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      centerRef.current = { x: rect.width / 2, y: rect.height / 2 };
    };

    resize();
    window.addEventListener('resize', resize);

    initializeParticles(config, canvas.width, canvas.height);

    const animate = () => {
      if (paused) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Update particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.life += 1;
        particle.pulse += particle.pulseSpeed;

        // Calculate opacity based on life (fade in, sustain, fade out)
        const lifeRatio = particle.life / particle.maxLife;
        if (lifeRatio < 0.2) {
          particle.opacity = (lifeRatio / 0.2) * 0.6;
        } else if (lifeRatio > 0.8) {
          particle.opacity = ((1 - lifeRatio) / 0.2) * 0.6;
        }

        // Add subtle pulse
        const pulseFactor = 1 + Math.sin(particle.pulse) * 0.15;
        const size = particle.size * pulseFactor;

        // Draw particle with glow
        if (config.glow) {
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, size * 3
          );
          gradient.addColorStop(0, `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%, ${particle.opacity})`);
          gradient.addColorStop(0.4, `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%, ${particle.opacity * 0.4})`);
          gradient.addColorStop(1, `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%, 0)`);

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size * 3, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Core particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%, ${particle.opacity})`;
        ctx.fill();

        // Respawn if dead or out of bounds
        const rect = canvas.getBoundingClientRect();
        if (
          particle.life > particle.maxLife ||
          particle.x < -50 || particle.x > rect.width + 50 ||
          particle.y < -50 || particle.y > rect.height + 50
        ) {
          particlesRef.current[index] = createParticle(config, rect.width, rect.height);
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mood, intensity, paused, createParticle, initializeParticles]);

  // Trigger burst effect (can be called externally)
  const burst = useCallback((x?: number, y?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const config = MOOD_CONFIG[mood];
    const rect = canvas.getBoundingClientRect();
    const burstX = x ?? rect.width / 2;
    const burstY = y ?? rect.height / 2;

    centerRef.current = { x: burstX, y: burstY };

    // Add burst particles
    const burstCount = 30;
    for (let i = 0; i < burstCount; i++) {
      const particle = createParticle({ ...config, drift: 'radiate' }, rect.width, rect.height);
      particle.x = burstX;
      particle.y = burstY;
      const angle = (i / burstCount) * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      particle.speedX = Math.cos(angle) * speed;
      particle.speedY = Math.sin(angle) * speed;
      particle.size *= 1.5;
      particle.maxLife = 100 + Math.random() * 100;
      particlesRef.current.push(particle);
    }
  }, [mood, createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

// Memoize to prevent unnecessary re-renders
export const StoryParticles = memo(StoryParticlesComponent);

// Type for external control
export type ParticleController = {
  burst: (x?: number, y?: number) => void;
};
