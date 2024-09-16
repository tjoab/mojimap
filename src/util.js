export function compute_ar1(mesh) {
	// Left eye
	let c1 = mesh[33];
	let c2 = mesh[133];
	let p1u = mesh[160];
	let p2u = mesh[159];
	let p3u = mesh[158];
	let p1l = mesh[144];
	let p2l = mesh[145];
	let p3l = mesh[153];

	let num =
		Math.sqrt(Math.pow(p1u.x - p1l.x, 2) + Math.pow(p1u.y - p1l.y, 2)) +
		Math.sqrt(Math.pow(p2u.x - p2l.x, 2) + Math.pow(p2u.y - p2l.y, 2)) +
		Math.sqrt(Math.pow(p3u.x - p3l.x, 2) + Math.pow(p3u.y - p3l.y, 2));

	let denom =
		2 * Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2));

	const ar1_left_eye = num / denom;

	// Right eye
	c1 = mesh[263];
	c2 = mesh[362];
	p1u = mesh[387];
	p2u = mesh[386];
	p3u = mesh[385];
	p1l = mesh[373];
	p2l = mesh[374];
	p3l = mesh[380];

	num =
		Math.sqrt(Math.pow(p1u.x - p1l.x, 2) + Math.pow(p1u.y - p1l.y, 2)) +
		Math.sqrt(Math.pow(p2u.x - p2l.x, 2) + Math.pow(p2u.y - p2l.y, 2)) +
		Math.sqrt(Math.pow(p3u.x - p3l.x, 2) + Math.pow(p3u.y - p3l.y, 2));

	denom = 2 * Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2));

	const ar1_right_eye = num / denom;

	// Mouth
	c1 = mesh[78];
	c2 = mesh[308];
	p1u = mesh[81];
	p2u = mesh[13];
	p3u = mesh[311];
	p1l = mesh[178];
	p2l = mesh[14];
	p3l = mesh[402];

	num =
		Math.sqrt(Math.pow(p1u.x - p1l.x, 2) + Math.pow(p1u.y - p1l.y, 2)) +
		Math.sqrt(Math.pow(p2u.x - p2l.x, 2) + Math.pow(p2u.y - p2l.y, 2)) +
		Math.sqrt(Math.pow(p3u.x - p3l.x, 2) + Math.pow(p3u.y - p3l.y, 2));

	denom = 2 * Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2));

	const ar1_mouth = num / denom;

	console.log(ar1_left_eye);
	console.log(ar1_right_eye);
	console.log(ar1_mouth);
}

export function compute_ar2(mesh) {
	// Left
	let c1 = mesh[133];
	let p1 = mesh[68];
	let p2 = mesh[104];
	let p3 = mesh[69];
	let p4 = mesh[108];

	let num =
		Math.sqrt(Math.pow(p1.x - c1.x, 2) + Math.pow(p1.y - c1.y, 2)) +
		Math.sqrt(Math.pow(p2.x - c1.x, 2) + Math.pow(p2.y - c1.y, 2)) +
		Math.sqrt(Math.pow(p3.x - c1.x, 2) + Math.pow(p3.y - c1.y, 2)) +
		Math.sqrt(Math.pow(p4.x - c1.x, 2) + Math.pow(p4.y - c1.y, 2));

	let denom =
		2 * Math.sqrt(Math.pow(p4.x - c1.x, 2) + Math.pow(p4.y - c1.y, 2));

	const ar2_left = num / denom;

	// Right
	c1 = mesh[362];
	p1 = mesh[298];
	p2 = mesh[333];
	p3 = mesh[299];
	p4 = mesh[337];

	num =
		Math.sqrt(Math.pow(p1.x - c1.x, 2) + Math.pow(p1.y - c1.y, 2)) +
		Math.sqrt(Math.pow(p2.x - c1.x, 2) + Math.pow(p2.y - c1.y, 2)) +
		Math.sqrt(Math.pow(p3.x - c1.x, 2) + Math.pow(p3.y - c1.y, 2)) +
		Math.sqrt(Math.pow(p4.x - c1.x, 2) + Math.pow(p4.y - c1.y, 2));

	denom = 2 * Math.sqrt(Math.pow(p4.x - c1.x, 2) + Math.pow(p4.y - c1.y, 2));

	const ar2_right = num / denom;

	console.log(ar2_left);
	console.log(ar2_right);
}

export function detect_smile_sad(mesh) {
	let Ll = mesh[61];
	let Lr = mesh[291];
	let Ckl = mesh[214];
	let Ckr = mesh[434];
	let Cnl = mesh[204];
	let Cnr = mesh[424];

	if ((Ll.y < Ckl.y && Ll.x < Cnl.x) || (Lr.y < Ckr.y && Lr.x > Cnr.x)) {
		console.log("smiling lips");
	} else if ((Ll.y > Ckl.y && Ll.x > Cnl.x) || (Lr.y > Ckr.y && Lr.x < Cnr.x)) {
		console.log("sad lips");
	} else {
		console.log("uknown lips");
	}
}
