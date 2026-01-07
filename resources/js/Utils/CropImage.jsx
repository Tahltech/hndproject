
export const getCroppedImg = (imageSrc, pixelCrop) => {
    return new Promise((resolve, reject) => {
        const image = new Image();

        // IMPORTANT: only set crossOrigin for non-blob images
        if (!imageSrc.startsWith("blob:")) {
            image.crossOrigin = "anonymous";
        }

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

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error("Canvas is empty"));
                        return;
                    }

                    const file = new File(
                        [blob],
                        `document_${Date.now()}.jpg`,
                        { type: "image/jpeg" }
                    );

                    resolve(file); 
                },
                "image/jpeg",
                0.95
            );
        };

        image.onerror = () => reject(new Error("Failed to load image"));
        image.src = imageSrc;
    });
};
