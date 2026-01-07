// Components/CropModal.jsx
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import Modal from "./Modal";
import { getCroppedImg } from "../Utils/CropImage";

export default function CropModal({
    isOpen,
    onClose,
    imageSrc,
    onCropComplete,
}) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const handleCropComplete = useCallback((_, croppedAreaPx) => {
        setCroppedAreaPixels(croppedAreaPx);
    }, []);

    const handleConfirm = async () => {
        try {
            const croppedFile = await getCroppedImg(
                imageSrc,
                croppedAreaPixels
            );
            onCropComplete(croppedFile);
            onClose();
        } catch (err) {
            console.error("Crop failed:", err);
            alert("Failed to crop image. Please try again.");
        }
    };

    if (!isOpen || !imageSrc) return null;

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-center">
                    Crop Document
                </h2>

                <div className="relative w-full h-80 bg-gray-100 rounded-xl overflow-hidden">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={handleCropComplete}
                    />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm">Zoom</label>
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.01}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                        />
                    </div>

                    <div className="flex gap-2">
                        <button className="btn btn-outline" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={handleConfirm}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
