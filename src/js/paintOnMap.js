ymaps.modules.define('ext.paintOnMap', ['meta', 'util.extend', 'pane.EventsPane', 'Event'], function (provide, meta, extend, EventsPane, Event) {
    'use strict';
    
    var EVENTS_PANE_ZINDEX = 500;

    var DEFAULT_UNWANTED_BEHAVIORS = ['drag', 'scrollZoom'];
    var DEFAULT_STYLE = {strokeColor: '#0000ff', strokeWidth: 1, strokeOpacity: 1};
    var DEFAULT_TOLERANCE = 16;

    var badFinishPaintingCall = function () {
        throw new Error('(ymaps.ext.paintOnMap) некорректный вызов PaintingProcess#finishPaintingAt. Рисование уже завершено.');
    };

    function paintOnMap(map, positionOrEvent, config) {

        config = config || {};
        var style = extend(DEFAULT_STYLE, config.style || {});

        var unwantedBehaviors = config.unwantedBehaviors === undefined ?
            DEFAULT_UNWANTED_BEHAVIORS : config.unwantedBehaviors;

        var pane = new EventsPane(map, {
            css: {position: 'absolute', width: '100%', height: '100%'},
            zIndex: EVENTS_PANE_ZINDEX + 50,
            transparent: true
        });

        map.panes.append('ext-paint-on-map', pane);

        if (unwantedBehaviors) {
            map.behaviors.disable(unwantedBehaviors);
        }

        // Создаём canvas-элемент.
        var canvas = document.createElement('canvas');
        var ctx2d = canvas.getContext('2d');
        var rect = map.container.getParentElement().getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx2d.globalAlpha = style.strokeOpacity;
        ctx2d.strokeStyle = style.strokeColor;
        ctx2d.lineWidth = style.strokeWidth;

        canvas.style.width = '100%';
        canvas.style.height = '100%';

        pane.getElement().appendChild(canvas);

        var firstPosition = positionOrEvent ? toPosition(positionOrEvent) : null;
        var coordinates = firstPosition ? [firstPosition] : [];

        var bounds = map.getBounds();
        var latDiff = bounds[1][0] - bounds[0][0];
        var lonDiff = bounds[1][1] - bounds[0][1];

        /*canvas.onmousemove = function (e) {
            coordinates.push([e.offsetX, e.offsetY]);

            ctx2d.clearRect(0, 0, canvas.width, canvas.height);
            ctx2d.beginPath();

            ctx2d.moveTo(coordinates[0][0], coordinates[0][1]);
            for (var i = 1; i < coordinates.length; i++) {
                ctx2d.lineTo(coordinates[i][0], coordinates[i][1]);
            }

            ctx2d.stroke();
        }.bind(this);*/

        let canvasShow = document.getElementById("show");
		context = canvasShow.getContext("2d");
		let cnv = document.querySelectorAll("ymaps > .ymaps-2-1-76-user-selection-none");

	for (let index = 1; index < cnv.length-1; index++) {
		let canvas = cnv[index];
		let bg = getStyle(canvas, "backgroundImage");
        bg = bg.replace('url(','').replace(')','').replace(/\"/gi, ""); 
        console.log(bg);
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

            let points = [{}];
            let ch = [];
            let h = [];
        
            let f = 0;
			for (let i = 100; i < markers.rows-1; i++) {
				for (let j = 100; j < markers.cols-1; j++) {
					if (markers.intPtr(i, j)[0] == -1 ) {
						src.ucharPtr(i, j)[0] = 255; 
						src.ucharPtr(i, j)[1] = 0; 
						src.ucharPtr(i, j)[2] = 0; 
                        //console.log(i, j);
                        //if (i%2 == 0 && j%2 == 0 )
                        points[f] = {
                            'x': parseInt(j),
                            'y': parseInt(i)
                        }
                        ch.push(f);
                        f++;
                        //coordinates.push([j, i]);
					}
				}
            }
            

			graham();
			cv.imshow(canvasShow, src);

			src.delete(); dst.delete(); gray.delete(); opening.delete(); coinsBg.delete();
			coinsFg.delete(); distTrans.delete(); unknown.delete(); markers.delete(); M.delete();

            function classify(vector, x1, y1) {
                let pr = (vector.x2 - vector.x1) * (y1 - vector.y1) - (vector.y2 - vector.y1) * (x1 - vector.x1);
                return pr;
            }
        
        
            function graham() {
                var minI = 0; //номер нижней левой точки
                var min = points[0].x;
                // ищем нижнюю левую точку
                for (var i = 1; i < points.length; i++) {
                    if (points[i].x < min) {
                        min = points[i].x;
                        minI = i;
                    }
                }
                // делаем нижнюю левую точку активной
                ch[0] = minI;
                ch[minI] = 0;
            
                // сортируем вершины в порядке "левизны"
                for (var i = 1; i < ch.length - 1; i++) {
                    for (var j = i + 1; j < ch.length; j++) {
                        var cl = classify({
                            'x1': points[ ch[0] ].x,
                            'y1': points[ ch[0] ].y,
                            'x2': points[ ch[i] ].x,
                            'y2': points[ ch[i] ].y
                        }, points[ ch[j] ].x, points[ ch[j] ].y) // функция classify считает векторное произведение.            
            
                        // если векторное произведение меньше 0, следовательно вершина j левее вершины i.Меняем их местами
                        if (cl < 0) {
                            let temp = ch[i];
                            ch[i] = ch[j];
                            ch[j] = temp;
                        }
                    }
                }   
            
                //записываем в стек вершины, которые точно входят в оболочку
                h = [];
                h[0] = ch[0];
                h[1] = ch[1]; 
                
                
                for (var i = 2; i < ch.length; i++) {
                    while (classify({
                        'x1': points[ h[h.length - 2] ].x,
                        'y1': points[ h[h.length - 2] ].y,
                        'x2': points[ h[h.length - 1] ].x,
                        'y2': points[ h[h.length - 1] ].y
                    }, points[ ch[i] ].x, points[ ch[i] ].y) < 0) {            
                        h.pop(); // пока встречается правый поворот, убираем точку из оболочки
                    }
                    h.push(ch[i]); // добавляем новую точку в оболочку
                    
                }
                
                
            }


            for(var i=1; i<h.length; i++){
                coordinates.push([points[ h[i] ].x, points[ h[i] ].y]);
            }


        // Создаём косвенное обращение, чтобы не сдерживать сборщик мусора.
        var paintingProcess = {
            finishPaintingAt: function (positionOrEvent) {
                paintingProcess.finishPaintingAt = badFinishPaintingCall;

                // Получаем координаты, прежде чем удалить пейн.
                if (positionOrEvent) {
                    coordinates.push(toPosition(positionOrEvent));
                }

                map.panes.remove(pane);
                if (unwantedBehaviors) {
                    map.behaviors.enable(unwantedBehaviors);
                }

                var tolerance = config.tolerance === undefined ? DEFAULT_TOLERANCE : Number(config.tolerance);
                if (tolerance) {
                    coordinates = simplify(coordinates, tolerance);
                }
                // Преобразовываем координаты canvas-элемента в геодезические координаты.
                return coordinates.map(function (x) {
                    var lon = bounds[0][1] + (x[0] / canvas.width) * lonDiff;
                    var lat = bounds[0][0] + (1 - x[1] / canvas.height) * latDiff;

                    return meta.coordinatesOrder === 'latlong' ? [lat, lon] : [lon, lat];
                });
            }
        };
       
        return paintingProcess;
        
    }

    


    function toPosition(positionOrEvent) {
        return positionOrEvent instanceof Event ?
            [positionOrEvent.get('offsetX'), positionOrEvent.get('offsetY')] :
            positionOrEvent;
    }

    function simplify(coordinates, tolerance) {
        var toleranceSquared = tolerance * tolerance;
        var simplified = [coordinates[0]];

        var prev = coordinates[0];
        for (var i = 1; i < coordinates.length; i++) {
            var curr = coordinates[i];
            if (Math.pow(prev[0] - curr[0], 2) + Math.pow(prev[1] - curr[1], 2) > toleranceSquared) {
                simplified.push(curr);
                prev = curr;
            }
        }

        return simplified;
    }

    provide(paintOnMap);
    
});