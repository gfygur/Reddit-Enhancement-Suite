(function () {
    var gfyObject;

    gfyObject = function (element, url, gfyFrameRate, media) {
        var ctrlPausePlay;
        var ctrlSlower;
        var ctrlFaster;
        var ctrlReverse;
        var vid;
        var mp4src;
        var webmsrc;
        var isReverse = false;
        var ctrlBox;
        var isOverVid = false;
        var isOverCtrl = false;

        ctrlBox = element.querySelector('.ctrlBox');
        vid = element.querySelector('.gfyRVid');
        ctrlReverse = element.querySelector('.gfyRCtrlReverse');
        ctrlPausePlay = element.querySelector('.gfyRCtrlPause');
        ctrlSlower = element.querySelector('.gfyRCtrlSlower');
        ctrlFaster = element.querySelector('.gfyRCtrlFaster');
        mp4src = element.querySelector('.gfyRmp4src');
        webmsrc = element.querySelector('.gfyRwebmsrc');
        ctrlSlower.onclick = slower;
        ctrlFaster.onclick = faster;
        ctrlPausePlay.onclick = pauseClick;
		vid.onpause = vid.onplay = pauseEvent;
        ctrlReverse.onclick = reverse;
        element.onmouseover = ctrlOnMouseOver;
        element.onmouseout = ctrlOnMouseOut;
        var speed = getURLParameters('speed', url);
        var direction = getURLParameters('direction', url);
        var frameNum = getURLParameters('frameNum', url);

		var album = document.createElement('div');
		album.className = 'mediacrush-album';
		album.media = media;

		var controls = document.createElement('span');
		controls.className = 'RESGalleryControls';
		var prev = document.createElement('a');
		prev.className = 'previous noKeyNav';
		var next = document.createElement('a');
		next.className = 'next noKeyNav';
		var text = document.createElement('span');
		text.className = 'RESGalleryLabel';
		controls.appendChild(prev);
		controls.appendChild(text);
		controls.appendChild(next);
		album.appendChild(controls);

		var brand = document.createElement('a');
		brand.href = self.domain + '/' + media.hash;
		brand.target = '_blank';
		brand.className = 'mediacrush-brand';
		var image = document.createElement('img');
		image.src = self.logo;
		image.width = 16; image.height = 16;
		brand.appendChild(image);
		var span = document.createElement('span');
		span.textContent = 'MediaCrush';
		brand.appendChild(span);
		album.appendChild(brand);

		album.index = 0;		
		var mediaDiv;
		function renderPage() {
			if (mediaDiv)
				mediaDiv.parentElement.removeChild(mediaDiv);
			mediaDiv = document.createElement('div');
			mediaDiv.className = 'mediacrush';
			mediaDiv.setAttribute('data-media', media.sources[album.index].hash);
			album.appendChild(mediaDiv);
			text.textContent = (album.index + 1) + ' of ' + media.sources.length;
			self.render(mediaDiv);
		}
		renderPage();

		next.addEventListener('click', function(e) {
			e.preventDefault();
			album.index++;
			if (album.index >= media.sources.length) album.index = 0;
			renderPage();
		}, false);
		prev.addEventListener('click', function(e) {
			e.preventDefault();
			album.index--;
			if (album.index < 0) album.index = media.sources.length - 1;
			renderPage();
		}, false);

		element.appendChild(album);		
        if (speed) {
            vid.playbackRate = speed;
        }

        if (direction && direction == 'reverse') {
            if (!isReverse) {
                reverse();
            }
        }

        if (frameNum) {
	    vid.addEventListener('loadeddata', function() {
	        vid.pause();	
		vid.currentTime = (frameNum / gfyFrameRate);
	    }, false);
        }

        function stepForward() {
            vid.currentTime += (1 / gfyFrameRate);
        }

        function ctrlOnMouseOver() {
            ctrlBox.style.display = "block";
        }

        function ctrlOnMouseOut() {
            ctrlBox.style.display = "none";
        }

        function stepBackward() {
            vid.currentTime -= (1 / gfyFrameRate);
        }

        function getURLParameters(paramName, s_url) {
            if (s_url.indexOf("?") > 0) {
                var s_query = s_url.split("?");
                var params = s_query[1].split("&");
                var paramNames = new Array(params.length);
                var paramValues = new Array(params.length);
                var i = 0;
                for (i = 0; i < params.length; i++) {
                    var thisParam = params[i].split("=");
                    paramNames[i] = thisParam[0];
                    if (thisParam[1] != "")
                        paramValues[i] = unescape(thisParam[1]);
                    else
                        paramValues[i] = "No Value";
                }

                for (i = 0; i < params.length; i++) {
                    if (paramNames[i] == paramName) {
                        return paramValues[i];
                    }
                }
                return 0;
            }
        }

		function pauseEvent() {
				if (vid.paused) {
			ctrlPausePlay.innerHTML="&#xf16b;";
					ctrlSlower.innerHTML="&#xf168;";
					ctrlFaster.innerHTML="&#xf16e;"
					ctrlSlower.onclick = stepBackward;
					ctrlFaster.onclick = stepForward;
				} else {
			ctrlPausePlay.innerHTML="&#xf16c;";
					ctrlSlower.innerHTML="&#xf14d;";
					ctrlFaster.innerHTML="&#xf14c;"
					ctrlSlower.onclick = slower;
					ctrlFaster.onclick = faster;
				}
		}

        function pauseClick() {
            if (vid.paused) {
                vid.play();
            } else {
                vid.pause();
            }
	    pauseEvent();
        }

        function faster() {
            if (vid.playbackRate <= 1) {
                vid.playbackRate = vid.playbackRate * 2;
            } else {
                vid.playbackRate = parseFloat(vid.playbackRate) + 1;
            }
        }

        function slower() {
            if (vid.playbackRate <= 1)
                vid.playbackRate = vid.playbackRate / 2;
            else
                vid.playbackRate--;
        }

        function reverse() {
            if (isReverse) {
                mp4src.src = mp4src.src.replace(/-reverse\.mp4/g, ".mp4");
                webmsrc.src = webmsrc.src.replace(/-reverse\.webm/g, ".webm");
		ctrlReverse.innerHTML="&#xf169;";
                isReverse = false;
            } else {
                mp4src.src = mp4src.src.replace(/\.mp4/g, "-reverse.mp4");
                webmsrc.src = webmsrc.src.replace(/\.webm/g, "-reverse.webm");
		ctrlReverse.innerHTML="&#xf16d;";
                isReverse = true;
            }
            vid.load();
            vid.pause();
            pauseClick();
        }
    }
    window.gfyObject = gfyObject;
}).call(this);
