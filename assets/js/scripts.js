var __widthMobile = 1270;
var __widthMobileTablet = 1000;
var __widthMobileTabletMiddle = 820;
var __widthMobileMobile = 540;
var __isMobile = ($(window).width() <= __widthMobile);
var __isMobileTablet = ($(window).width() <= __widthMobileTablet);
var __isMobileTabletMiddle = ($(window).width() <= __widthMobileTabletMiddle);
var __isMobileMobile = ($(window).width() <= __widthMobileMobile);
var __animationSpeed = 350;

function initElements(element) {
	$element=$(element ? element : 'body');

	$(window).on('resize', function(){
		onResize();
	});

	$.widget('app.selectmenu', $.ui.selectmenu, {
		_drawButton: function() {
		    this._super();
		    var selected = this.element
		    .find('[selected]')
		    .length,
		        placeholder = this.options.placeholder;

		    if (!selected && placeholder) {
		      	this.buttonItem.text(placeholder).addClass('placeholder');
		    } else {
		    	this.buttonItem.removeClass('placeholder');
		    }
		}
	});

	$.datepicker.regional['ru']={
           dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
           weekHeader: 'Week',
           dateFormat: 'yy-mm-dd',
           showOtherMonths: true
    };
    $.datepicker.setDefaults($.datepicker.regional['ru']);

	$element.find('select').each(function(i, select) {
		// editable select
		if ($(select).attr('editable')) {
			$(select).editableSelect({ 
				effects: 'fade',
				source: $(select).attr('source') ? $(select).attr('source') : false
			}).on('change.editable-select', function(e) {
				var $holder = $(e.target).closest('.input-holder');
				if ($holder.find('.es-input').val()) {
					$(e.target).closest('.input-holder').addClass('focused');
				} else {
					$(e.target).closest('.input-holder').removeClass('focused');
				}
			});

		// simple select
		} else {
			var offset = $(select).attr('data-offset');
			if ($(select).attr('data-pos') == 'right') {
				var data = {
					position: {my : "right"+(offset?"+"+offset:"")+" top+12", at: "right bottom"}
				}
			} else {
				var data = {
					position: {my : "left"+(offset?"+"+offset:"")+" top+12"}
				}
			}
			if ($(select).attr('placeholder')) {
				data['placeholder'] = $(select).attr('placeholder');
			}
			data['change'] = function(e, ui) {
				$(ui.item.element).closest('.input-holder').addClass('focused');
			}
			$(select).selectmenu(data);
			if ($(select).attr('placeholder')) {
				$(select).prepend('<option value="" disabled selected>' + data['placeholder'] + '</option>');
			}
		}
	});

	$element.find('.js-date').each(function(index, input) {
		var datepicker_options = {
			inline: true,
		    changeYear: true,
		    changeMonth: true
		};
		var minYear = $(input).attr('data-min-year');
		if (minYear) datepicker_options.minDate='01.01.' + minYear;
		else minYear = 'c-10';
		var maxYear = $(input).attr('data-max-year');
		if (maxYear) datepicker_options.maxDate='01.01.' + maxYear;
		else maxYear = 'c+10';
		var defaultDate = $(input).attr('data-default-date');
		if (defaultDate) datepicker_options.defaultDate = defaultDate;
		datepicker_options.yearRange = [minYear, maxYear].join(':');
		
		$(input).attr('type', 'text').datepicker(datepicker_options).addClass('date').val($(input).attr('value')).after('<icon></icon>');
		$(input).next('icon').click(function() {
			$(this).prev('input').datepicker('show');
		});
	});

	$element.find('.js-upload').each(function(index, block) {
		$(block).addClass('upload');
		$(block).find('input:file').change(function() {
			var filename = $(this).val().replace(/^.*[\\\/]/, '');
			$(this).siblings('.btn').html('<span>' + filename + '</span>');
			// FIXME DEMO
			//$(this).closest('.js-upload').siblings('.js-preview').stop().slideDown(__animationSpeed);
		});

		$(block).siblings('.js-preview').find('.close').click(function() {
			$(this).closest('.js-preview').stop().slideUp(__animationSpeed);
		});
	});

	$element.find('input[type="checkbox"], input[type="radio"]').checkboxradio(); 

	$element.find('.modal-close, .close-btn').click(function() {
		hideModal(this);
	});

	$element.find('.tabs, .js-tabs').lightTabs();

	$('body').mouseup(function(e) {
		if ($('.modal-fadeout').css('display') == 'block' && !$('html').hasClass('html-mobile-opened')) {
			if (!$(e.target).closest('.contents').length && !$(e.target).closest('.ui-selectmenu-menu').length && !$(e.target).closest('.ui-datepicker').length) {
				hideModal();
			}
		}
		$('.confirm-popup').each(function(i, confirm) {
			if ($(confirm).css('display') == 'block') {
				if ($(e.target).closest('.confirm-popup') != $(confirm)) {
					$(confirm).stop().fadeOut(__animationSpeed);
				}
			}
		});

		$('.mobile-select').each(function(i, select) {
			if ($(select).children('.mobile-dropdown').css('display') == 'block') {
				if ($(e.target).closest('.mobile-select') != $(select)) {
					$(select).children('.mobile-dropdown').stop().fadeOut(__animationSpeed);
				}
			}
		});

	}).keypress(function(e){
		if ($('.modal-fadeout').css('display') == 'block') {
			if (!e)e = window.event;
			var key = e.keyCode||e.which;
			if (key == 27){
				hideModal();
			} 
		}
	});

	$element.find('.input-holder input, .input-holder textarea').keydown(function() {
		if ($(this).val()) {
			$(this).parent('.input-holder').addClass('focused');
		}
	}).keyup(function() {
		if (!$(this).val()) {
			$(this).parent('.input-holder').removeClass('focused');
		}
	}).focusout(function() {
		if (!$(this).val()) {
			$(this).parent('.input-holder').removeClass('focused');
		}
	}).each(function(i, item) {
		if ($(item).val()) {
			$(item).parent('.input-holder').addClass('focused');
		}
	});

	$element.find('form input:text, form input[type="email"], form input[type="tel"], form input[type="number"], form input[type="password"], form textarea').on('click keyup change', function() {
		checkForm($(this).closest('form'));
	});
	$element.find('form').each(function(i, form) {
		checkForm(form);
	});

	fadeoutInit();
	scrollsInit($element);
}
function onResize() {
	__isMobile = ($(window).width() <= __widthMobile);
	__isMobileTablet = ($(window).width() <= __widthMobileTablet);
	__isMobileTabletMiddle = ($(window).width() <= __widthMobileTabletMiddle);
	__isMobileMobile = ($(window).width() <= __widthMobileMobile);

	fadeoutInit();

	checkLogoFooter()
}

