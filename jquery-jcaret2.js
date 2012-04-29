(function($) {

  var methods = {
    init : function( options ) { 
    }, // endfunction

    show : function( ) {
    }, // endfunction

    hide : function( ) { 
    }, // endfunction

    update : function(content) { 
    } // endfunction

  }; // endobject

  $.fn.caret = function(method) {
    
    /* Figure out which method to call and pass the appropriate
       parameters. */
    if (methods[method]) {
      return methods[ method ].apply( 
            this, Array.prototype.slice.call(arguments, 1) 
         );

    } else if (typeof(method) === 'object' || !method) {
      return methods.init.apply(this, arguments);

    } else {
      $.error('Method ' + method + ' does not exist on jQuery.caret');
    } // endif    
  
  }; // endfunction

})(jQuery);

