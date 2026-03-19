import { type Area } from 'react-easy-crop'

const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = url;
        image.onload = () => resolve(image);
        image.onerror = (err) => reject(err);
    });

export const getCroppedImage = async (
    imageSrc: string,
    pixelCrop: Area,
    imageType: string
): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Failed to get 2D context');

    const scale = Math.min(
        1000 / pixelCrop.width,
        1000 / pixelCrop.height,
        1
    );

    const outputWidth = pixelCrop.width * scale;
    const outputHeight = pixelCrop.height * scale;

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        outputWidth,
        outputHeight
    );

    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas is empty'));
        }, imageType === 'image/png' ? 'image/png' : 'image/jpeg', 90);
    });
};