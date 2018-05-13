# CircularSlider

## Demo

http://htmlpreview.github.io/?https://github.com/senicar/CircularSlider/blob/master/index.html

[![screenshot](https://github.com/senicar/CircularSlider/blob/master/demo.png)](http://htmlpreview.github.io/?https://github.com/senicar/CircularSlider/blob/master/index.html)

## Usage

Add this inside `<body>`
```html
<div>$<span id="foodValue"></span> Food</div>

<div id="sliders" class="sliders"></div>

<script src="circularSlider.js"></script>

<script>
var foodSlider = new CircularSlider().init({
  label: "foodValue",
  container: "sliders",
  color: "#0072b2",
  max: 52,
  min: 12,
  step: 2,
  radius: 170
});
</script>
```
