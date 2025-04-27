import { motion } from "framer-motion";
import { X, Camera } from "lucide-react";
import { RefObject } from "react";

type PhotoFilter = "none" | "birthday" | "vintage" | "party";

interface PhotoBoothModalProps {
    videoStreamRef: RefObject<HTMLVideoElement>;
    canvasPhotoRef: RefObject<HTMLCanvasElement>;
    cameraReady: boolean;
    photoFilter: PhotoFilter;
    onSetPhotoFilter: (filter: PhotoFilter) => void;
    onTakePhoto: () => void;
    onClose: () => void;
}

export default function PhotoBoothModal({
    videoStreamRef,
    canvasPhotoRef,
    cameraReady,
    photoFilter,
    onSetPhotoFilter,
    onTakePhoto,
    onClose,
}: PhotoBoothModalProps) {
    return (
        <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="bg-white rounded-2xl shadow-2xl p-6 max-w-3xl w-full relative"
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                    <X size={24} />
                </button>

                <h3 className="text-2xl font-bold text-center mb-4 text-pink-600 font-dancing">Birthday Photo Booth</h3>

                <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-4">
                    <video ref={videoStreamRef} className="w-full h-full object-cover" autoPlay playsInline muted></video>
                    <canvas ref={canvasPhotoRef} className="hidden"></canvas>

                    {!cameraReady && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                            <div className="text-center">
                                <div className="inline-block w-8 h-8 border-4 border-t-pink-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-2"></div>
                                <p>Camera is initializing...</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-3 justify-center mb-4">
                    <button onClick={() => onSetPhotoFilter("none")} className={`px-4 py-2 rounded-full font-medium transition-colors ${ photoFilter === "none" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300" }`} disabled={!cameraReady} > No Filter </button>
                    <button onClick={() => onSetPhotoFilter("birthday")} className={`px-4 py-2 rounded-full font-medium transition-colors ${ photoFilter === "birthday" ? "bg-pink-500 text-white" : "bg-pink-100 text-pink-700 hover:bg-pink-200" }`} disabled={!cameraReady} > Birthday Filter </button>
                    <button onClick={() => onSetPhotoFilter("vintage")} className={`px-4 py-2 rounded-full font-medium transition-colors ${ photoFilter === "vintage" ? "bg-amber-500 text-white" : "bg-amber-100 text-amber-700 hover:bg-amber-200" }`} disabled={!cameraReady} > Vintage Filter </button>
                    <button onClick={() => onSetPhotoFilter("party")} className={`px-4 py-2 rounded-full font-medium transition-colors ${ photoFilter === "party" ? "bg-purple-500 text-white" : "bg-purple-100 text-purple-700 hover:bg-purple-200" }`} disabled={!cameraReady} > Party Filter </button>
                </div>

                <button
                    onClick={onTakePhoto}
                    className={`px-6 py-3 ${cameraReady ? "bg-pink-500 hover:bg-pink-600" : "bg-gray-400 cursor-not-allowed"} text-white rounded-full font-medium transition-colors mx-auto block`}
                    disabled={!cameraReady}
                >
                    <Camera className="inline-block mr-2" size={18} />
                    {cameraReady ? "Take Photo" : "Camera Initializing..."}
                </button>
            </motion.div>
        </motion.div>
    );
}