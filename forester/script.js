function List() {
		
	let canvasShow = document.getElementById("show");
		context = canvasShow.getContext("2d");
		let cnv = document.querySelectorAll("ymaps > .ymaps-2-1-75-user-selection-none");

	for (let index = 1; index < cnv.length-1; index++) {
		let canvas = cnv[index];
		let bg = getStyle(canvas, "backgroundImage");
		bg = bg.replace('url(','').replace(')','').replace(/\"/gi, ""); 
		var image =  new Image();
		image.setAttribute("crossOrigin", "Anonymous");
		image.crossOrigin = "Anonymous";
		image.setAttribute("src", bg);

		

		let bgLeftCoord = getStyle(canvas, "left");
		bgLeftCoord = bgLeftCoord.replace('px','');
		let bgTopCoord = getStyle(canvas, "top");
		bgTopCoord = bgTopCoord.replace('px','');
		context.drawImage(image, bgLeftCoord, bgTopCoord);
	}
		
		
		function getStyle(el, prop){
			return window.getComputedStyle ? getComputedStyle(el)[prop] : el.currentStyle [prop]
		}
		
		
		

			let src = cv.imread(canvasShow);
			//let src = cv.matFromImageData (imgData);
			let dst = new cv.Mat();
			let gray = new cv.Mat();
			let opening = new cv.Mat();
			let coinsBg = new cv.Mat();
			let coinsFg = new cv.Mat();
			let distTrans = new cv.Mat();
			let unknown = new cv.Mat();
			let markers = new cv.Mat();

			cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
			cv.threshold(gray, gray, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);

			let M = cv.Mat.ones(3, 3, cv.CV_8U);
			cv.erode(gray, gray, M);
			cv.dilate(gray, opening, M);
			cv.dilate(opening, coinsBg, M, new cv.Point(-1, -1), 3);

			cv.distanceTransform(opening, distTrans, cv.DIST_L2, 5);
			cv.normalize(distTrans, distTrans, 1, 0, cv.NORM_INF);

			cv.threshold(distTrans, coinsFg, 0.7 * 1, 255, cv.THRESH_BINARY);
			coinsFg.convertTo(coinsFg, cv.CV_8U, 1, 0);
			cv.subtract(coinsBg, coinsFg, unknown);

			cv.connectedComponents(coinsFg, markers);
			for (let i = 0; i < markers.rows; i++) {
				for (let j = 0; j < markers.cols; j++) {
					markers.intPtr(i, j)[0] = markers.ucharPtr(i, j)[0] + 1;
					if (unknown.ucharPtr(i, j)[0] == 255) {
						markers.intPtr(i, j)[0] = 0;
					}
				}
			}
			cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
			cv.watershed(src, markers);


			for (let i = 100; i < markers.rows-1; i++) {
				for (let j = 100; j < markers.cols-1; j++) {
					if (markers.intPtr(i, j)[0] == -1 ) {
						src.ucharPtr(i, j)[0] = 255; 
						src.ucharPtr(i, j)[1] = 0; 
						src.ucharPtr(i, j)[2] = 0; 
						console.log(i, j)
					}
				}
			}

			
			cv.imshow(canvasShow, src);

			src.delete(); dst.delete(); gray.delete(); opening.delete(); coinsBg.delete();
			coinsFg.delete(); distTrans.delete(); unknown.delete(); markers.delete(); M.delete();

		
	
};








