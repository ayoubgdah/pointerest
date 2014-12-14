# Pointerest

Show the key features of your product using elegant points.

---

#### Version
0.3

#### Demo example
http://ayoubgdah.github.io/pointerest/

#### How to use the plugin

- Add jQuery
```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
```
- Add the javascript file: ***pointerest.js***
```html
<script src="pointerest.js"></script>
```
- Add the CSS file: ***pointrerest.css***
```html
<link rel="stylesheet" href="pointerest.css">
```
- Setup your markup and add the points

The basic setup needs only 3 attributes: *data-x*, *data-y* and *data-content*
```html
	<div class="container">
		<span class="point" data-x="280" data-y="200" data-content="Keep your house warm and your wallet full"></span>
		<span class="point" data-x="550" data-y="200" data-content="A better understanding of water consumption"></span>
		<span class="point" data-x="820" data-y="200" data-content="Save energy and money"></span>
		<span class="point" data-x="900" data-y="910" data-content="Pay whenever you are ready"></span>
		<span class="point" data-x="750" data-y="350" data-content="Shows you if you have saved or should do better"></span>
		<span class="point" data-x="850" data-y="530" data-content="Hourly, daily, and monthly reporting"></span>
	</div>
```
Below are the options you can have:

Attribute | Description
--- | ---
data-x | left position of the point
data-y | top position of the point
data-direction | direction the line should go (left/right/top/bottom)
data-color | color to be applied to the point
data-content | the content related to the point
- Fire up the plugin with:
```javascript
// if your points are in the html as shown above
$(".container").Pointerest();

// you can pass on arguments as follow
$(".container").Pointerest({color: "#ccc", radius: 15});

// if you prefer to give your elements as an array of objects, you can do so
var options = {
	color: "steelBlue",
	radius: 15
};
var elements = [
	{
		x: 200,
		y: 100,
		content: "This is the content for the first point"
	},
	{
		x: 150,
		y: 90,
		color: "oliveGreen",
		direction: "right",
		content: "This second point is here"
	},
];
$(".container").Pointerest(elements, options);
```

#### Plugin Options
Option | Default | Description
--- | --- | ---
radius | 10 | The radius of the point in px
color | #333 | The color of the points, could be any css valid color (i.e #ffff, rbg(255, 255, 255) ...). Applied to points (plus line and content) which don't have individual color.
lineThickness | 2 | The thickness of the line that goes from the point to the text in px.
direction | null | Which direction the line goes to. Applied to points which don't have individual direction. If nothing is provided then it is based on the nearest left or right side.
margin | 20 | The gap between the text and the container in px.
animationSpeed | 300 | The speed of the animations: width of the line and text showing.

##### Example
```javascript
$(".container").Pointerest({
	radius: 15,
	lineThickness: 4,
	color: "#999",
	direction: "right",
	margin: {
		left: 20,
		right: 20,
		top: 0,
		bottom: 10
	},
	animationSpeed: 400
});
```