function parseUrl(url) {
	if (typeof(url) == 'undefined') url=window.location.toString();
	var a = document.createElement('a');
	a.href = url;

	var pathname = a.pathname.match(/^\/?(\w+)/i);	

	var parser = {
		'protocol': a.protocol,
		'hostname': a.hostname,
		'port': a.port,
		'pathname': a.pathname,
		'search': a.search,
		'hash': a.hash,
		'host': a.host,
		'page': pathname?pathname[1]:''
	}		

	return parser;
}

function scrollsInit(element, lazy_include = false) {
	var $element = $(element);
	$element.find('.js-scroll').each(function(index, block) {
		if (lazy_include || !$(block).attr('data-lazy-init')) 
			scrollInit(block);
	});
}

function scrollInit(block) {
	if (!$(block).data('scroll-inited')) {
		$(block).mCustomScrollbar({
			theme: 'light-thick',
			scrollbarPosition: 'inside',
			scrollInertia: 400
		});
		$(block).data('scroll-inited', true);
	}
}

function checkForm(form) {
	var checked = true;
	$(form).find('input:text, input[type="email"], input[type="tel"], input[type="password"], input[type="number"], textarea').each(function(i, input) {
		if (!input.checkValidity()) checked = false;
	});
	$(form).find('[data-submit-btn="true"]').attr('disabled', !checked);
	return checked;
}

