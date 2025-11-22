import React, { useState, useEffect, useRef } from "react";
import { X, SwitchCamera } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

export const CameraCapture = ({ onCapture, onClose }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [error, setError] = useState("");
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        });

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setError("");
      } catch (err) {
        console.error(err);
        if (mounted) setError("Gagal mengakses kamera");
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
      <div className="relative flex-1 bg-black overflow-hidden">
        {error ? (
          <div className="flex items-center justify-center h-full text-white">
            {error}
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full z-20"
        >
          <X size={24} />
        </button>
      </div>

      <div className="h-32 bg-black flex items-center justify-around px-8 pb-8 pt-4">
        <button
          type="button"
          onClick={() =>
            setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
          }
          className="p-4 bg-gray-800 rounded-full text-white active:scale-95 transition-transform"
        >
          <SwitchCamera size={24} />
        </button>
        <button
          type="button"
          onClick={handleCapture}
          className="p-1 rounded-full border-4 border-white active:scale-95 transition-transform"
        >
          <div className="w-16 h-16 bg-white rounded-full" />
        </button>
        <div className="w-14" />
      </div>
    </div>
  );
};
