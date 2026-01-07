// Components/SmartDocumentPicker.jsx
import React, { useState, useRef, useEffect } from "react";
import CropModal from "./CropModal";

export default function SmartDocumentPicker({ label, file, onChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const inputRef = useRef();

  // Open file picker
  const handlePickFile = () => {
    inputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Use object URL for instant preview
    const objectUrl = URL.createObjectURL(selectedFile);
    setImageSrc(objectUrl);
    setIsModalOpen(true);

    // Clean up URL after modal closes to avoid memory leaks
    const cleanup = () => URL.revokeObjectURL(objectUrl);
    setTimeout(cleanup, 5000); // revoke after 5 seconds or handle in onClose
  };

  // Handle camera capture
  const handleTakePhoto = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera not supported on this device.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      const capture = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) return;
          const photoFile = new File([blob], "photo.jpg", { type: "image/jpeg" });
          const objectUrl = URL.createObjectURL(photoFile);
          setImageSrc(objectUrl);
          setIsModalOpen(true);
          onChange(photoFile);
        }, "image/jpeg", 0.95);

        stream.getTracks().forEach((track) => track.stop());
      };

      setTimeout(capture, 1000); // quick warm-up
    } catch (err) {
      console.error(err);
      alert("Could not access camera.");
    }
  };

  const handleCropComplete = (croppedFile) => {
    onChange(croppedFile); // send cropped file to parent
    setIsModalOpen(false);
  };

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (imageSrc && typeof imageSrc === "string") URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePickFile}
          className="px-4 py-2 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition"
        >
          Upload
        </button>

        <button
          type="button"
          onClick={handleTakePhoto}
          className="px-4 py-2 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition"
        >
          Scan / Camera
        </button>

        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="h-16 w-16 object-cover rounded"
          />
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <CropModal
        isOpen={isModalOpen}
        imageSrc={imageSrc}
        onClose={() => setIsModalOpen(false)}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
