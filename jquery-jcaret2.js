/****************
       Copyright (C) 2012 Shawn Wilson <shawn@ch2a.ca>
       
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
****************/


(function($) {

   /******  PRIVATE FUNCTIONS ******/

   /* 
    *  This is a utility function to find out the currently selected
    *  text is no matter what the browser is.  It returns an array
    *  of the format [start, end].
    */
   var getSelectRange = function() {

      var node = this,
          domNode = node[0],
          selectStart, selectEnd, r1, r2;

      /* This is what actually figures out the selection positions. */
      selectStart = domNode.selectionStart;
      selectEnd = domNode.selectionEnd;

      /* 
       *  If we're on a browser that supports the selectionStart method,
       *  then just return an array w/ the start & end values.
       */
      if (typeof(selectStart) === "number") {
         return [selectStart, selectEnd];
      
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
         if(r1.text === ""){
            selectStart = domNode.value.length;
         } // endif

         /* Figure out the selection end position. */
         r2.moveStart( "character", (-1 * domNode.value.length));
         selectEnd = r2.text.length;

         return [selectStart, selectEnd];
      } // endif


      /* If we got here, something went wrong. */
      return null;
   }; // endfunction


   /* 
    *  This is a utility function to set the selected text no 
    *  matter what the browser is.  It takes as arguments the start
    *  and end positions of the text to select.
    */
   var setSelectRange = function(start, end) {

      var node = this,
          domNode = node[0];

      /* Internet explorer is retarded so we have to use a different
         method do highlight the text. */
      if ($.browser.msie) {
         var selRange = domNode.createTextRange();
         selRange.collapse(true);
         selRange.moveStart('character', start);
         selRange.moveEnd('character', end - start);
         selRange.select();

      /* Normal browsers, setting highlighted text range is easy. */
      } else {
         domNode.selectionStart = start;
         domNode.selectionEnd = end;
      } // endif

      domNode.focus();
      return node;
   }; // endfunction
         
      
   
   /****** PUBLIC METHODS ******/

   var methods = {
 
      /********
       * INIT
       ********/
      init : function(arg1, arg2) { 
         var node = this,
             domNode = node[0],
             start, end;
   
         /* If we got no arguments, then return the current range. */
         if (!arg1) {
            return getSelectRange.apply(node);
         } // endif


         /*  
          *  We got some arguments, so see what they are and set the
          *  the starting and ending selection range accordingly.
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


         /* BAD ARGS */
         } else {
            return null;
         } // endif


         /* We made it this far so select the text. */
         return setSelectRange.apply(node, [start, end]);
      }, // endfunction

  
      /********
       * START
       ********/
      start : function() {
         return setSelectRange.apply(this, [0, 0]);
      }, // endfunction

  
      /********
       * END
       ********/
      end : function() { 
         var node = this,
             domNode = node[0],
             val = domNode.value;

         return getSelectRange.apply(this, [val.length, val.length]);
      }, // endfunction


      /********
       * TEXT
       ********/
      text : function(replaceText) { 
         var node = this,
             domNode = node[0],
             val = domNode.value,
             range = getSelectRange.apply(node);

         /* If we got no arguments, return the highlighted text. */
         if (!replaceText) {
            return val.slice(range[0], range[1]);
         } // endif


         /*
          *  We must have got an argument so that means we need to
          *  replace the selected text with the given string.
          */
         domNode.value = val.substr(0, range[0]) + replaceText +
                         val.substr(range[1] + 1);
         domNode.focus();
         return node;
      }, // endfunction
  

      /********
       * FIND
       ********/
      find : function(arg1) { 
         var node = this,
             domNode = node[0],
             start = 0, 
             end = 0,
             strObjType = Object.prototype.toString.call(arg1); 


         /* STRING */
         if (typeof(arg1) === "string") {
            /* Search for the string.  If we find it, figure out the
               start and end points so we can highlight it. */
            var strIndex = domNode.value.indexOf(arg1);
            if (strIndex >= 0) {
               start = strIndex;
               end = strIndex + arg1.length;
            } // endif


         /* REGULAR EXPRESSION */
         } else if (strObjType === "[object RegExp]") {
            /* Evaluate the regular expression.  Figure out the start
               and end points so we can highlight it. */
            var re = arg1.exec(domNode.value);
            if(re !== null) {
               start = re.index;
               end = start + re[0].length;
            } // endif
         } // endif


         /* If there's no range to select then refocus the field and 
            we're done. */
         if (start == end) {
            domNode.focus();
            return node;
         } // endif

         /* We made it this far so select the text. */
         return setSelectRange.apply(node, [start, end]);
      } // endfunction
 
   }; // endobject
 


   /***** PLUGIN SCAFFOLD *****/

   $.fn.caret = function(method) {

      /* Figure out which method to call and pass the appropriate
         parameters. */
      if (methods[method]) {
         return methods[method].apply( 
               this, Array.prototype.slice.call(arguments, 1) 
            );
      } // endif 

      /* If no parameters are passed, just call the init routine. */
      if (typeof(method) === 'object' || 
          typeof(method) === 'number' ||
          !method) {
         return methods.init.apply(this, arguments);
      } // endif

      $.error('Method ' + method + ' does not exist on jQuery.caret');
   
   }; // endfunction

})(jQuery);

