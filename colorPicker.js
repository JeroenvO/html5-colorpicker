/*
    HTML5 canvas colorpicker

    Copyright (C) 2014 J.J. van Oorschot

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/
/*
html5, canvas, javascript colorpicker, touch friendly (no jquery)
choose a color from hsv values, used for a rgb ledstrip
uses the basis of html5 canvas timepicker
*/
//draw function to do all the drawing.
colorPicker.prototype.draw = function(drawHandles){
	if(this.changed){
		this.ctx.save();
		//clear canvas first
		this.ctx.clearRect ( 0 , 0 , this.canvas.width , this.canvas.height );
		//square as background
		this.ctx.beginPath();
		this.ctx.rect(0,0,2*this.centerX , 2*this.centerY);
		this.ctx.closePath();
		this.ctx.fillStyle = this.bgcolor; //background color
		this.ctx.fill();
		
		//draw around center
		this.ctx.translate(this.centerX, this.centerY);
		
		//background for value ring
		//get color for display in css, hsv to hsl. value is constant 100%, 	
		hsl = hsv2hsl(this.h/Math.PI*180,this.s*100,100);
		hsl = 'hsl('+hsl.h+','+hsl.s+'%,'+hsl.l+'%)';
		
		//draw the arc as very thick lines
		this.ctx.lineWidth = this.scale; 
		
		//draw outer circle for value ring
		this.ctx.beginPath();
		this.ctx.strokeStyle = hsl;
		this.ctx.arc(0,0, this.scale*4+this.scale/2, 0, 2*Math.PI, false);
		this.ctx.stroke();
		this.ctx.closePath();
		
		//draw colorgradient
		this.ctx.drawImage(this.clrImg, -this.scale*5, -this.scale*5, this.scale*10, this.scale*10);
		
		//get color for center
		hsl = hsv2hsl(this.h/Math.PI*180,this.s*100,this.v*100);
		hsl = 'hsl('+hsl.h+','+hsl.s+'%,'+hsl.l+'%)';
		
		//draw inside, chosen color
		this.ctx.beginPath();
		this.ctx.arc(0,0, this.scale*1, 0, 2*Math.PI, false);
		this.ctx.closePath();
		this.ctx.fillStyle = hsl;
		this.ctx.fill();
	
		//draw the handles
		this.ctx.save();
		//color handle
		this.ctx.rotate(this.h);
		this.ctx.translate(this.scale+this.s*this.scale*3,0); //go to handle location
		this.drawHandle('c');
		//set canvas origin
		this.ctx.restore(); //restore the canvas so that origin is in center of image
		//value handle
		this.ctx.rotate(this.v*2*Math.PI);
		this.ctx.translate(this.scale*4.5,0); //go to handle location
		this.drawHandle('v');
		this.ctx.restore();
	}
	this.changed = false;
}
//draw the circles that are used for input
colorPicker.prototype.drawHandle =  function(handle){
	var lw = Math.round(this.scale/6.66667,0);
	//draw handle
	this.ctx.lineWidth = lw;
	this.ctx.beginPath();
	//this.ctx.strokeStyle='white'
	this.ctx.arc(0,0, this.scale/2-lw/2, 0, 2*Math.PI, false);
	this.ctx.closePath();
	
	this.ctx.fillStyle = 'rgba(0,0,0,0)';//color inside handle
	this.ctx.strokeStyle = (this.selected===handle)?'rgba(220,220,220,0.7)':'rgba(255,255,255,1)';  //color of ring, first: when selected, second: other
	this.ctx.stroke();
	this.ctx.fill();
}
//return the position of the mouse relative to the canvas
colorPicker.prototype.getMousePos = function(evt) {
	var rect = this.canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}
