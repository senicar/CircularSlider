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

  var steps = 0;
  var currentStep = 0;

  var curveLength = 0;
  var stepLength = 0;
  var circleRadius = 0;

  var init = function(newOptions) {
    options = newOptions;

    steps = Math.floor((options.max - options.min) / options.step);
  };

  return {
    init: init
  };
};

