import Camera from "./camera";

let camera, face_mesh, drawing_utils;
let running = false;

async function initialize_model() {
	const vision_package_path = await vision.FilesetResolver.forVisionTasks(
		"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
	);
	face_mesh = await vision.FaceLandmarker.createFromOptions(
		vision_package_path,
		{
			baseOptions: {
				modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
				delegate: "GPU",
			},
			outputFaceBlendshapes: true,
			runningMode: "VIDEO",
			numFaces: 1,
		}
	);
	drawing_utils = new vision.DrawingUtils(camera.canvas_ctx);
}

function draw(results) {
	camera.canvas_ctx.clearRect(0, 0, camera.canvas.width, camera.canvas.height);

	camera.canvas_ctx.save();
	camera.canvas_ctx.translate(camera.canvas.width, 0);
	camera.canvas_ctx.scale(-1, 1);

	if (results.faceLandmarks) {
		for (const landmarks of results.faceLandmarks) {
			drawing_utils.drawConnectors(
				landmarks,
				vision.FaceLandmarker.FACE_LANDMARKS_TESSELATION,
				{ color: "#ffffff", lineWidth: 0.5 }
			);

			drawing_utils.drawConnectors(
				landmarks,
				vision.FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
				{ color: "#ffffff", lineWidth: 3 }
			);
			drawing_utils.drawConnectors(
				landmarks,
				vision.FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
				{ color: "#ffffff", lineWidth: 2.5 }
			);
			drawing_utils.drawConnectors(
				landmarks,
				vision.FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
				{ color: "#ffffff", lineWidth: 3 }
			);
			drawing_utils.drawConnectors(
				landmarks,
				vision.FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
				{ color: "#ffffff", lineWidth: 2.5 }
			);
			drawing_utils.drawConnectors(
				landmarks,
				vision.FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
				{ color: "#ffffff" }
			);
			drawing_utils.drawConnectors(
				landmarks,
				vision.FaceLandmarker.FACE_LANDMARKS_LIPS,
				{ color: "#ffffff", lineWidth: 3 }
			);
			drawing_utils.drawConnectors(
				landmarks,
				vision.FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
				{ color: "#ffffff", lineWidth: 2.5 }
			);
			drawing_utils.drawConnectors(
				landmarks,
				vision.FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
				{ color: "#ffffff", lineWidth: 2.5 }
			);
			//landmarks.forEach((landmark) => {
			//	camera.canvas_ctx.beginPath();
			//	camera.canvas_ctx.arc(
			//		landmark.x * camera.canvas.width,
			//		landmark.y * camera.canvas.height,
			//		1.25,
			//		0,
			//		Math.PI * 2
			//	);
			//	camera.canvas_ctx.fillStyle = "#FFF3E7";
			//	camera.canvas_ctx.fill();
			//});
		}
	}
	camera.canvas_ctx.restore();
}

function showBubble(anchor_x, anchor_y, angle) {
	const bubble = document.getElementById("bubble");

	// Set bubble position and rotation
	bubble.style.left = `${anchor_x}px`;
	bubble.style.top = `${anchor_y}px`;
	bubble.style.transform = `rotate(${angle}deg)`;

	// Show the bubble
	bubble.style.display = "flex";

	// Fade it in
	requestAnimationFrame(() => {
		bubble.style.opacity = 1;
	});

	setTimeout(() => {
		bubble.style.opacity = 0;
		setTimeout(() => {
			bubble.style.display = "none";
		}, 500); // Wait for fade out transition to complete
	}, 500);
}

function detect_stillness(
	results,
	current_time,
	last_time,
	prev_results,
	still_time
) {
	if (
		prev_results.length &&
		results.faceLandmarks &&
		results.faceLandmarks.length > 0
	) {
		let threshold = 0.0008;
		let target_hold_time = 1000;
		let delta_time = current_time - last_time;

		let total_movement = 0;

		for (let i = 0; i < results.faceLandmarks[0].length; i++) {
			let dx = results.faceLandmarks[0][i].x - prev_results[0][i].x;
			let dy = results.faceLandmarks[0][i].y - prev_results[0][i].y;
			let dz = results.faceLandmarks[0][i].z - prev_results[0][i].z;
			total_movement += Math.sqrt(dx * dx + dy * dy + dz * dz);
		}
		let avg_movement = total_movement / results.faceLandmarks[0].length;
		if (avg_movement < threshold) {
			still_time += delta_time;
		} else {
			still_time = 0;
		}

		if (still_time >= target_hold_time) {
			console.log("FACE STILL");

			let anchor_x = results.faceLandmarks[0][1].x * camera.canvas.width;
			anchor_x = camera.canvas.width - anchor_x;
			let anchor_y = results.faceLandmarks[0][1].y * camera.canvas.height;
			let angle =
				Math.atan2(
					results.faceLandmarks[0][10].y - results.faceLandmarks[0][152].y,
					results.faceLandmarks[0][10].x - results.faceLandmarks[0][152].x
				) *
					(180 / Math.PI) +
				90;
			let matched = emoji_match(results);
			if (matched) {
				showBubble(anchor_x, anchor_y, -angle);
			}

			still_time = 0;
		}

		prev_results = [...results.faceLandmarks];
		return [prev_results, still_time];
	} else {
		if (prev_results.length) {
			return [[], still_time];
		}
		if (results.faceLandmarks) {
			prev_results = [...results.faceLandmarks];
			return [prev_results, still_time];
		}
	}
}