//returns the centers of the handles for the minutes and hours.
//Used to draw the handles and to check whether they are selected
colorPicker.prototype.getHandlers = function(){
/*
	v: Value, ring
	c: Color, inner circle
	*/
	return {
		xv : this.centerX+Math.cos(this.v * 2*Math.PI)*(this.scale*4.5),
		yv : this.centerY+Math.sin(this.v * 2*Math.PI)*(this.scale*4.5), 
		xc : this.centerX+Math.cos(this.h)*(this.scale*3*this.s+this.scale),
		yc : this.centerY+Math.sin(this.h)*(this.scale*3*this.s+this.scale)
	};
}
//check whether a given position (of the mouse) in xMouse and yMouse falls inside one of the handlers.
//used for checked whether handle is selected
colorPicker.prototype.contains = function(xMouse, yMouse){
	handlersPos = this.getHandlers();
	if((Math.pow(handlersPos.xv-xMouse,2)+Math.pow(handlersPos.yv-yMouse,2))  <= this.scale/2*this.scale/2 )
		{return 'v'; }
	if((Math.pow(handlersPos.xc-xMouse,2)+Math.pow(handlersPos.yc-yMouse,2)) <= this.scale/2*this.scale/2 )
		{return 'c'; }
	else
		return false;
}
//convert hsv to hsl
function hsv2hsl(hue,sat,val){
    // determine the lightness in the range [0,100]
    var l = (2 - sat / 100) * val / 2;

    // store the HSL components
    hsl = {
          'h' : hue,
          's' : sat * val / (l < 50 ? l * 2 : 200 - l * 2),
          'l' : l
        };
    // correct a division-by-zero error
    if (isNaN(hsl.s)) hsl.s = 0;
	return hsl;
}
//set the width of the canvas
colorPicker.prototype.setWidth = function(w,h,centerX,centerY,scale){
	this.canvas.width =w;
	this.canvas.heigth = h;
	this.centerX = centerX || w/2;
	this.centerY = centerY || h/2;
	this.scale = scale || Math.min(w,h)/10; //size of one arc. 40 (=40px) is the same as alarms app one alarm view.
	this.changed = true;
}
//return the chosen color as HSV
colorPicker.prototype.getColorHSV = function(){
	return {
		h : this.h,
		s : this.s,
		v : this.v
	}
}
//return the chosen color as HSL
colorPicker.prototype.getColorHSL = function(){
	hsl = hsv2hsl(this.h,this.s,this.v)
	return {
		h : hsl.h,
		s : hsl.s,
		l : hsl.l
	}
}
//set the colorPicker to a given color in hsv values
colorPicker.prototype.setColorHSV = function(h, s, v){
	this.h = h<2*Math.PI?h:0;
	this.s = (s<100?s:0)/100;
	this.v = (v<100?v:0)/100;
	this.changed = true;
}
//start the timer for drawing
colorPicker.prototype.startDraw = function(){
	if(!this.drawID){
		var colorPicker = this;
		this.drawID = setInterval(function() { colorPicker.draw(); }, colorPicker.drawInterval);
	}
}
//stop the timer for drawing, to save cpu
colorPicker.prototype.stopDraw = function(){
	if(this.drawID){
		clearInterval(this.drawID);
		this.drawID = false;
	}
}
//function object for each canvas, for each colorPicker
//contains all variables for a colorPicker like scale and color.
function colorPicker(canvas,opts){
	//init
	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');            //get the drawable part of the canvas
	var colorPicker = this; 
	//image for the gradient in the center
	this.clrImg = new Image();
	this.clrImg.src = opts.image||'color-500.png';                        //store (this) class in variable, so events can use (this) as well
	//default values, all zero
	this.h = 0;  //0-2pi
	this.s = 0;  //0-100
	this.v = 0;  //0-100
	this.changed = true;
	this.bgcolor = opts.bgcolor||'rgb(200,200,200)';
	//options
	this.setWidth(canvas.width,canvas.height,opts.centerX || false, opts.centerY || false, opts.scale || false);
	//this.drawHandles = (typeof opts.drawHandles === 'undefined' || opts.drawHandles == true)?true:false; //draw handles on the colorPicker. If false, it is just a clock	

//	this.animationStep = opts.animationStep || 5; 	//number of steps in handle animation
	this.drawInterval = opts.drawInterval || 10;	//time between drawing the canvas in ms
	this.onColorChange = opts.onColorChange || false; //callback function
	this.onCenterClick = opts.onCenterClick || false;
	this.setColorHSV(opts.h, opts.s, opts.v);
	
	//start the drawing
	if((typeof opts.autoStartDraw === 'undefined')||opts.autoStartDraw==true;){
		this.drawID = setInterval(function() { colorPicker.draw(); }, colorPicker.drawInterval);
	}else{
		this.drawID = false;
	}

	//if the mouse is down, check whether it is on any of the handles
	canvas.addEventListener('mousedown', function(e) {
		//console.log(e);
		if(document.body.contains(colorPicker.canvas)){ //only if canvas is visible
			var mouse = colorPicker.getMousePos(e);
			
			colorPicker.selected = colorPicker.contains(mouse.x,mouse.y); //this functions sets colorPicker.selected
			
			if(!colorPicker.selected){ //if not clicked on a ring, move the ring to a position\
				var mx = mouse.x-colorPicker.centerX;
				var my = mouse.y-colorPicker.centerY;
				var len = Math.pow(mx,2)+Math.pow(my,2);
				if(len <= colorPicker.scale*colorPicker.scale*25){ //inside all 5 rings
					if(len > colorPicker.scale*colorPicker.scale){ //outside inner color place
						var angle = Math.atan2(my,mx);
						angle+=(my)<0?2*Math.PI:0;
						if(len<=colorPicker.scale*colorPicker.scale*16){ //inside color area
							colorPicker.h = angle;
							var s = (Math.sqrt(len)-colorPicker.scale)/3/colorPicker.scale;
							s= s>1?1:s;
							colorPicker.s = s<0?0:s;
							colorPicker.selected = 'c';
							if(colorPicker.onColorChange){colorPicker.onColorChange();} //function executed when the handles are changed
						}
						else{ //inside value ring
							colorPicker.v = (angle/(2*Math.PI))%1;
							colorPicker.selected = 'v';
							if(colorPicker.onColorChange){colorPicker.onColorChange();} //function executed when the handles are changed
						}
					}					
				}
			}
			colorPicker.changed = true; //redraw to show selected handle on click, not only on draw
		}
	});
	//if the mouse if moved AND a handler is selected, move the handler and calculate the new time
	canvas.addEventListener('mousemove', function(e) {
		if(colorPicker.selected && document.body.contains(colorPicker.canvas)){
			if(colorPicker.onColorChange){colorPicker.onColorChange();} //function executed when the handles are changed
			//get mouse positions for moving
			var mouse = colorPicker.getMousePos(e);
			var mx = mouse.x-colorPicker.centerX;
			var my = mouse.y-colorPicker.centerY;
			//calculate the rotate angle from the mouse X and Y
			var angle = Math.atan2(my,mx);
			angle+=my<0?2*Math.PI:0;
			if(colorPicker.selected=='c'){
				colorPicker.h = angle;
				console.log("a:"+angle);
				var s = (Math.sqrt(Math.pow(mx,2)+Math.pow(my,2))-colorPicker.scale)/3/colorPicker.scale;
				s= s>1?1:s;
				s = s<0?0:s;
				colorPicker.s = s;
			}
			else if(colorPicker.selected == 'v'){
				colorPicker.v = (angle/(2*Math.PI))%1;
			}
			//the canvas changed, if this is true, it will be redrawn
			colorPicker.changed = true;
		}
	});
	//stop the selection when the mouse is released.
	//bind this one to window to also stop the selection if mouse is released outside the canvas area.
	window.addEventListener('mouseup', function(e) { 
		if(colorPicker.selected && document.body.contains(colorPicker.canvas)){
			//colorPicker.animate(colorPicker.selected,true); //animate handlers to position
			colorPicker.selected = false; // which handle is moving is now stored, so handle can be deselected
			colorPicker.changed = true;
			}
		if(colorPicker.onCenterClick && document.body.contains(colorPicker.canvas)){
			var mouse = colorPicker.getMousePos(e);
			if((Math.pow(colorPicker.centerX-mouse.x,2)+Math.pow(colorPicker.centerY-mouse.y,2))  < colorPicker.scale*colorPicker.scale ){
				colorPicker.onCenterClick();
			}
		}
	});
}