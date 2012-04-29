(function($) {

  var methods = {
    init : function(arg1, arg2) { 
    }, // endfunction

    start : function( ) {
    }, // endfunction

    end : function( ) { 
    }, // endfunction

    text : function(content) { 
    } // endfunction

    find : function(content) { 
    } // endfunction

  }; // endobject


  $.fn.caret = function(method) {
    
    /* Figure out which method to call and pass the appropriate
       parameters. */
    if (methods[method]) {
      return methods[ method ].apply( 
            this, Array.prototype.slice.call(arguments, 1) 
         );

    /* If no parameters are passed, just call the init routine. */
    } else if (typeof(method) === 'object' || !method) {
      return methods.init.apply(this, arguments);

    } else {
      $.error('Method ' + method + ' does not exist on jQuery.caret');
    } // endif    
  
  }; // endfunction

})(jQuery);

