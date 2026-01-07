import { useState } from "react";
import CropModal from "./CropModal";

export default function MediaPicker({ label, onChange }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [showCrop, setShowCrop] = useState(false);

    const handleSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result);
            setShowCrop(true);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-2">
            <label className="font-medium">{label}</label>

            <label className="card p-4 border-dashed cursor-pointer text-center">
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleSelect}
                />
                <p className="text-sm text-muted">
                    Click to upload or use camera
                </p>
            </label>

            {showCrop && (
                <CropModal
                    imageSrc={imageSrc}
                    onCancel={() => setShowCrop(false)}
                    onSave={(file) => {
                        onChange(file);
                        setShowCrop(false);
                    }}
                />
            )}
        </div>
    );
}
