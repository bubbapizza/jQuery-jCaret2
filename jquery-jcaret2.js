(function($) {

   var node = this,
       domNode = node[0];


   /* 
    *  We need some utility functions to figure out the start and end
    *  selection text no matter what the browser is.
    */
   var getSelectRange = function() {

      var selectStart, selectEnd, r1, r2;

      selectStart = domNode.selectionStart;
      selectEnd = domNode.selectionEnd;

      /* 
       *  If we're on a browser that supports the selectionStart method,
       *  then just return an array w/ the start & end values.
       */
      if (selectStart) {
         if (typeof(selectStart) == "number") {
            return [selectStart, selectEnd];
         } // endif
      
      /* 
       *  Our browser doesn't support selectionStart so maybe we can 
       *  hack around it with the document.selection property.
       */
      } else if (document.selection) {

         r1 = document.selection.createRange().duplicate();
         r2 = document.selection.createRange().duplicate();

         /* Figure out the selection start position. */
         r1.moveEnd("character", domNode.value.length);
         selectStart = domNode.value.lastIndexOf(r1.text);
         if(r1.text == ""){
            selectStart = domNode.value.length;
         } // endif

         /* Figure out the selection end position. */
         r2.moveStart( "character", (-1 * domNode.value.length));
         selectEnd = r2.text.length;

         return [selectStart, selectEnd]
      } // endif


      /* If we got here, something went wrong. */
      return null;

   } // endfunction

         

      

         
      
   
   var methods = {
 
      /*******
       * INIT
       *******/
      init : function(arg1, arg2) { 
         var start = null,
             end = null;
   
         /*  
          *  Figure out the start and end positions of the highlighted 
          *  text.
          */
   
         /* ARRAY OR DICTIONARY */
         if (typeof(arg1) === "object") {
   
            /* Check for array object. */
            if (arg1.valueOf().splice) {
               start = arg1[0];
               end = arg1[1];
   
            /* Check for dictionary-type object. */
            } else if (typeof(arg1.start) === "number" &&
                       typeof(arg1.end) === "number") {
               start = arg1.start;
               end = arg1.end;
            } // endif
   
   
         /* NUMBER */
         } else if (typeof(arg1) === "number") {
            start = arg1;

            /* 
             *  Optionally, the second argument might be the end position
             *  of the selected text.  If not, there is no selected text
             *  so the end is the same as the start. 
             */
            if (arg2 && typeof(arg2) === "number") {
               end = arg2;
            } else {
               end = start;
            } // endif

         } // endif


         /* If we got no arguments, then return the current range. */

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

