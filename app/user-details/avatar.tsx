import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { type Area } from 'react-easy-crop';
import { getCroppedImage } from '../utils/cropper';
import Loading from '../components/loading';

interface AvatarUploaderProps {
    userProfilePic: 'loading' | string | undefined;
    onImageChanged: (croppedBlob: Blob) => void;
}

export default function Avatar({ userProfilePic, onImageChanged }: AvatarUploaderProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [cropping, setCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const imageChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageSrc(URL.createObjectURL(file));
            setCropping(true);
        }
    };

    const handleCropComplete = (_: Area, croppedArea: Area) => {
        setCroppedAreaPixels(croppedArea);
    };

    const finishCropping = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        try {
            const croppedBlob = await getCroppedImage(imageSrc, croppedAreaPixels);
            onImageChanged(croppedBlob);
        } catch (err) {
            console.error('Cropping failed', err);
        } finally {
            setCropping(false);
            setImageSrc(null);
        }
    };

    return (
        <>
            <div
                className={`avatar flex flex-col justify-center me-3 min-h-[140px] ${userProfilePic === 'loading' || !userProfilePic ? 'avatar-placeholder' : ''}`}
            >
                <label
                    htmlFor={cropping ? undefined : 'profile-picture'}
                    className={`w-[140px] h-[140px]  rounded-full m-auto cursor-pointer relative group overflow-hidden text-black ${userProfilePic === 'loading' || !userProfilePic ? 'bg-base-100' : ''}`}
                >
                    {/* Image states */}
                    {userProfilePic === 'loading' && <Loading />}
                    {!userProfilePic && <div className="text-l w-[140px] h-[140px] flex justify-center items-center text-center">No Badge!</div>}
                    {userProfilePic && userProfilePic !== 'loading' && (
                        <img src={userProfilePic} className="aspect-square w-full h-full object-cover" />
                    )}

                    {/* Cropper overlay */}
                    {cropping && imageSrc && (
                        <div className="absolute inset-0 z-50 bg-black/80">
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
                    )}

                    {/* Hover effect */}
                    <div className="absolute top-[100%] w-full h-full text-center bg-neutral/30 transition-all duration-150 ease-out backdrop-blur-xs text-white flex items-center justify-center group-hover:top-0">
                        <i className="">Change<br />Picture</i>
                    </div>
                </label>

                <input
                    onChange={(e) => {
                        e.preventDefault();
                        imageChangeHandler(e)
                    }}
                    type="file"
                    accept="image/png, image/jpeg"
                    id="profile-picture"
                    className="hidden"
                />
            </div>
            {cropping && (
                <div className="flex flex-col items-center mt-4 w-full max-w-xs">
                    <input
                        type="range"
                        min={1}
                        max={5}
                        step={0.01}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="range range-info"
                    />
                    <p className='text-info mt-2 mb-4 '>Zoom and crop</p>
                </div>
            )}

            {cropping && (
                <div className="flex justify-center gap-4">
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            setCropping(false)
                        }}
                        className="btn btn-error"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            finishCropping()
                        }}
                        className="btn btn-primary"
                    >
                        Save
                    </button>
                </div>
            )}
        </>
    );
};
