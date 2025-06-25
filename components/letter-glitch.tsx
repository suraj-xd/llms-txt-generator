import React, { useRef, useEffect, FC } from "react";

interface ComponentProps {
  glitchColors?: string[];
  glitchSpeed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  smooth?: boolean;
}

export const Component: FC<ComponentProps> = ({
  glitchColors = ["#2b4539", "#61dca3", "#61b3dc"],
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const letters = useRef<
    {
      char: string;
      color: string;
      targetColor: string;
      colorProgress: number;
    }[]
  >([]);
  const grid = useRef({ columns: 0, rows: 0 });
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const lastGlitchTime = useRef(Date.now());

  const fontSize = 16;
  const charWidth = 10;
  const charHeight = 20;

  const lettersAndSymbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-=_+[]{}<>,0123456789".split('');

  const getRandomChar = () => {
    return lettersAndSymbols[
      Math.floor(Math.random() * lettersAndSymbols.length)
    ];
  };

  const getRandomColor = () => {
    return glitchColors[Math.floor(Math.random() * glitchColors.length)];
  };

  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const interpolateColor = (
    start: { r: number; g: number; b: number },
    end: { r: number; g: number; b: number },
    factor: number
  ) => {
    const r = Math.round(start.r + (end.r - start.r) * factor);
    const g = Math.round(start.g + (end.g - start.g) * factor);
    const b = Math.round(start.b + (end.b - start.b) * factor);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const calculateGrid = (width: number, height: number) => {
    const columns = Math.ceil(width / charWidth);
    const rows = Math.ceil(height / charHeight);
    return { columns, rows };
  };

  const initializeLetters = (columns: number, rows: number) => {
    grid.current = { columns, rows };
    const totalLetters = columns * rows;
    letters.current = Array.from({ length: totalLetters }, () => ({
      char: getRandomChar(),
      color: getRandomColor(),
      targetColor: getRandomColor(),
      colorProgress: 1,
    }));
  };

  const drawLetters = () => {
    const canvas = canvasRef.current;
    const ctx = context.current;
    if (!canvas || !ctx || letters.current.length === 0) return;
    
    const { width, height } = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";

    for (let i = 0; i < letters.current.length; i++) {
      const letterData = letters.current[i];
      const x = (i % grid.current.columns) * charWidth;
      const y = Math.floor(i / grid.current.columns) * charHeight;
      ctx.fillStyle = letterData.color;
      ctx.fillText(letterData.char, x, y);
    }
  };
  
  const resizeCanvasAndDraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    if (context.current) {
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const { columns, rows } = calculateGrid(rect.width, rect.height);
    initializeLetters(columns, rows);
    drawLetters();
  };


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    context.current = canvas.getContext("2d");
    
    const updateLettersLocal = () => {
        if (!letters.current || letters.current.length === 0) return;
        const updateCount = Math.max(1, Math.floor(letters.current.length * 0.05));
        for (let i = 0; i < updateCount; i++) {
          const index = Math.floor(Math.random() * letters.current.length);
          if (!letters.current[index]) continue;
          letters.current[index].char = getRandomChar();
          letters.current[index].targetColor = getRandomColor();
          if (!smooth) {
            letters.current[index].color = letters.current[index].targetColor;
            letters.current[index].colorProgress = 1;
          } else {
            letters.current[index].colorProgress = 0;
          }
        }
    };

    const handleSmoothTransitionsLocal = () => {
        let needsRedraw = false;
        letters.current.forEach((letter) => {
          if (letter.colorProgress < 1) {
            letter.colorProgress += 0.05; 
            if (letter.colorProgress > 1) letter.colorProgress = 1;
            const startRgb = hexToRgb(letter.color);
            const endRgb = hexToRgb(letter.targetColor);
            if (startRgb && endRgb) {
              letter.color = interpolateColor(startRgb,endRgb,letter.colorProgress);
              needsRedraw = true;
            }
          }
        });
        if (needsRedraw) {
          drawLetters();
        }
    };

    const animate = () => {
      const now = Date.now();
      if (now - lastGlitchTime.current >= glitchSpeed) {
        updateLettersLocal();
        drawLetters();
        lastGlitchTime.current = now;
      }
      if (smooth) {
        handleSmoothTransitionsLocal();
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    
    resizeCanvasAndDraw();
    animationRef.current = requestAnimationFrame(animate);

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        resizeCanvasAndDraw();
        animationRef.current = requestAnimationFrame(animate);
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [glitchSpeed, smooth, glitchColors]);

  const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    backgroundColor: "#000000",
    overflow: "hidden",
  };

  const canvasStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    height: "100%",
  };

  const outerVignetteStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    background: "radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 100%)",
  };

  const centerVignetteStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    background: "radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)",
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black overflow-hidden grayscale opacity-15" style={containerStyle}>
      <canvas ref={canvasRef} style={canvasStyle} />
      {outerVignette && <div style={outerVignetteStyle}></div>}
      {centerVignette && <div style={centerVignetteStyle}></div>}
    </div>
  );
};