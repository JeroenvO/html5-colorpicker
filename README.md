html5-colorpicker
=================

HTML5 canvas colorpicker, works in all modern browsers. Easily choose a color in HSV

Works in all modern browsers that support html5 canvas

Uses HTML5, javascript but not Jquery. Can easily be used as plugin.

Look at the colorpicker-demo.html file for examples

demo will soon be online

use as 
```js
[name] = new colorPicker( [canvas to bind to] , [ options ] )
```
the [name] is used to call any of the functions after creation

## options ##
* h		 	 -> initial color hue
* s		 	 -> initial color saturation
* v  	 	 -> initial color value
* image		 -> the image to use for the background. Default is color-500.png
* centerX, centerY -> define a custom center position for the colorpicker. The center of the canvas is default
* drawInterval	   -> number of milliseconds between drawing. default is 10ms = 100hz. The real speed depends on the browser and computer.
* scale			 -> set the scale of the colorpicker. This is the number of pixels the arc for value is thick. When not set, it adapts to the canvas size: scale = min(w,h) / 10.
* autoStartDraw	->Start the drawing timer when the colorpicker is made, this is default. Set it to false if the colorpicker is hidden, and then start the drawing manually with colorpicker.startDraw(). This way the colorpicker doesn't use CPU when it is not visible.

## functions ##
* onColorChange 	 -> callback on dragging the handles
* onCenterClick 	 -> callback on clicking on the center
to set options after creating the colorpicker use these functions.
* [name].setColorHSV(h,s,v)	->to set the color to a hsv value
	
to retrieve values at any moment use. All values are floats between 0 to 1
* [name].getColorHSV() to get the color in HSV
* [name].getColorHSL() to get the color in HSL (for use in CSS colors)


## jQuery ##
To use this with jQuery, use the jquery wrapper plugin 'jquery-colorpicker.js' and also include the original file 'colorPicker.js'.
See colorpicker-jquery-demo.html for example

use selector.data('tp') to access the colorPicker javascript functions:
* $('#1').data('tp').setColorHSV(Math.PI,50,100)

## WinJS ##
The colorpicker can be used in a winJS windows 8.1 or phone 8.1 app just like it can be used on a website.
Include the colorPicker.js in the js folder of the project.
