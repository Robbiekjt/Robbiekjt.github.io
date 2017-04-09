            Raphael.fn.bus = function (x, y) {
                return this.path(["M", x-40, y] + "l80,0").attr({fill: "#fff", stroke: "black", "stroke-width": 8, "fill-opacity": 1});
            };

	    Raphael.fn.breaker = function (x, y) {
                return this.path(["M", x-5, y] + "l10,0 0,10 -10,0 z").attr({fill: "#fff", stroke: "black", "stroke-width": 1, "fill-opacity": 1});
            };

	    Raphael.fn.feeder = function (xstart, ystart, length) {
                return this.path(["M", xstart, ystart] + ["l", 0, length]).attr({fill: "#fff", stroke: "black", "stroke-width": 2, "fill-opacity": 1});
            };

	    autotx = function (frame,x,y) {
		frame.path(["M", x-30, y] + "l10,-15 10,15 10,-15 10,15 10,-15 10,15 m-40,1 l0,10 10,0 0,10 m-10,-20 l-5,5 m5,-5 l5,5 m-5,-5").attr({fill: "#fff", stroke: "black", "stroke-width": 1, "fill-opacity": 1});
		hoverArea = frame.rect(x-40,y-25,80,50).attr({fill: "#f00", stroke: "none", "fill-opacity": 0});
		hoverArea.hover(function () {
			hoverArea.attr({"fill-opacity": 0.2});
			},
			function () {
				hoverArea.attr({"fill-opacity": 0});
			}	
	    )};

	    function addContent(divName, content) {
     		document.getElementById(divName).innerHTML = content;
	    }


            window.onload = function () {
                var r = Raphael("leftSLD", 619, 419);
   
		r.bus(100,100);
		r.feeder(100,100,20);
		circuit_breaker = r.breaker(100,120);
		r.feeder(100,130,80);
		r.breaker(100,210);
		r.feeder(100,220,20);
		r.bus(100,240);
		//autotx_one = r.autotx(150,150);
		autotx_one = autotx(r,150,150);


                r.text(100, 80, "Bus A").attr({font: '16px "Helvetica Neue", Arial', fill: "black"});
		r.text(100, 260, "Bus B").attr({font: '16px "Helvetica Neue", Arial', fill: "black"});

		circuit_breaker.hover(function () {
    			circuit_breaker.attr({"fill": "#000"});
			addContent("rightDetail", "<iframe src='pages/circuit_breaker.html' width='100%' height='98%' frameBorder='0'></iframe>");
  		 },
  		 function () {
    			circuit_breaker.attr({"fill": "none"});
			addContent("rightDetail", "");
  		 }
		);

            };