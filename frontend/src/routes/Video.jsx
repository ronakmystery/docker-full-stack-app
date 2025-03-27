import React from 'react'
import { useState, useRef, useEffect } from "react";

function Video() {

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
  
    let width = 512;
  
    useEffect(() => {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        videoRef.current.srcObject = stream;
      });
  
      const interval = setInterval(() => {
        if (!canvasRef.current || !videoRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0, width, width);
        canvasRef.current.toBlob((blob) => {
          const formData = new FormData();
          formData.append("frame", blob);
          fetch("/ai/video", {
            method: "POST",
            body: formData,
          });
        }, "image/jpeg");
      }, 5000); // every 500ms
  
      return () => clearInterval(interval);
    }, []);


  return (
    <div>
         <video ref={videoRef} autoPlay playsInline width={width} />
      <canvas ref={canvasRef} width={width} height={width} style={{ display: 'none' }} />
    
    </div>
  )
}

export default Video