function showModal(modal_id) {
	var $modal = $('#' + modal_id);
	$('.modal-fadeout').stop().fadeIn(300);
	$modal.stop().fadeIn(450, function() {
			if ($(this).find('.js-scroll[data-lazy-init]').length) {
				scrollsInit($(this), true);
			}
		}).css({
			'display': __isMobileTablet ? 'block' : 'table',
			'top': $(window).scrollTop()
		});

	$modal.children('.modal').addClass('js-test');
	var oversize = $(window).height() < $modal.find('.contents').outerHeight();
	$modal.children('.modal').removeClass('js-test');

	//if (($modal.attr('data-long') || oversize) && $(window).height() > 500) {
	if (($modal.attr('data-long') || oversize)) {
		$('html').addClass('html-modal-long');
	} else {
		$('html').addClass('html-modal');
	}

	fadeoutInit($modal, $modal.find('.contents'));
}

function hideModal(sender) {
	var $modal = sender ? $(sender).closest('.modal-wrapper') : $('.modal-wrapper[display!="none"]');
	$('.modal-fadeout').stop().fadeOut(300);
	$modal.stop().fadeOut(450, function() {
		$('html').removeClass('html-modal html-modal-long').find('#layout').css('height', 'auto');
	});
}

function fadeoutInit(node) {
	$node = $(typeof(node) == 'undefined' ? 'body' : node);
	$node.find('.js-fadeout').each(function(i, block) {
		if (!$(block).data('inited')) {
			var $holder = $('<div class="fadeout-holder"></div>').insertAfter($(block));
			$holder.html($(block));
			$(block).data('inited', true);
		}

		if (typeof($(block).attr('data-nowrap')) != 'undefined' && $(block).attr('data-nowrap') == false) {
			$(block).addClass('nowrap');
		}
		$(block).scrollLeft(0);
		var w_child = 0;
		var range = document.createRange();

		$.each(block.childNodes, function(i, node) {
			if (node.nodeType != 3) {
				w_child += $(node).outerWidth(true);
			} else {
				if (typeof(range) != 'undefined') {
					range.selectNodeContents(node);
					var size = range.getClientRects();
					if (typeof(size) != 'undefined' && typeof(size[0]) != 'undefined' && typeof(size[0]['width'] != 'undefined')) w_child += size[0]['width'];
				}
			}
		});

		var maxWidth = $(block).attr('data-max-width');
		var cloneWidth = $(block).attr('data-clone-width');
		var mobileOnly = $(block).attr('data-mobile-only');

		if (!mobileOnly || (mobileOnly && __isMobileTablet)) {
			if (cloneWidth) {
				$(block).width($(cloneWidth).width());
			}
			var holderWidth = $(block).width();
			if (w_child > holderWidth && (!maxWidth || $(window).width() <= maxWidth)) {
				$(block).addClass('fadeout').removeClass('nowrap').swipe({
					swipeStatus: function(event, phase, direction, distance) {
						var offset = distance;

						if (phase === $.fn.swipe.phases.PHASE_START) {
							var origPos = $(this).scrollLeft();
							$(this).data('origPos', origPos);

						} else if (phase === $.fn.swipe.phases.PHASE_MOVE) {
							var origPos = $(this).data('origPos');

							if (direction == 'left') {
								var scroll_max = $(this).prop('scrollWidth') - $(this).width();
								var scroll_value_new = origPos - 0 + offset;
								$(this).scrollLeft(scroll_value_new);
								if (scroll_value_new >= scroll_max) $(this).addClass('scrolled-full');
								else $(this).removeClass('scrolled-full');

							} else if (direction == 'right') {
								var scroll_value_new = origPos - offset;
								$(this).scrollLeft(scroll_value_new);
								$(this).removeClass('scrolled-full');
							}

						} else if (phase === $.fn.swipe.phases.PHASE_CANCEL) {
							var origPos = $(this).data('origPos');
							$(this).scrollLeft(origPos);

						} else if (phase === $.fn.swipe.phases.PHASE_END) {
							$(this).data('origPos', $(this).scrollLeft());
						}
					},
					threshold: 70
				});
			} else {
				$(block).removeClass('fadeout');
			}
		}
	});
}

function showBottomSection(content) {
	if (content) $('#sticky-bottom-section>.holder').html(content);
	$('#sticky-bottom-section').stop().fadeIn(__animationSpeed);
}

function hideBottomSection() {
	$('#sticky-bottom-section').stop().fadeOut(__animationSpeed);
}

