export const getCroppedImg = async (imageSrc, pixelCrop) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous"; // ensure no CORS issues
        image.src = imageSrc;

        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;
            const ctx = canvas.getContext("2d");

            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            );

            canvas.toBlob((blob) => {
                if (!blob) return reject(new Error("Canvas is empty"));
                // Directly create the File object here

               
                const file = new File([blob], "profile_photo.jpg", {
                    type: "image/jpeg",
                });
                resolve(file);
            }, "image/jpeg");
            
        };

        image.onerror = (err) => {

            console.error("failed to load image:", err);
            reject(new Error("Failed to load image"));
        } 
    });
};