function emoji_match(results) {
	let image = document.getElementById("emoji");
	var matched = true;

	let left_eye_closed = results.faceBlendshapes[0].categories[9].score;
	let right_eye_closed = results.faceBlendshapes[0].categories[10].score;

	let left_eye_looking_up = results.faceBlendshapes[0].categories[17].score;
	let right_eye_looking_up = results.faceBlendshapes[0].categories[18].score;

	let left_eye_looking_right = results.faceBlendshapes[0].categories[13].score;
	let right_eye_looking_right = results.faceBlendshapes[0].categories[16].score;

	// good for detecting if mouth open as in gasping or shocked, doesnt fire high for smiling
	let mouth_open = results.faceBlendshapes[0].categories[25].score;

	let smile_left = results.faceBlendshapes[0].categories[44].score;
	let smile_right = results.faceBlendshapes[0].categories[45].score;

	let scores = [
		left_eye_closed,
		right_eye_closed,
		left_eye_looking_up,
		right_eye_looking_up,
		left_eye_looking_right,
		right_eye_looking_right,
		mouth_open,
		smile_left,
		smile_right,
	];
	if (
		right_eye_closed - left_eye_closed > 0.135 &&
		smile_right > 0.3 &&
		smile_left > 0.3
	) {
		image.src = require("./emojis/winking.png");
	} else if (
		left_eye_looking_right > 0.5 &&
		right_eye_looking_right > 0.5 &&
		smile_right > 0.5 &&
		smile_left > 0.5 &&
		smile_right - smile_left > 0.035
	) {
		image.src = require("./emojis/smirking.png");
	} else if (
		mouth_open > 0.03 &&
		smile_right > 0.5 &&
		smile_left > 0.5 &&
		left_eye_looking_right < 0.15 &&
		right_eye_looking_right < 0.15
	) {
		image.src = require("./emojis/smiling_teeth.png");
	} else if (
		mouth_open < 0.03 &&
		smile_right > 0.5 &&
		smile_left > 0.5 &&
		left_eye_looking_right < 0.15 &&
		right_eye_looking_right < 0.15
	) {
		image.src = require("./emojis/smiling_closed.png");
	} else if (mouth_open > 0.3 && smile_right < 0.005 && smile_left < 0.005) {
		image.src = require("./emojis/shocked.png");
	} else if (
		mouth_open < 0.03 &&
		left_eye_looking_up > 0.18 &&
		right_eye_looking_up > 0.18
	) {
		image.src = require("./emojis/rolling_eyes.png");
	} else {
		matched = false;
	}
	console.log(scores);
	return matched;
}

async function predict_and_draw() {
	let prev_timestamp = -1;
	let results;
	let prev_results = [];
	let still_time = 0;

	if (camera.video.readyState >= 2) {
		predict_on_frame();
	} else {
		camera.video.onloadeddata = () => {
			predict_on_frame();
		};
	}

	async function predict_on_frame() {
		let timestamp = performance.now();
		if (prev_timestamp !== camera.video.currentTime) {
			results = await face_mesh.detectForVideo(camera.video, timestamp);
			if (prev_timestamp == -1) {
				console.log(results);
			}
			prev_timestamp = camera.video.currentTime;
			// maybe do stuff
			draw(results);
			if (running) {
				[prev_results, still_time] = detect_stillness(
					results,
					performance.now(),
					timestamp,
					prev_results,
					still_time
				);
			}
		}
		requestAnimationFrame(predict_on_frame);
	}
}

window.toggle_panel_visibility = function () {
	let panel = document.getElementsByClassName("panel_content")[0];

	if (panel.style.display == "flex") {
		panel.style.display = "none";
	} else {
		panel.style.display = "flex";
	}
};

window.toggle_running = function () {
	let button = document.getElementsByClassName("panel_title")[1];

	if (running) {
		running = false;
		button.textContent = "start";
		button.classList.remove("pause");
		button.classList.add("start");
	} else {
		running = true;
		button.textContent = "pause";
		button.classList.remove("start");
		button.classList.add("pause");
	}
};

async function main() {
	camera = await Camera.initialize();
	await initialize_model();
	predict_and_draw();
}

main();
