/* 
 * serial scroller
 *
 * (c)opyright 2012-2016 Michael Daum http://michaeldaumconsulting.com
*/
"use strict";
(function($) {

  var defaults = {
    pagesize: 10,
    width: 'auto',
    easing: 'easeOutQuart',
    duration: 500,
    cycle: true,
    counter: true,
    widthElem: undefined
  };

  function SerialPager(elem, opts) {
    var self = this;

    self.elem = $(elem); 
    self.opts = $.extend({}, defaults, opts, self.elem.data()); 
    self.init(); 
  }

  SerialPager.prototype.init = function () {
    var self = this;

    self.elem.on("refresh", function(ev, filter) {
      //console.log("got a refresh event",filter);
      self.undoPager();
      if (typeof(filter)) {
        self.opts.filter = filter;
      } else {
        self.opts.filter = undefined;
      }
      self.setupPager();
    });

    self.setupPager();
  };

  SerialPager.prototype.setupPager = function() {
    var self = this,
        nrVals, page,
        $ul = self.elem.find("ul"),
        $newUl, $prev, $next, $counter,
        nrPages, $pane, filterRegExp;

    if (typeof(self.buttons) !== 'undefined') {
      self.buttons.remove();
      self.buttons = undefined;
    }

    if (self.opts.filter) {
      filterRegExp = new RegExp(self.opts.filter, "i");
      $ul.children("li").each(function() {
        var li = $(this);
        if (filterRegExp.test(li.text())) {
          li.removeClass("foswikiHidden");
        } else {
          li.addClass("foswikiHidden");
        }
      });
    } else {
      $ul.children("li").removeClass("foswikiHidden");
    }

    nrVals = $ul.children("li").not(".foswikiHidden").length;

    // add pager if pagesize is exceeded
    if (nrVals <= self.opts.pagesize) {
      return 0;
    }
    
    // create pane holding lists if items
    $pane = $("<div class='jqSerialPagerScrollPane clearfix'></div>").appendTo(self.elem);
    nrPages = Math.ceil(nrVals / self.opts.pagesize);

    //console.log("nrVals="+nrVals,"pagesize="+self.opts.pagesize,"nrPages="+nrPages);

    for (page = 0; page < nrPages; page++) {
      $newUl = $("<ul class='jqSerialPagerPage'></ul>").appendTo($pane);
      $ul.find("li:lt("+self.opts.pagesize+")").appendTo($newUl);
    }

    // remove the old list as everything has been moved over to the pane
    $ul.remove();

    // create pager ui
    self.buttons = $("<div class='jqSerialPagerButtons clearfix'></div>").width(self.opts.width).insertAfter(self.elem);
    $prev = $("<a href='#' class='jqSerialPagerPrev i18n'>prev</a>").appendTo(self.buttons);
    $next = $("<a href='#' class='jqSerialPagerNext i18n'>next</a>").appendTo(self.buttons);

    if(self.opts.counter) {
      $counter = $("<div class='jqSerialPagerCounter'>1/"+nrPages+"</div>").appendTo(self.buttons);
    }

    // init the serial scroll
    self.elem.serialScroll({
      items:'.jqSerialPagerPage',
      prev:$prev,
      next:$next,
      constant:false,
      duration:self.opts.duration,
      start:0,
      force:false,
      cycle:self.opts.cycle,
      lock:false,
      easing:self.opts.easing,
      onBefore:function(e, elem, $pane, items, pos) {
        if (self.opts.counter) {
          $counter.html((pos+1)+"/"+nrPages);
        }
        if (!self.opts.cycle) {
          if (pos === 0) {
            $prev.css("visibility", "hidden");
          } else {
            $prev.css("visibility", "visible");
          }
          if (pos+1 === nrPages) {
            $next.css("visibility", "hidden");
          } else {
            $next.css("visibility", "visible");
          }
        }
      }
    });

    // fix width of pages
    setTimeout(function() {
      var $widthElem = self.opts.widthElem?self.elem.find(self.opts.widthElem).first():self.elem,
          width = $widthElem.width();
      if (width) {
        self.elem.find(".jqSerialPagerPage").css("width", width);
      }
    }, 0);

    self.elem.width(self.opts.width);

    // initial button state
    if (!self.opts.cycle) {
      $prev.css("visibility", "hidden");
    }

    return nrPages;
  };

  SerialPager.prototype.undoPager = function() {
    var self = this,
        $newUl = $("<ul></ul>");

    self.elem.find(".jqSerialPagerPage>li").each(function() {
      $newUl.append(this);
    });

    self.elem.find(".jqSerialPagerScrollPane").remove();
    $newUl.appendTo(self.elem);

    return $newUl.length;
  };

  $.fn.serialPager = function (opts) { 
    return this.each(function () { 
      if (!$.data(this, "SerialPager")) { 
        $.data(this, "SerialPager", new SerialPager(this, opts)); 
      } 
    }); 
  };

  $(function() {
    $(".jqSerialPager:not(.jqInitedSerialPager)").livequery(function() {
      var $this = $(this);

      $this.serialPager().addClass("jqInitedSerialPager");
    });
  });
})(jQuery);
