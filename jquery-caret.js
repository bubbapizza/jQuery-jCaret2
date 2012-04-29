/*
 *
 * Copyright (c) 2010 C. F., Wong (<a href="http://cloudgen.w0ng.hk">Cloudgen Examplet Store</a>)
 *               2012 Shawn Wilson (shawn@ch2a.ca)
 * 
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
﻿

(function($, len, createRange, duplicate) {

   $.fn.caret = function(options,opt2){

      var start = null,
          end = null,
          node = this,
          domNode = node[0],
          msieFlag = $.browser.msie,
          returnVal,

          /* Get the string representation of the object type. */
          strObjType = Object.prototype.toString.call(options);

      /*  
       *  Figure out the start and end positions of the highlighted 
       *  text.
       */

      /* ARRAY OR DICTIONARY */
      if (typeof(options) === "object") {
       
         /* Check for array object. */
         if (options.valueOf().splice) {
            start = options[0];
            end = options[1];

         /* Check for dictionary-type object. */
         } else if (typeof(options.start) === "number" && 
                    typeof(options.end) === "number") {
            start = options.start;
            end = options.end;
         } // endif


      /* NUMBER */
      } else if (typeof(options) === "number" && 
                 typeof(opt2) === "number") {
         start = options;
         end = opt2;


      /* STRING */
      } else if (typeof options==="string") {
    
         /* Search for the string.  If we find it, set the start and
            end points accordingly. */
         var strIndex = domNode.value.indexOf(options);
         if (strIndex >= 0) {
            start = strIndex;
            end = strIndex + options[len];
         } // endif


      /* REGULAR EXPRESSION */
      } else if (strObjType === "[object RegExp]") {

         var re = options.exec(domNode.value);
         if(re != null) {
            start = re.index;
            end = start + re[0][len];
         } // endif

      } // endif


      /*
       *  If we were given a start and end point, then just highlight
       *  the text and we're done.  
       */
      if (start != null) {

         /* Internet explorer is retarded so we have to use a different
            method do highlight the text. */
         if (msieFlag) {
            var selRange = domNode.createTextRange();
            selRange.collapse(true);
            selRange.moveStart('character', start);
            selRange.moveEnd('character', end - start);
            selRange.select();

         } else {
            domNode.selectionStart = start;
            domNode.selectionEnd = end;
         } // endif

         domNode.focus();
         return this


      /*
       *  No values were passed so we have to return an object that will 
       *  allow for inspection of the current selection status.
       */
      } else {

         /* 
          *  Patch suggested by Андрей Юткин.  All this code is needed
          *  just so we can find out the currently selected text range
          *  on internet explorer.
          */
         if(msieFlag) {
            
            var selection=document.selection;

            if (domNode.tagName.toLowerCase() != "textarea") {
                var val = node.val(),
                    range = selection[createRange]()[duplicate]();

                range.moveEnd("character", val[len]);

                if (range.text == "") {
                   start = val[len]
                } else {
                   start = val.lastIndexOf(range.text));
                } // endif

                range = selection[createRange]()[duplicate]();
                range.moveStart("character", -val[len]);
                end = range.text[len];

            } else {
                var range = selection[createRange](),
                    stored_range = range[duplicate]();

                stored_range.moveToElementText(domNode);
                stored_range.setEndPoint('EndToEnd', range);

                start = stored_range.text[len] - range.text[len];
                end = start + range.text[len];
            } // endif


         /* 
          *  For standard browsers, just use selectionStart/End to find
          *  out the starting and ending selection index values.
          */
         } else {
            start = domNode.selectionStart,
            end = domNode.selectionEnd;
         } // endif


         /* This returns the jquery object that users can call to
            get the start, end, text, and a replace function. */
         return {
            start : start,
            end: end, 
            text: domNode.value.substr(start, end),

            /* This is a function for replacing the highlighted text 
               with a given string. */
            replace: 
               function (str) {
                  var val = domNode.value;
                  return val.substr(0, start) + str + val.substr(end + 1);
               } // endfunction
            } // endobject
      } // endif

   } // endfunction

})(jQuery,"length","createRange","duplicate");
