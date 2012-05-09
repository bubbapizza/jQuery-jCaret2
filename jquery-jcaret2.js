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

   /******  PRIVATE ******/

   /* 
    *  This is a utility function to find the start and end positions
    *  of a substring or regular expression within a given string.
    */
   var findRange = function(str, arg1) {
      var start = 0, 
          end = 0,
          strObjType = Object.prototype.toString.call(arg1); 

      /* STRING */
      if (typeof(arg1) === "string") {
         /* Search for the string.  If we find it, figure out the
            start and end points so we can highlight it. */
         var strIndex = str.indexOf(arg1);
         if (strIndex >= 0) {
            start = strIndex;
            end = strIndex + arg1.length;
         } // endif


      /* REGULAR EXPRESSION */
      } else if (strObjType === "[object RegExp]") {
         /* Evaluate the regular expression.  Figure out the start
            and end points. */
         var re = arg1.exec(str);
         if(re !== null) {
            start = re.index;
            end = start + re[0].length;
         } // endif
      } // endif

      return [start, end];
   }; // endfunction


   /* 
    *  This is a utility function to find out the currently selected
    *  text is no matter what the browser is.  It returns an array
    *  of the format [start, end].
    */
   var getSelectRange = function(domNode) {
      var selectStart, selectEnd, r1, r2;

      /* This is what actually figures out the selection positions. */
      selectStart = domNode.selectionStart;
      selectEnd = domNode.selectionEnd;

      /* 
       *  If we're on a browser that supports the selectionStart method,
       *  then just return an array w/ the start & end values.
       */
      if (typeof(selectStart) === "number") {
         return [selectStart, selectEnd];
      } // endif
      
      /* 
       *  Our browser doesn't support selectionStart so maybe we can 
       *  hack around it with the document.selection property.
       */
      if (document.selection) {

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
   var setSelectRange = function(domNode, start, end) {

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
   }; // endfunction
         
      
   
   /****** PUBLIC ******/

   var methods = {
 
      /********
       * INIT
       ********/
      init : function(arg1, arg2) { 
         var jqNodes = this,
             domNode = jqNodes.get(0),
             start, end;
   
         /* If we got no arguments, then return the current range. */
         if (arg1 == undefined) {
            return getSelectRange(domNode);
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
            if (typeof(arg2) === "number") {
               end = arg2;
            } else {
               end = start;
            } // endif


         /* BAD ARGS */
         } else {
            return null;
         } // endif


         /* We made it this far so select the text. */
         setSelectRange(domNode, start, end);

         return jqNodes;
      }, // endfunction

  
      /********
       * START
       ********/
      start : function(arg1) {
         var jqNodes = this,
             domNode = jqNodes.get(0),
             range;

         /* If we got an argument, find the start of the range. */
         if (arg1) { 
            range = findRange(domNode.value, arg1);
            setSelectRange(domNode, range[0], range[0]);
   
         /* Otherwise, position to the start of the field. */
         } else { 
            setSelectRange(domNode, 0, 0);
         } // endif

         return jqNodes;
      }, // endfunction

  
      /********
       * END
       ********/
      end : function(arg1) { 
         var jqNodes = this,
             domNode = jqNodes.get(0),
             lastpos = domNode.value.length,
             range;

         /* If we got an argument, find the end of the range. */
         if (arg1) { 
            range = findRange(domNode.value, arg1);
            setSelectRange(domNode, range[1], range[1]);
   
         /* Otherwise, position to the end of the field. */
         } else { 
            setSelectRange(domNode, lastpos, lastpos);
         } // endif

         return jqNodes;
      }, // endfunction


      /********
       * TEXT
       ********/
      text : function(replaceText) { 
         var jqNodes = this,
             domNode = jqNodes.get(0),
             val = domNode.value,
             range = getSelectRange(domNode);

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

         return jqNodes;
      }, // endfunction
  

      /********
       * FIND
       ********/
      find : function(arg1) { 
         var jqNodes = this,
             domNode = jqNodes.get(0),
             range;

         /* Find the start/end positions of the range. */
         range = findRange(domNode.value, arg1);

         /* If there's no range to select then refocus the field,
            preserving the current caret position and we're done. */
         if (range[0] == range[1]) {
            domNode.focus();

         /* We do have a range so select the text. */
         } else {
            setSelectRange(domNode, range[0], range[1]);
         } // endif

         return jqNodes;
      } // endfunction
 
   }; // endobject
 


   /***** PLUGIN SCAFFOLD *****/

   $.fn.caret = function(method) {
      var jqNodes = this;

      /* Figure out which method to call and pass the appropriate
         parameters. */
      if (methods[method]) {
         return methods[method].apply( 
               jqNodes, Array.prototype.slice.call(arguments, 1) 
            );
      } // endif 

      /* If no parameters are passed, just call the init routine. */
      if (typeof(method) === 'object' || 
          typeof(method) === 'number' ||
          !method) {
         return methods.init.apply(jqNodes, arguments);
      } // endif

      $.error('Method ' + method + ' does not exist on jQuery.caret');
   
   }; // endfunction

})(jQuery);