function checkLogoFooter() {
	if (__isMobileTablet) {
		var src = $('#footer-logo>a>img').attr('data-src-mobile');
	} else {
		var src = $('#footer-logo>a>img').attr('data-src');
	}
	$('#footer-logo>a>img').attr('src', src);
}

(function ($) {
	$.fn.lightTabs = function() {
		var showTab = function(tab, saveHash) {
			if (!$(tab).hasClass('tab-act')) {
				var tabs = $(tab).closest('.tabs');

				var target_id = $(tab).attr('href');
		        var old_target_id = $(tabs).find('.tab-act').attr('href');
		        $(target_id).show();
		        $(old_target_id).hide();
		        $(tabs).find('.tab-act').removeClass('tab-act');
		        $(tab).addClass('tab-act');

		        if (typeof(saveHash) != 'undefined' && saveHash) history.pushState(null, null, target_id);
			}
		}

		var initTabs = function() {
            var tabs = this;
            
            $(tabs).find('a').each(function(i, tab){
                $(tab).click(function(e) {
                	e.preventDefault();

                	showTab(this, true);
                	fadeoutInit();

                	return false;
                });
                if (i == 0) showTab(tab);                
                else $($(tab).attr('href')).hide();
            });			
        };

        return this.each(initTabs);
    };

	$(function () {
		initElements();
		onResize();

		// CHECK HASH FOR TABS
		var url_data = parseUrl();
		$('.tabs, .js-tabs').find('a').each(function(i, link) {
			if (url_data.hash == $(link).attr('href')) {
				$(link).click();
			}
		});

		$('a.pseudo').click(function(e) {
			e.preventDefault();
		});

		// LOGO FOOTER
		checkLogoFooter();

		// BURGER
		$('.menu-holder').click(function() {
			if (__isMobile) {
				if (!$('html').hasClass('html-mobile-opened')) {
					if (!$(this).children('.close').length) {
						$(this).append('<div class="close"></div>');
						$(this).children('.close').click(function(e) {
							e.stopPropagation();
							if ($('html').hasClass('html-mobile-opened')) {
								$('html').removeClass('html-mobile-opened html-modal-long').find('#layout').css('height', 'auto');
							}
						});
					}

					$('html').addClass('html-mobile-opened');

					var inner_h = $('#menu-main').outerHeight(true) + $('#bl-profile').outerHeight(true);
					var window_h = $(window).height();
					if (inner_h + window_h*0.15 > window_h) {
						$('html').addClass('html-modal-long').find('#layout').css('height', $('.menu-holder').outerHeight());
					} else {
						$('html').removeClass('html-modal-long').find('#layout').css('height', 'auto');
					}
				}
			}
		});

		// MOBILE SLICK
		if (__isMobileTabletMiddle) {
			$('.mobile-slider').each(function(i, slider) {
				if (($(slider).attr('data-mobile') && __isMobileSmall) || !$(slider).attr('data-mobile')) {
					$(slider).slick({
						slidesToShow: 1,
						slidesToScroll: 1,
						dots: true,
						arrows: false,
						autoplay: false
					});
				}
			});
		}

		// CHECKBOXES LIST
		$('.checkboxes-list input[type="checkbox"][data-toggle-all]').click(function() {
			$(this).closest('.checkboxes-list').find('input[type="checkbox"]').not('[data-toggle-all]').prop('checked', $(this).prop('checked')).checkboxradio('refresh');
		});

		// NUMBERS
		if ($('#numbers, #client').length) {
			$('#numbers, #client').find('.numbers-block .main').click(function() {
				if ($(this).siblings('ul').css('display') == 'block') {
					$(this).removeClass('opened');
					$(this).siblings('ul').stop().slideUp(__animationSpeed);
				} else {
					$(this).addClass('opened');
					$(this).siblings('ul').stop().slideDown(__animationSpeed);
				}
			});

			// FIXME DEMO
			$('#numbers').find('.numbers-block ul>li .btn').click(function() {
				$('#action-save-changes').removeAttr('disabled');
			});

			$('#tabs-numbers ul>li>a').click(function() {
				if ($('#numbers-my').css('display') == 'block') {
					setTimeout(function() {
						showBottomSection();
					}, 1000);
				} else {
					hideBottomSection();
				}
			});

			if ($('#numbers-my').css('display') == 'block') {
				setTimeout(function() {
					showBottomSection();
				}, 1000);
			}

			// FIXME DEMO
			var countries_numbers_arr_demo = new Array(
				{label: 'Abkhazia', value: 'Abkhazia'},
				{label: 'Afghanistan', value: 'Afghanistan'},
				{label: 'Afghanistan Mobile', value: 'Afghanistan Mobile'},
				{label: 'Albania', value: 'Albania'},
				{label: 'Albania Mobile', value: 'Albania Mobile'},
				{label: 'Algeria', value: 'Algeria'},
				{label: '124626', value: '124626'},
				{label: '2263', value: '2263'},
				{label: '355696967', value: '355696967'},
				{label: '355696992', value: '355696992'},
				{label: '3718', value: '3718'},
				{label: '423870', value: '423870'},
				{label: '5001', value: '5001'},
				{label: '6872334', value: '6872334'},
				{label: '77129415', value: '77129415'},
				{label: '74218324', value: '74218324'},
				{label: '83410921', value: '83410921'},
				{label: '9378238234', value: '9378238234'}
			);

			// NUMBERS ORDER FILTER
			if ($('#numbers-order-filter-input').length) {
				$('#numbers-order-filter-input').autocomplete({
					source: countries_numbers_arr_demo,
					appendTo: '#numbers-order-filter .input-holder',
					minLength: 0
				})
			}

			// FIXME DEMO
			$('#numbers-order-filter .btn').click(function() {
				$('#numbers-order-filter').stop().slideUp(__animationSpeed);
				$('#numbers-order .warning').stop().fadeIn(__animationSpeed);
			});
		}

		// SUB ACCOUNTS
		if ($('#sub-accounts').length) {
			$('#sub-accounts-list .numbers-block .main').click(function() {
				if ($(this).siblings('ul').css('display') == 'block') {
					$(this).removeClass('opened');
					$(this).siblings('ul').stop().slideUp(__animationSpeed);
				} else {
					$(this).addClass('opened');
					$(this).siblings('ul').stop().slideDown(__animationSpeed);
				}
			});

			// FIXME DEMO
			$('#sub-accounts-list .numbers-block ul>li .btn').click(function() {
				$('#action-save-changes').removeAttr('disabled');
			});

			// FIXME DEMO
			$('#sub-accounts-stats .filter .filter-line .btn').click(function() {
				$('#sub-accounts-stats-results').stop().slideDown(__animationSpeed);
				fadeoutInit();
			});

			// FIXME DEMO
			$('#sub-accounts-invoices .filter .filter-line .btn').click(function() {
				$('#sub-accounts-invoices-results').stop().slideDown(__animationSpeed);
				fadeoutInit();
			});
		}

		// MY SUMMARY
		if ($('#my-summary').length) {
			// FIXME DEMO
			$('#my-summary-stats .filter .filter-line .btn').click(function() {
				$('#my-summary-stats-results').stop().slideDown(__animationSpeed);
				fadeoutInit();
			});

			$('#my-summary-cdr .filter .filter-line .btn').click(function() {
				$('#my-summary-cdr-results').stop().slideDown(__animationSpeed);
				fadeoutInit();
			});

			$('#my-summary-cdr-results .dotted').click(function() {
				showModal('modal-invoice');
			});

			$('#my-summary-payment-history .dotted').click(function() {
				showModal('modal-invoice2');
			});
		}

		// IVR 
		if ($('#ivr-list').length) {
			$('#ivr-list>li>a').click(function(e) {
				e.preventDefault();
				e.stopPropagation();

				$(this).parent().addClass('active').siblings('.active').removeClass('active');
				var title = $(this).attr('data-title');
				$('#ivr-title').val(title);
			});
		}

		// PROFILE
		if ($('#account').length) {
			$('#account-personality-type-list input:radio').each(function(index, radio) {
				$(radio).change(function() {
					var blocks = $(this).attr('data-blocks');
					if (blocks == 'block-person') {
						$('#account .block-person').stop().slideDown(__animationSpeed);
						$('#account .block-company').stop().slideUp(__animationSpeed);
					} else {
						$('#account .block-person').stop().slideUp(__animationSpeed);
						$('#account .block-company').stop().slideDown(__animationSpeed);
					}
				});
				if ($(radio).prop('checked')) {
					$(radio).change();
				}
			});
		}

		// PRODUCTS
		if ($('#products').length) {
			// FIXME
			$('#products .table-holder table tr>td>a.edit-product').click(function(e) {
				e.preventDefault();

				showModal('modal-product');
			});
		}

		// TEST PANEL
		if ($('#test-panel').length) {
			// FIXME
			$('#test-panel table tr>td.access-btn>.btn').click(function() {
				showModal('modal-access-list');
			});
		}

		// ADMIN STATS
		if ($('#admin-stats').length) {
			// FIXME DEMO
			$('#my-summary-stats .filter .filter-line .btn').click(function() {
				$('#my-summary-stats-results').stop().slideDown(__animationSpeed);
				fadeoutInit();
			});

			$('#my-summary-cdr .filter .filter-line .btn').click(function() {
				$('#my-summary-cdr-results').stop().slideDown(__animationSpeed);
				fadeoutInit();
			});

			$('#my-summary-cdr-results .dotted').click(function() {
				showModal('modal-invoice');
			});
		}

		// WIDGETS
		if ($('.widget').length) {
			$('.widget').each(function(index, widget) {
				$(widget).hide();
				$(widget).delay(700).fadeIn(__animationSpeed*2);

				$(widget).find('h3, .h3, .toggler').click(function() {
					var $widget = $(this).closest('.widget');
					if ($widget.hasClass('opened')) {
						$widget.removeClass('opened')
							.find('.toggler').text('Open');
						$widget.find('.contents').stop().slideUp(__animationSpeed);
					} else {
						$widget.addClass('opened')
							.find('.toggler').text('Hide');
						$widget.find('.contents').stop().slideDown(__animationSpeed, function() {
							if ($(this).find('.js-scroll').not('.hidden').length) {
								$(this).find('.js-scroll[data-calculate-width="true"]').each(function(index2, block) {
									var $widget = $(block).closest('.widget');
									var freespace = $widget.height() - $widget.find('h3, .h3').outerHeight(true) - $widget.find('.filter').outerHeight(true);
									$(block).height(freespace);
								});
								scrollsInit($(this), true);
							}
						});
					}
				});
			});

			$('#widget-cdr .filter .btn-line>.btn').click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				$(this).parent().stop().slideUp(__animationSpeed);

				$('#widget-cdr .table-holder').stop().slideDown(__animationSpeed, function() {
					scrollsInit($(this).parent(), true);
				});
			});

			$('#widget-online-calls').find('h3, .h3, .toggler').click(function() {
				var $widget = $(this).closest('.widget');
				if ($widget.hasClass('opened')) {
					$('#widget-cdr').animate({'margin-right': '432px'}, __animationSpeed/2, 'easeOutSine');
					
					if (__isMobile) {
						if ($('#widget-cdr').hasClass('opened')) {
							$('#widget-cdr').find('.toggler').click();
						}
					}
				} else {
					$('#widget-cdr').animate({'margin-right': '264px'}, __animationSpeed/2, 'easeOutSine');
				}
			});

			$('#widget-cdr').find('h3, .h3, .toggler').click(function() {
				var $widget = $(this).closest('.widget');
				if ($widget.hasClass('opened')) {
					if (__isMobile) {
						if ($('#widget-online-calls').hasClass('opened')) {
							$('#widget-online-calls').find('.toggler').click();
						}
					}
				}
			});
		}

		if ($('.modal').length) {
			$('#modal-agents .filter .btn').click(function() {
				$('#my-summary-cdr-agents-results').stop().slideDown(__animationSpeed);
				fadeoutInit();
			});

			$('#modal-invoices .filter .btn').click(function() {
				$('#my-summary-cdr-invoices-results').stop().slideDown(__animationSpeed);
				fadeoutInit();
			});

			$('#modal-clients .filter .btn').click(function() {
				$('#my-clients-results').stop().slideDown(__animationSpeed);
				fadeoutInit();
				scrollsInit($('#my-clients-results').parent(), true);
			});
		}
	})
})(jQuery)