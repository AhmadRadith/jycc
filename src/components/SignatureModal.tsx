import React, { useEffect, useRef } from 'react';

type SignatureModalProps = {
  isOpen: boolean;
  title?: string;
  description?: string;
  onCancel: () => void;
  onSigned: (payload: { dataUrl: string }) => void;
};

const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  title = 'Tambahkan Tanda Tangan',
  description = 'Gunakan bidang di bawah ini untuk menandatangani secara digital sebelum melanjutkan.',
  onCancel,
  onSigned,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<any | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const anyWindow = window as any;
    const SignaturePadImpl = anyWindow.SignaturePad;

    if (!SignaturePadImpl) {
      return undefined;
    }

    const resizeCanvas = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const rect = canvas.getBoundingClientRect();
      const context = canvas.getContext('2d');

      if (!context) {
        return;
      }

      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);
    };

    resizeCanvas();

    const pad = new SignaturePadImpl(canvas, {
      penColor: '#111111',
      backgroundColor: 'rgba(0,0,0,0)',
      minWidth: 0.5,
      maxWidth: 3,
    });

    padRef.current = pad;

    const handleResize = () => {
      const snapshot = pad.toData();
      resizeCanvas();
      pad.clear();
      if (snapshot && snapshot.length) {
        pad.fromData(snapshot);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      padRef.current = null;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleClear = () => {
    if (padRef.current) {
      padRef.current.clear();
    }
  };

  const handleUseSignature = () => {
    if (!padRef.current || padRef.current.isEmpty()) {
      alert('Silakan buat tanda tangan terlebih dahulu.');
      return;
    }
    const dataUrl = padRef.current.toDataURL('image/png');
    onSigned({ dataUrl });
  };

  const handleBackdropClick = () => {
    onCancel();
  };

  const handleCardClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
  };

  return (
    <>
      <div
        className="sig-modal"
        aria-hidden={!isOpen}
        onClick={handleBackdropClick}
      >
        <div
          className="sig-modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sig-modal-title"
          onClick={handleCardClick}
        >
          <div className="sig-modal-header">
            <div className="sig-modal-title" id="sig-modal-title">
              {title}
            </div>
            <button
              type="button"
              className="sig-btn ghost"
              onClick={onCancel}
              title="Tutup"
            >
              ✕
            </button>
          </div>

          <div className="sig-canvas-wrap">
            <p className="sig-description">{description}</p>
            <canvas ref={canvasRef} className="sig-canvas" />
          </div>

          <div className="sig-modal-footer">
            <div className="sig-controls">
              <button
                type="button"
                className="sig-btn"
                onClick={handleClear}
              >
                Hapus
              </button>
              <div className="sig-spacer" />
              <button
                type="button"
                className="sig-btn ghost"
                onClick={onCancel}
              >
                Batal
              </button>
              <button
                type="button"
                className="sig-btn primary"
                onClick={handleUseSignature}
              >
                Gunakan Tanda Tangan
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sig-modal {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          background: rgba(15, 23, 42, 0.45);
          z-index: 9999;
          padding: 16px;
        }
        .sig-modal-card {
          background: #ffffff;
          border-radius: 18px;
          width: min(720px, 92vw);
          max-height: 90vh;
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.25);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .sig-modal-header,
        .sig-modal-footer {
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e2e8f0;
        }
        .sig-modal-footer {
          border-top: 1px solid #e2e8f0;
          border-bottom: none;
        }
        .sig-modal-title {
          font-weight: 600;
          font-size: 15px;
          color: #1e293b;
        }
        .sig-canvas-wrap {
          padding: 16px;
          background: #f1f5f9;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }
        .sig-description {
          margin: 0 0 8px;
          font-size: 13px;
          color: #475569;
        }
        .sig-canvas {
          display: block;
          width: 100%;
          height: 260px;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid #cbd5f5;
          touch-action: none;
        }
        .sig-controls {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
          width: 100%;
        }
        .sig-spacer {
          flex: 1;
        }
        .sig-btn {
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid #cbd5f5;
          background: #ffffff;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          color: #1e293b;
          transition: background 0.15s ease, transform 0.15s ease,
            box-shadow 0.15s ease;
        }
        .sig-btn:hover {
          background: #f8fafc;
          transform: translateY(-0.5px);
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
        }
        .sig-btn.primary {
          background: #2563eb;
          border-color: #2563eb;
          color: #f9fafb;
        }
        .sig-btn.primary:hover {
          background: #1d4ed8;
        }
        .sig-btn.ghost {
          background: #f8fafc;
        }
        .sig-btn.ghost:hover {
          background: #e2e8f0;
        }
        @media (max-width: 640px) {
          .sig-canvas {
            height: 220px;
          }
        }
      `}</style>
    </>
  );
};

export default SignatureModal;

