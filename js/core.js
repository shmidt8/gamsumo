// Ready /////////////////////////////////////////////

$(document).ready(function(){

  $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    asNavFor: '.slider-nav'
  });




  $('.slider-nav').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    centerMode: true,
    arrows: false,
    focusOnSelect: true,
  });


  $('.slider-news').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    autoplay: true
  });


  $('.slider-small').slick({
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1270,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });



  // Sticky header
  (function() {
    var el = document.querySelector('.header__nav');
    var parent = document.querySelector('.main-menu_wrapper');

    var elHeight;
    var scrolled;

    window.onscroll = function () {
      elHeight = el.offsetHeight;
      scrolled = window.pageYOffset || document.documentElement.scrollTop;
      if (scrolled > 0) {
        el.classList.add('is-stuck');
        parent.style.paddingTop = (elHeight + 'px');
      } else {
        el.classList.remove('is-stuck');
        parent.style.paddingTop = '';
        if (parent.getAttribute('style') == '') {
          parent.removeAttribute('style');
        }
      }
    }
  })();

  // Sticky hamburger
  (function() {
    var el = document.querySelector('.mobile-hamburger');
    var right;
    var new_right;
    function onResize() {
      right = document.querySelector('.left').getBoundingClientRect().right;
      new_right = document.documentElement.clientWidth - right;
      el.style.right = new_right + 10 + 'px';
    }
    onResize();
    window.onresize = function () {
      onResize();
    }
  })();

  //////////////////////////////////////////////////////////////////////
  // Mobile Sidebar
  //////////////////////////////////////////////////////////////////////
  var mobileSidebar = function()
  {
      function obj()
      {
          var self = this;
          self.animSpeed = 400;
          self.init = function()
          {
              self.events();
          },
          self.events = function()
          {
              $('.sidebar-open').click(function() {
                  self.open();
              });
              $('.sidebar-close, .sidebar-overlay').click(function() {
                  self.close();
              });
          },
          self.open = function()
          {
              $('.sidebar').addClass('sidebar_opened');
              $('.sidebar-overlay').fadeIn(self.animSpeed);
              pageScroll.hide(1);
          },
          self.close = function()
          {
              $('.sidebar').removeClass('sidebar_opened');
              $('.sidebar-overlay').fadeOut(self.animSpeed);
              pageScroll.show(0);
          }
      }
      return new obj();
  }();
  mobileSidebar.init();

  // Mobile menu
  $(document).on('click', '.ms-menu .trigger', function() {
      $(this).toggleClass('active');
      $(this).closest('li').toggleClass('active');
      $(this).closest('li').children('ul').toggleClass('active');
      $(this).closest('li').children('ul').slideToggle(200);
  });



  // Basictable
  $('.text_block table').basictable({breakpoint: 800});

  // Datepicker
  $('.datepicker-inline').datepicker({
    prevHtml: '<div class="datepicker-arrow-prev"></div>',
    nextHtml: '<div class="datepicker-arrow-next"></div>',
    navTitles: {
      days: 'MM <i>yyyy</i>',
    }
  });



  // FAQ
  (function() {
    $(document).on('click', '.appeal_top', function() {
      $(this).toggleClass('is-active');
      $(this).closest('.appreal_item').find('.appeal_bottom').slideToggle(400);
    });
  })();


   $("[data-fancybox]").fancybox();


});






(function($){       
    jQuery.fn.lightTabs = function(options){
        
        var createTabs = function(){
            tabs = this;
            i = 0;
            
            showPage = function(i){
                $(tabs).children("div").children("div").hide();
                $(tabs).children("div").children("div").eq(i).show();
                $(tabs).children("ul").children("li").removeClass("active");
                $(tabs).children("ul").children("li").eq(i).addClass("active");
            }
            
            showPage(0);        
            
            $(tabs).children("ul").children("li").each(function(index, element){
                $(element).attr("data-page", i);
                i++;                        
            });
            
            $(tabs).children("ul").children("li").click(function(){
                showPage(parseInt($(this).attr("data-page")));
            });       
        };    
        return this.each(createTabs);
    };  
})(jQuery);
$(document).ready(function(){
    $(".tabs").lightTabs();
});