var CircularSlider = function() {
  var options = {
    label: "",
    container: "",
    color: "#ff0000",
    max: 12,
    min: 0,
    step: 1,
    radius: 0 
  };

  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      pathBg = document.createElementNS("http://www.w3.org/2000/svg", 'path'),
      pathFg = document.createElementNS("http://www.w3.org/2000/svg", 'path'),
      pathDash = document.createElementNS("http://www.w3.org/2000/svg", 'path'),
      pathBlank = document.createElementNS("http://www.w3.org/2000/svg", 'path'),
      pathHolder = document.createElementNS("http://www.w3.org/2000/svg", 'circle');

  var steps = 0;
  var currentStep = 0;

  var curveLength = 0;
  var stepLength = 0;
  var circleRadius = 0;

  var Point = function(x,y) {
    this.x = x;
    this.y = y;
  };

  var buildGraph = function() {
    var wh = options.radius*2;
    var colorFg = options.color;

    var colorBg = "#cfcfd0";
    var colorDash = "#fff";
    var strokeWidth = 20;
    var holderOverflow = 2;
    var holderStroke = 2;
    var dashWidth = 1;
    var dashSepWidth = 1;

    var holderRadius = strokeWidth/2 + holderOverflow;
    circleRadius = wh/2 - strokeWidth/2 - (holderOverflow + holderStroke);
    curveLength = 2 * Math.PI * circleRadius;
    stepLength = curveLength / steps;
    var initialX = (circleRadius + strokeWidth/2) + holderOverflow + holderStroke;
    var initialY = strokeWidth/2 + holderOverflow + holderStroke;

    svg.setAttribute('class', 'circularSlider');
    svg.setAttribute('height', wh);
    svg.setAttribute('width', wh);
    svg.setAttribute('viewBox', '0 0 '+ wh +' '+ wh);
    svg.setAttribute('style', 'pointer-events: none;');

    pathBg.setAttribute('d','M'+ initialX +','+ initialY +' a'+ circleRadius +','+ circleRadius +' 0 1,1 -1,0');
    pathBg.setAttribute('fill', 'none');
    pathBg.setAttribute('stroke', colorBg);
    pathBg.setAttribute('stroke-width', strokeWidth);
    pathBg.setAttribute('stroke-dasharray', (stepLength-dashWidth) +' '+ dashWidth);
    pathBg.setAttribute('stroke-dashoffset', -2);

    pathFg.setAttribute('d','M'+ initialX +','+ initialY +' a'+ circleRadius +','+ circleRadius +' 0 1,1 -1,0');
    pathFg.setAttribute('fill', 'none');
    pathFg.setAttribute('stroke', colorFg);
    pathFg.setAttribute('stroke-width', strokeWidth);
    pathFg.setAttribute('stroke-dasharray', curveLength);
    pathFg.setAttribute('stroke-dashoffset', stepLength * (steps - currentStep));

    pathDash.setAttribute('d','M'+ initialX +','+ initialY +' a'+ circleRadius +','+ circleRadius +' 0 1,1 -1,0');
    pathDash.setAttribute('fill', 'none');
    pathDash.setAttribute('stroke', colorDash);
    pathDash.setAttribute('stroke-opacity', '0.4');
    pathDash.setAttribute('stroke-width', strokeWidth);
    pathDash.setAttribute('stroke-dasharray', dashSepWidth +' '+ (stepLength - dashSepWidth));
    pathDash.setAttribute('stroke-dashoffset', 0);

    pathBlank.setAttribute('d','M'+ initialX +','+ initialY +' a'+ circleRadius +','+ circleRadius +' 0 1,1 -1,0');
    pathBlank.setAttribute('fill', 'none');
    pathBlank.setAttribute('stroke', colorBg);
    pathBlank.setAttribute('stroke-width', strokeWidth);
    pathBlank.setAttribute('stroke-opacity', '0');
    pathBlank.setAttribute('style', 'pointer-events: visiblePainted;');

    pathHolder.setAttribute('r', holderRadius);
    pathHolder.setAttribute('fill', colorDash);
    pathHolder.setAttribute('stroke', colorBg);
    pathHolder.setAttribute('stroke-width', holderStroke);
    pathHolder.setAttribute('transform','translate('+ (pathBg.getPointAtLength(stepLength * currentStep).x) +','+ (pathBg.getPointAtLength(stepLength * currentStep).y) +')');

    svg.appendChild(pathBg);
    svg.appendChild(pathFg);
    svg.appendChild(pathDash);
    svg.appendChild(pathBlank);
    svg.appendChild(pathHolder);

    return svg;
  };

  var setSliderStep = function(step) {
    var label = document.getElementById(options.label);

    if(label !== null) {
      label.innerHTML = options.min + (options.step * step);
    }

    if(step == -1) {
      if(label !== null) {
        label.innerHTML = options.max;
      }
      step = steps;
    }

    pathFg.setAttribute('stroke-dashoffset', stepLength * (steps - step));

    pathHolder.setAttribute('transform','translate('+ (pathBg.getPointAtLength(stepLength * step).x) +','+ (pathBg.getPointAtLength(stepLength * step).y) +')');
  };

  var getStepByCurveLength = function(x) {
    var s = 0;

    if(x > curveLength-(stepLength*0.2)) {
      s = -1;
    }
    else if(x > (stepLength*0.2)) {
      s = Math.floor(x / stepLength) + 1;
    }

    return s;
  };

  var handleMouseDown = function(event) {
    event.preventDefault();
    event.stopPropagation();
    svg.setAttribute('style', 'pointer-events: auto;');

    document.body.addEventListener("mousemove", handleEvent, false);
    document.body.addEventListener("mouseup", handleMouseUp, false);

    handleEvent(event);
  };

  var handleMouseUp = function(event) {
    event.preventDefault();
    event.stopPropagation();
    svg.setAttribute('style', 'pointer-events: none;');

    document.body.removeEventListener("mousemove", handleEvent, false);
    document.body.removeEventListener("mouseup", handleMouseUp, false);
  };

  var handleTouchStart = function(event) {
    event.preventDefault();
    event.stopPropagation();
    svg.setAttribute('style', 'pointer-events: auto;');

    document.body.addEventListener("touchmove", handleEvent, false);
    document.body.addEventListener("touchend", handleTouchEnd, false);

    handleEvent(event);
  };

  var handleTouchEnd = function(event) {
    event.preventDefault();
    event.stopPropagation();
    svg.setAttribute('style', 'pointer-events: none;');

    document.body.removeEventListener("touchmove", handleEvent, false);
    document.body.removeEventListener("touchend", handleTouchEnd, false);
  };

  var handleEvent = function(event) {
    var angle = 0;
    var svgBox = svg.getBoundingClientRect();
    var boxRadius = svgBox.width/2;
    var scale = boxRadius/options.radius;
    var x = Math.floor(svgBox.left);
    var y = Math.floor(svgBox.top);

    var cX = event.clientX;
    var cY = event.clientY;
    if(window.TouchEvent && event instanceof TouchEvent) {
      cX = event.touches[0].clientX;
      cY = event.touches[0].clientY;
    }

    var origin = new Point(x + boxRadius, y + boxRadius);
    var target = new Point(cX - origin.x, -1 * (cY - origin.y));

    var radians = Math.atan2(target.y, target.x) - Math.atan2(0, 1);

    if (target.x < 0 && target.y > 0) {
      angle = 450 - (radians * 180 / Math.PI);
    } else {
      angle = 90 - (radians * 180 / Math.PI);
    }

    var currentLength = (angle/360) * 2 * Math.PI * circleRadius;
    currentStep = getStepByCurveLength(currentLength);
    setSliderStep(currentStep);
  };

  var init = function(newOptions) {
    options = newOptions;

    steps = Math.floor((options.max - options.min) / options.step);
    svg = buildGraph();

    svg.addEventListener("mousedown", handleMouseDown, false);
    svg.addEventListener("touchstart", handleTouchStart, false);

    setSliderStep(0);
    document.getElementById(options.container).appendChild(svg);
  };

  return {
    init: init
  };
};

