"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

export interface SignaturePadHandle {
  clear: () => void;
  isEmpty: () => boolean;
  toDataUrl: () => string;
  drawText: (text: string) => void;
}

export const SignaturePad = forwardRef<SignaturePadHandle, { onChangeEmpty?: (empty: boolean) => void }>(
  ({ onChangeEmpty }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawing = useRef(false);
    const hasStrokes = useRef(false);
    const [, force] = useState(0);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.strokeStyle = "#e6ebf2";
        ctx.lineWidth = 2.2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }, []);

    function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
      const rect = canvasRef.current!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function start(e: React.PointerEvent<HTMLCanvasElement>) {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      drawing.current = true;
      const { x, y } = getPos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    function move(e: React.PointerEvent<HTMLCanvasElement>) {
      if (!drawing.current) return;
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      const { x, y } = getPos(e);
      ctx.lineTo(x, y);
      ctx.stroke();
      hasStrokes.current = true;
      onChangeEmpty?.(false);
    }

    function end() {
      drawing.current = false;
    }

    useImperativeHandle(ref, () => ({
      clear() {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (canvas && ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        hasStrokes.current = false;
        onChangeEmpty?.(true);
        force((n) => n + 1);
      },
      isEmpty() {
        return !hasStrokes.current;
      },
      toDataUrl() {
        return canvasRef.current?.toDataURL("image/png") ?? "";
      },
      drawText(text: string) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const cssWidth = canvas.width / dpr;
        const cssHeight = canvas.height / dpr;
        ctx.font = "italic 32px Georgia, 'Times New Roman', serif";
        ctx.fillStyle = "#e6ebf2";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, cssWidth / 2, cssHeight / 2);
        hasStrokes.current = text.trim().length > 0;
        onChangeEmpty?.(!hasStrokes.current);
      },
    }));

    return (
      <canvas
        ref={canvasRef}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        className="h-40 w-full touch-none rounded-lg border border-white/15 bg-base-800/50"
      />
    );
  }
);
SignaturePad.displayName = "SignaturePad";
