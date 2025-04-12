export default class Camera {
	constructor() {
		// Get video and canvas elements from the DOM
		this.video = document.getElementsByClassName("input_video")[0];
		this.canvas = document.getElementsByClassName("output_canvas")[0];
		this.canvas_ctx = this.canvas.getContext("2d");
	}

	static async initialize() {
		try {
			// Check for user has toggled off webcam support
			if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
				throw new Error(
					"Browser API navigator.mediaDevices.getUserMedia not available. Please allow webcam use."
				);
			}

			// Request access to webcam video
			const video_config = {
				audio: false,
				video: true,
			};
			const stream = await navigator.mediaDevices.getUserMedia(video_config);

			const camera = new Camera();
			camera.video.srcObject = stream;

			// Wait for video to be ready
			await new Promise((resolve) => {
				camera.video.onloadedmetadata = () => {
					resolve();
				};
			});

			camera.video.play();

			return camera;
		} catch (error) {
			alert(error);
		}
	}
}
