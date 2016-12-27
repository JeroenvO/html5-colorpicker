html5-colorpicker
=================

HTML5 canvas colorpicker, works in all modern browsers. Easily choose a color in HSV

Works in all modern browsers that support html5 canvas

Uses HTML5 and plain javascript. Can easily be used as plugin in javascript or with Jquery.

Look at the colorpicker-demo.html file for examples

Demo on https://jjvanoorschot.nl/scriptsweb/20140520HTML5%20canvas%20colorpicker/colorpicker-demo.html

use as 
```js
[name] = new colorPicker( [canvas to bind to] , [ options ] )
```
the [name] object is used to call any of the functions after creation

## options ##
Options should be provided in key-value pairs.
* h		 	 -> initial color hue
* s		 	 -> initial color saturation
* v  	 	 -> initial color value
* image		 -> the image to use for the background. Default is color-500.png
* centerX, centerY -> define a custom center position for the colorpicker. The center of the canvas is default
* drawInterval	   -> number of milliseconds between drawing. default is 10ms = 100hz. The real speed depends on the browser and computer.
* scale			 -> set the scale of the colorpicker. This is the number of pixels the arc for value is thick. When not set, it adapts to the canvas size: scale = min(w,h) / 10.
* autoStartDraw	->Start the drawing timer when the colorpicker is made, this is default. Set it to false if the colorpicker is hidden, and then start the drawing manually with colorpicker.startDraw(). This way the colorpicker doesn't use CPU when it is not visible.
* nov		-> No-value; Set to true to not draw the value ring. Only use HS and not V. V is set to the constant value of 1.

## functions ##
* onColorChange 	 -> callback on dragging the handles
* onCenterClick 	 -> callback on clicking on the center
to set options after creating the colorpicker use these functions.
* [name].setColorHSV(h,s,v)	->to set the color to a hsv value
	
to retrieve values at any moment use. All values are floats between 0 to 1
* [name].getColorHSV() to get the color in HSV
* [name].getColorHSL() to get the color in HSL (for use in CSS colors)

## Example ##
```html
<canvas width="500" height="500" id="colorPicker1"></canvas>
```
and
```js
colorPicker1 = new colorPicker(document.getElementById('colorPicker1'), {
	bgcolor: 'rgba(50,50,50,0)',
	onColorChange: function(){
		var color = this.getColorHSV();
		document.getElementById('colorPickerValue').innerHTML = "Color h:"+color.h+" s: "+ color.s+" v: "+ color.v;
		},
	onCenterClick: function(){
		window.alert('You clicked the center!');
		}
});
```

## jQuery ##
To use this with jQuery, use the jquery wrapper plugin 'jquery-colorpicker.js' and also include the original file 'colorPicker.js'.
See colorpicker-jquery-demo.html for example

use selector.data('tp') to access the colorPicker javascript functions:
* $('#1').data('tp').setColorHSV(Math.PI,50,100)

## WinJS ##
The colorpicker can be used in a winJS windows 8.1 or phone 8.1 app just like it can be used on a website.
Include the colorPicker.js in the js folder of the project.
