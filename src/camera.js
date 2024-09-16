export default class Camera {
	constructor() {
		this.video = document.getElementsByClassName("input_video")[0];
		this.canvas = document.getElementsByClassName("output_canvas")[0];
		this.canvas_ctx = this.canvas.getContext("2d");
	}

	static async initialize() {
		try {
			if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
				throw new Error(
					"Browser API navigator.mediaDevices.getUserMedia not available. Please allow webcam use."
				);
			}

			const video_config = {
				audio: false,
				video: true,
			};
			const stream = await navigator.mediaDevices.getUserMedia(video_config);

			const camera = new Camera();
			camera.video.srcObject = stream;
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

		//const targetFPS = 80;
		//const videoConfig = {
		//	audio: false,
		//};

		//await new Promise((resolve) => {
		//		camera.video.onloadedmetadata = () => {
		//			resolve(camera.video);
		//		};
		//	});

		//camera.canvas.width = camera.video.videoWidth;
		//camera.canvas.height = camera.video.videoHeight;
	}
}
