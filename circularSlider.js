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

  var init = function(newOptions) {
    options = newOptions;
  };

  return {
    init: init
  };
};

