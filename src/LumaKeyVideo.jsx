import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

/**
 * LumaKeyVideo
 * ------------
 * Renders a video onto a <canvas> removing dark/black backgrounds via luma key.
 * Uses requestVideoFrameCallback (with RAF fallback) so we only process pixels
 * when the video actually delivers a new frame — much smoother result.
 *
 * Props:
 *  - src          : video URL / import
 *  - threshold    : max luma treated as fully transparent   (default 40)
 *  - feather      : transition range above threshold         (default 60)
 *  - playbackRate : video speed multiplier                  (default 1)
 *  - className    : forwarded to <canvas>
 *  - style        : forwarded to <canvas>
 */
const LumaKeyVideo = forwardRef(function LumaKeyVideo(
  { src, threshold = 40, feather = 60, playbackRate = 1, scrub = false, className = '', style = {} },
  ref
) {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const frameRef  = useRef(null);

  useImperativeHandle(ref, () => videoRef.current, []);

  useEffect(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const SCALE = 0.75;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    function processFrame() {
      if (video.readyState < 2) return;

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (vw === 0 || vh === 0) return;

      const dw = Math.round((canvas.offsetWidth  || vw)  * SCALE);
      const dh = Math.round((canvas.offsetHeight || vh)  * SCALE);

      const videoAspect   = vw / vh;
      const displayAspect = dw / dh;
      let drawW, drawH, drawX, drawY;

      if (displayAspect > videoAspect) {
        drawH = dh;  drawW = dh * videoAspect;
        drawX = (dw - drawW) / 2;  drawY = 0;
      } else {
        drawW = dw;  drawH = dw / videoAspect;
        drawX = 0;   drawY = (dh - drawH) / 2;
      }

      canvas.width  = dw;
      canvas.height = dh;
      ctx.clearRect(0, 0, dw, dh);
      ctx.drawImage(video, drawX, drawY, drawW, drawH);

      const imageData = ctx.getImageData(0, 0, dw, dh);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;

        if (luma <= threshold) {
          data[i + 3] = 0;
        } else if (luma <= threshold + feather) {
          const t = (luma - threshold) / feather;
          data[i + 3] = Math.round(t * t * (3 - 2 * t) * 255);
        }
      }

      ctx.putImageData(imageData, 0, 0);
    }

    const hasRVFC = typeof video.requestVideoFrameCallback === 'function' && !scrub;

    function scheduleNext() {
      if (hasRVFC) {
        frameRef.current = video.requestVideoFrameCallback(onFrame);
      } else {
        frameRef.current = requestAnimationFrame(onFrame);
      }
    }

    function cancelFrame() {
      if (frameRef.current == null) return;
      if (hasRVFC) {
        video.cancelVideoFrameCallback(frameRef.current);
      } else {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = null;
    }

    function onFrame() {
      processFrame();
      scheduleNext();
    }

    const handleReady = () => {
      if (scrub) {
        video.pause();
      } else {
        video.playbackRate = playbackRate;
        video.play().catch(() => {});
      }
      scheduleNext();
    };

    video.addEventListener('canplay', handleReady);
    if (video.readyState >= 3) handleReady();

    return () => {
      video.removeEventListener('canplay', handleReady);
      cancelFrame();
    };
  }, [src, threshold, feather, playbackRate, scrub]);

  return (
    <>
      {/* Hidden video element drives the canvas */}
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        preload="auto"
        style={{ display: 'none' }}
      />
      {/* Canvas: browser upscales from SCALE buffer → naturally smooth edges */}
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          background: 'transparent',
          imageRendering: 'auto',
          ...style,
        }}
      />
    </>
  );
});

export default LumaKeyVideo;
