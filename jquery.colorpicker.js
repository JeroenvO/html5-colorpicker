// JavaScript Document

//jquery plugin for html5 timepicker


(function ( $ ) {
	$.fn.colorPicker = function( options ) {
		return this.each(function(){
			$(this).data('tp', new colorPicker(this, options));
		});
	};
}( jQuery ));