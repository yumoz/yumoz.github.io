/**
 * Modern Minimalist Blog - JavaScript
 * Clean and simple interactions
 */

(function($) {
  'use strict';

  // ========================================
  // Search Functionality
  // ========================================
  var $searchWrap = $('#search-form-wrap');
  var $searchInput = $('.search-form-input');

  // Open search
  $('#nav-search-btn').on('click', function(e) {
    e.preventDefault();
    $searchWrap.addClass('on');
    setTimeout(function() {
      $searchInput.focus();
    }, 100);
  });

  // Close search on backdrop click
  $searchWrap.on('click', function(e) {
    if (e.target === this) {
      $searchWrap.removeClass('on');
    }
  });

  // Close search on Escape key
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape' && $searchWrap.hasClass('on')) {
      $searchWrap.removeClass('on');
    }
  });

  // ========================================
  // Share Functionality
  // ========================================
  $('body').on('click', function() {
    $('.article-share-box.on').removeClass('on');
  });

  $('body').on('click', '.article-share-link', function(e) {
    e.stopPropagation();

    var $this = $(this);
    var url = $this.attr('data-url');
    var encodedUrl = encodeURIComponent(url);
    var id = 'article-share-box-' + $this.attr('data-id');
    var title = $this.attr('data-title');
    var offset = $this.offset();

    // Remove existing share boxes
    $('.article-share-box.on').removeClass('on');

    // Create or show share box
    var $box = $('#' + id);
    if (!$box.length) {
      var html = [
        '<div id="' + id + '" class="article-share-box">',
          '<input class="article-share-input" value="' + url + '" readonly>',
          '<div class="article-share-links">',
            '<a href="https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodedUrl + '" class="article-share-twitter" target="_blank" title="Twitter">',
              '<i class="fab fa-twitter"></i>',
            '</a>',
            '<a href="https://www.facebook.com/sharer.php?u=' + encodedUrl + '" class="article-share-facebook" target="_blank" title="Facebook">',
              '<i class="fab fa-facebook-f"></i>',
            '</a>',
            '<a href="https://www.linkedin.com/shareArticle?mini=true&url=' + encodedUrl + '" class="article-share-linkedin" target="_blank" title="LinkedIn">',
              '<i class="fab fa-linkedin-in"></i>',
            '</a>',
            '<a href="https://service.weibo.com/share/share.php?url=' + encodedUrl + '&title=' + encodeURIComponent(title) + '" class="article-share-weibo" target="_blank" title="Weibo">',
              '<i class="fab fa-weibo"></i>',
            '</a>',
          '</div>',
        '</div>'
      ].join('');

      $box = $(html);
      $('body').append($box);
    }

    // Position and show
    $box.css({
      top: offset.top + 30,
      left: Math.min(offset.left, $(window).width() - $box.outerWidth() - 20)
    }).addClass('on');

    // Auto-select input
    $box.find('.article-share-input').select();
  });

  // Prevent closing when clicking inside share box
  $('body').on('click', '.article-share-box', function(e) {
    e.stopPropagation();
  });

  // Copy to clipboard functionality
  $('body').on('click', '.article-share-input', function() {
    this.select();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.value).then(function() {
        // Optional: Show toast notification
      });
    }
  });

  // ========================================
  // Image Lightbox (Fancybox)
  // ========================================
  $('.article-entry').each(function(i) {
    $(this).find('img').each(function() {
      if ($(this).parent().hasClass('fancybox') || $(this).parent().is('a')) return;

      var alt = this.alt;
      if (alt) $(this).after('<span class="caption">' + alt + '</span>');

      $(this).wrap('<a href="' + this.src + '" data-fancybox="gallery" data-caption="' + alt + '"></a>');
    });

    $(this).find('.fancybox').each(function() {
      $(this).attr('rel', 'article' + i);
    });
  });

  if ($.fancybox) {
    $('.fancybox').fancybox({
      loop: true,
      animationEffect: 'fade',
      transitionEffect: 'slide',
      buttons: ['close', 'fullScreen', 'download'],
      protect: true
    });
  }

  // ========================================
  // Mobile Navigation
  // ========================================
  var $container = $('#container');
  var $mobileNav = $('#mobile-nav');

  $('#main-nav-toggle').on('click', function(e) {
    e.preventDefault();
    $container.toggleClass('mobile-nav-on');
  });

  // Close mobile nav when clicking outside
  $('#wrap').on('click', function(e) {
    if ($container.hasClass('mobile-nav-on') && !$(e.target).closest('#main-nav-toggle').length) {
      $container.removeClass('mobile-nav-on');
    }
  });

  // Close mobile nav on link click
  $('.mobile-nav-link').on('click', function() {
    $container.removeClass('mobile-nav-on');
  });

  // Close mobile nav on Escape key
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape' && $container.hasClass('mobile-nav-on')) {
      $container.removeClass('mobile-nav-on');
    }
  });

  // ========================================
  // Smooth Scroll for Anchor Links
  // ========================================
  $('a[href^="#"]').on('click', function(e) {
    var target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: target.offset().top - 80
      }, 400);
    }
  });

  // ========================================
  // Scroll Effects
  // ========================================
  var $header = $('#header');
  var lastScroll = 0;

  $(window).on('scroll', function() {
    var currentScroll = $(this).scrollTop();

    // Add shadow to header on scroll
    if (currentScroll > 10) {
      $header.css('box-shadow', '0 1px 3px rgba(0,0,0,0.05)');
    } else {
      $header.css('box-shadow', 'none');
    }

    lastScroll = currentScroll;
  });

  // ========================================
  // Article Card Hover Effect
  // ========================================
  $('.article-inner').on('mouseenter', function() {
    $(this).addClass('hover');
  }).on('mouseleave', function() {
    $(this).removeClass('hover');
  });

})(jQuery);
