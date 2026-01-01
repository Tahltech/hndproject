import React, { useState } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../Utils/CropImage";

export default function CropModal({ imageSrc, onClose, onCropComplete }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">
                    Crop Profile Photo
                </h3>

                <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={(_, croppedPixels) =>
                            setCroppedAreaPixels(croppedPixels)
                        }
                    />
                </div>

                <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(e.target.value)}
                    className="w-full"
                />

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={async () => {
                            const croppedBlob = await getCroppedImg(
                                imageSrc,
                                croppedAreaPixels
                            );
                            
                            const croppedFile = new File(
                                [croppedBlob],
                                "profile_photo.png",
                                { type: "image/png" }
                            );
                            
                            onCropComplete(croppedFile);
                        }}
                        className="px-4 py-2 rounded bg-[#3D37FF] text-white hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
