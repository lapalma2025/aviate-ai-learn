import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface VideoPlayerProps {
	src: string;
}

export const VideoPlayer = ({ src }: VideoPlayerProps) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);

	const togglePlay = () => {
		if (videoRef.current) {
			if (isPlaying) {
				videoRef.current.pause();
			} else {
				videoRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	const toggleMute = () => {
		if (videoRef.current) {
			videoRef.current.muted = !isMuted;
			setIsMuted(!isMuted);
		}
	};

	const toggleFullscreen = () => {
		if (videoRef.current) {
			if (document.fullscreenElement) {
				document.exitFullscreen();
			} else {
				videoRef.current.requestFullscreen();
			}
		}
	};

	return (
		<div className="relative group">
			<video
				ref={videoRef}
				className="w-full h-full object-cover"
				style={{ aspectRatio: "16/9", objectPosition: "20% center" }}
				onClick={togglePlay}
				onEnded={() => setIsPlaying(false)}
			>
				<source src={src} type="video/mp4" />
				Twoja przeglądarka nie obsługuje odtwarzania wideo.
			</video>

			{/* Custom Controls */}
			<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

			<div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
				<Button
					size="icon"
					variant="secondary"
					className="bg-background/80 backdrop-blur-sm hover:bg-background hover:scale-110 transition-all"
					onClick={togglePlay}
				>
					{isPlaying ? (
						<Pause className="h-5 w-5" />
					) : (
						<Play className="h-5 w-5 ml-0.5" />
					)}
				</Button>

				<Button
					size="icon"
					variant="secondary"
					className="bg-background/80 backdrop-blur-sm hover:bg-background hover:scale-110 transition-all"
					onClick={toggleMute}
				>
					{isMuted ? (
						<VolumeX className="h-5 w-5" />
					) : (
						<Volume2 className="h-5 w-5" />
					)}
				</Button>

				<div className="flex-1" />

				<Button
					size="icon"
					variant="secondary"
					className="bg-background/80 backdrop-blur-sm hover:bg-background hover:scale-110 transition-all"
					onClick={toggleFullscreen}
				>
					<Maximize className="h-5 w-5" />
				</Button>
			</div>

			{!isPlaying && (
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div className="w-20 h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-2xl animate-pulse">
						<Play className="h-10 w-10 text-primary-foreground ml-1" />
					</div>
				</div>
			)}
		</div>
	);
};
