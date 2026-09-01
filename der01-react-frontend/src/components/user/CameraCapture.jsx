import React from "react";
import { useEffect, useState } from "react";
import { Camera, RotateCcw } from "lucide-react";
import { useCamera } from "../../hooks/useCamera";

export function CameraCapture({ onCaptured }) {
  const { videoRef, startCamera, capture, stopCamera, error } = useCamera();
  const [started, setStarted] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    startCamera().then(() => setStarted(true));
    return () => stopCamera();
  }, []);

  async function takePhoto() {
    try {
      const blob = await capture();
      const url = URL.createObjectURL(blob);
      setPreview(url);
      onCaptured({ blob, url });
      stopCamera();
    } catch (e) {}
  }

  function retake() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    onCaptured(null);
    startCamera().then(() => setStarted(true));
  }

  if (preview) {
    return (
      <div className="camera-card">
        <img className="captured-photo" src={preview} alt="Captured disaster evidence" />
        <button className="btn btn-outline btn-full" onClick={retake}><RotateCcw size={18} /> Retake photo</button>
      </div>
    );
  }

  return (
    <div className="camera-card">
      {error ? (
        <div className="camera-error">
          <Camera size={34} />
          <strong>Camera unavailable</strong>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => startCamera()}>Try camera again</button>
        </div>
      ) : (
        <>
          <video ref={videoRef} className="camera-video" playsInline muted />
          <div className="camera-overlay">
            <span>Keep the hazard clearly visible</span>
            <button className="capture-button" onClick={takePhoto} aria-label="Capture photo"><Camera size={30} /></button>
          </div>
        </>
      )}
    </div>
  );
}
