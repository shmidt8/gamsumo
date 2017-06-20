// Скролл страинцы
var pageScroll = function()
{
    function obj()
    {
        var self = this;
        self.level = '0';
        self.getScrollWidth = function()
        {
            var docH = $(document).outerHeight();
            var winH = $(window).outerHeight();
            if (docH > winH) {
                var div = document.createElement('div');
                div.style.overflowY = 'scroll';
                div.style.width = '50px';
                div.style.height = '50px';
                div.style.visibility = 'hidden';
                document.body.appendChild(div);
                var scrollWidth = div.offsetWidth - div.clientWidth;
                document.body.removeChild(div);
                return scrollWidth;
            } else {
                return 0;
            }
        },
        self.hide = function(manual_index)
        {
            if (self.level == 0) {
                $('html').css({
                    'overflow': 'hidden',
                    'padding-right': self.getScrollWidth(),
                });
            }
            if (manual_index != undefined) {
                self.level = manual_index;
            } else {
                self.level++;
            }
        },
        self.show = function(manual_index)
        {
            if (manual_index != undefined) {
                self.level = manual_index;
            } else {
                if (self.level > 0) {
                    self.level--;
                }
            }
            if (self.level == 0) {
                $('html').css({
                    'overflow': '',
                    'padding-right': '',
                });
                if ($('html').attr('style') == '') {
                    $('html').removeAttr('style');
                }
            }
        }
    }
    return new obj();
}();

/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20170427
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */
/*global self, document, DOMException */
/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */
if ("document" in self) {
// Full polyfill for browsers with no classList support
// Including IE < Edge missing SVGElement.classList
if (!("classList" in document.createElement("_")) 
	|| document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))) {
(function (view) {
"use strict";
if (!('Element' in view)) return;
var
	  classListProp = "classList"
	, protoProp = "prototype"
	, elemCtrProto = view.Element[protoProp]
	, objCtr = Object
	, strTrim = String[protoProp].trim || function () {
		return this.replace(/^\s+|\s+$/g, "");
	}
	, arrIndexOf = Array[protoProp].indexOf || function (item) {
		var
			  i = 0
			, len = this.length
		;
		for (; i < len; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	}
	// Vendors: please allow content code to instantiate DOMExceptions
	, DOMEx = function (type, message) {
		this.name = type;
		this.code = DOMException[type];
		this.message = message;
	}
	, checkTokenAndGetIndex = function (classList, token) {
		if (token === "") {
			throw new DOMEx(
				  "SYNTAX_ERR"
				, "An invalid or illegal string was specified"
			);
		}
		if (/\s/.test(token)) {
			throw new DOMEx(
				  "INVALID_CHARACTER_ERR"
				, "String contains an invalid character"
			);
		}
		return arrIndexOf.call(classList, token);
	}
	, ClassList = function (elem) {
		var
			  trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
			, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
			, i = 0
			, len = classes.length
		;
		for (; i < len; i++) {
			this.push(classes[i]);
		}
		this._updateClassName = function () {
			elem.setAttribute("class", this.toString());
		};
	}
	, classListProto = ClassList[protoProp] = []
	, classListGetter = function () {
		return new ClassList(this);
	}
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
	return this[i] || null;
};
classListProto.contains = function (token) {
	token += "";
	return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
	;
	do {
		token = tokens[i] + "";
		if (checkTokenAndGetIndex(this, token) === -1) {
			this.push(token);
			updated = true;
		}
	}
	while (++i < l);
	if (updated) {
		this._updateClassName();
	}
};
classListProto.remove = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
		, index
	;
	do {
		token = tokens[i] + "";
		index = checkTokenAndGetIndex(this, token);
		while (index !== -1) {
			this.splice(index, 1);
			updated = true;
			index = checkTokenAndGetIndex(this, token);
		}
	}
	while (++i < l);
	if (updated) {
		this._updateClassName();
	}
};
classListProto.toggle = function (token, force) {
	token += "";
	var
		  result = this.contains(token)
		, method = result ?
			force !== true && "remove"
		:
			force !== false && "add"
	;
	if (method) {
		this[method](token);
	}
	if (force === true || force === false) {
		return force;
	} else {
		return !result;
	}
};
classListProto.toString = function () {
	return this.join(" ");
};
if (objCtr.defineProperty) {
	var classListPropDesc = {
		  get: classListGetter
		, enumerable: true
		, configurable: true
	};
	try {
		objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	} catch (ex) { // IE 8 doesn't support enumerable:true
		// adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
		// modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
		if (ex.number === undefined || ex.number === -0x7FF5EC54) {
			classListPropDesc.enumerable = false;
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		}
	}
} else if (objCtr[protoProp].__defineGetter__) {
	elemCtrProto.__defineGetter__(classListProp, classListGetter);
}
}(self));
}
// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.
(function () {
	"use strict";
	var testElement = document.createElement("_");
	testElement.classList.add("c1", "c2");
	// Polyfill for IE 10/11 and Firefox <26, where classList.add and
	// classList.remove exist but support only one argument at a time.
	if (!testElement.classList.contains("c2")) {
		var createMethod = function(method) {
			var original = DOMTokenList.prototype[method];
			DOMTokenList.prototype[method] = function(token) {
				var i, len = arguments.length;
				for (i = 0; i < len; i++) {
					token = arguments[i];
					original.call(this, token);
				}
			};
		};
		createMethod('add');
		createMethod('remove');
	}
	testElement.classList.toggle("c3", false);
	// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
	// support the second argument.
	if (testElement.classList.contains("c3")) {
		var _toggle = DOMTokenList.prototype.toggle;
		DOMTokenList.prototype.toggle = function(token, force) {
			if (1 in arguments && !this.contains(token) === !force) {
				return force;
			} else {
				return _toggle.call(this, token);
			}
		};
	}
	testElement = null;
}());
}
//////////////////////////////////////////////////////////////////////
/*
 * jQuery Basic Table
 * Author: Jerry Low
 */
//////////////////////////////////////////////////////////////////////
(function($) {
    $.fn.basictable = function(options) {
        var setup = function(table, data) {
            var headings = [];
            if (data.tableWrap) {
                table.wrap('<div class="bt-wrapper"></div>');
            }
            var format = '';
            if (table.find('thead tr th').length) {
                format = 'thead th';
            }
            else if (table.find('tbody tr th').length) {
                format = 'tbody tr th';
            }
            else if (table.find('th').length) {
                format = 'tr:first th';
            }
            else {
                format = 'tr:first td';
            }
            $.each(table.find(format), function() {
                var $heading = $(this);
                var colspan = parseInt($heading.attr('colspan'), 10) || 1;
                var row = $heading.closest('tr').index();
                if (!headings[row]) {
                    headings[row] = [];
                }
                for (var i = 0; i < colspan; i++) {
                    headings[row].push($heading);
                }
            });
            // Table Body
            $.each(table.find('tbody tr'), function() {
                setupRow($(this), headings, data);
            });
            // Table Footer
            $.each(table.find('tfoot tr'), function() {
                setupRow($(this), headings, data);
            });
        };
        var setupRow = function($row, headings, data) {
            $row.children().each(function() {
                var $cell = $(this);
                if (($cell.html() === '' || $cell.html() === '&nbsp;') && (!data.showEmptyCells)) {
                    $cell.addClass('bt-hide');
                }
                else {
                    var cellIndex = $cell.index();
                    var headingText = '';
                    for (var j = 0; j < headings.length; j++) {
                        if (j != 0) {
                            headingText += ': ';
                        }
                        var $heading = headings[j][cellIndex];
                        headingText += $heading.text();
                    }
                    $cell.attr('data-th', headingText);
                    if (data.contentWrap && !$cell.children().hasClass('bt-content')) {
                        $cell.wrapInner('<span class="bt-content" />');
                    }
                }
            });
        };
        var unwrap = function(table) {
            $.each(table.find('td'), function() {
                var $cell = $(this);
                var content = $cell.children('.bt-content').html();
                $cell.html(content);
            });
        };
        var check = function(table, data) {
            // Only change when table is larger than parent if force
            // responsive is turned off.
            if (!data.forceResponsive) {
                if (table.removeClass('bt').outerWidth() > table.parent().width()) {
                    start(table, data);
                }
                else {
                    end(table, data);
                }
            }
            else {
                if ((data.breakpoint !== null && $(window).width() <= data.breakpoint) || (data.containerBreakpoint !== null && table.parent().width() <= data.containerBreakpoint)) {
                    start(table, data);
                }
                else {
                    end(table, data);
                }
            }
        };
        var start = function(table, data) {
            table.addClass('bt');
            if (data.tableWrap) {
                table.parent('.bt-wrapper').addClass('active');
            }
        };
        var end = function(table, data) {
            table.removeClass('bt');
            if (data.tableWrap) {
                table.parent('.bt-wrapper').removeClass('active');
            }
        };
        var destroy = function(table, data) {
            table.find('td').removeAttr('data-th');
            if (data.tableWrap) {
                table.unwrap();
            }
            if (data.contentWrap) {
                unwrap(table);
            }
            table.removeData('basictable');
        };
        var resize = function(table) {
            if (table.data('basictable')) {
                check(table, table.data('basictable'));
            }
        };
        // Get table.
        this.each(function() {
            var table = $(this);
            // If table has already executed.
            if (table.length === 0 || table.data('basictable')) {
                if (table.data('basictable')) {
                    // Destroy basic table.
                    if (options == 'destroy') {
                        destroy(table, table.data('basictable'));
                    }
                    // Start responsive mode.
                    else if (options === 'start') {
                        start(table, table.data('basictable'));
                    }
                    else if (options === 'stop') {
                        end(table, table.data('basictable'));
                    }
                    else {
                        check(table, table.data('basictable'));
                    }
                }
                return false;
            }
            // Extend Settings.
            var settings = $.extend({}, $.fn.basictable.defaults, options);
            var vars = {
                breakpoint: settings.breakpoint,
                containerBreakpoint: settings.containerBreakpoint,
                contentWrap: settings.contentWrap,
                forceResponsive: settings.forceResponsive,
                noResize: settings.noResize,
                tableWrap: settings.tableWrap,
                showEmptyCells: settings.showEmptyCells
            };
            // Maintain the original functionality/defaults
            if(vars.breakpoint === null && vars.containerBreakpoint === null){
                vars.breakpoint = 568;
            }
            // Initiate
            table.data('basictable', vars);
            setup(table, table.data('basictable'));
            if (!vars.noResize) {
                check(table, table.data('basictable'));
                $(window).bind('resize.basictable', function() {
                    resize(table);
                });
            }
        });
    };
    $.fn.basictable.defaults = {
        breakpoint: null,
        containerBreakpoint: null,
        contentWrap: true,
        forceResponsive: true,
        noResize: false,
        tableWrap: false,
        showEmptyCells: false
    };
})(jQuery);
;(function (window, $, undefined) { ;(function () {
    var VERSION = '2.2.3',
        pluginName = 'datepicker',
        autoInitSelector = '.datepicker-here',
        $body, $datepickersContainer,
        containerBuilt = false,
        baseTemplate = '' +
            '<div class="datepicker">' +
            '<i class="datepicker--pointer"></i>' +
            '<nav class="datepicker--nav"></nav>' +
            '<div class="datepicker--content"></div>' +
            '</div>',
        defaults = {
            classes: '',
            inline: false,
            language: 'ru',
            startDate: new Date(),
            firstDay: '',
            weekends: [6, 0],
            dateFormat: '',
            altField: '',
            altFieldDateFormat: '@',
            toggleSelected: true,
            keyboardNav: true,
            position: 'bottom left',
            offset: 12,
            view: 'days',
            minView: 'days',
            showOtherMonths: true,
            selectOtherMonths: true,
            moveToOtherMonthsOnSelect: true,
            showOtherYears: true,
            selectOtherYears: true,
            moveToOtherYearsOnSelect: true,
            minDate: '',
            maxDate: '',
            disableNavWhenOutOfRange: true,
            multipleDates: false, // Boolean or Number
            multipleDatesSeparator: ',',
            range: false,
            todayButton: false,
            clearButton: false,
            showEvent: 'focus',
            autoClose: false,
            // navigation
            monthsField: 'monthsShort',
            prevHtml: '<svg><path d="M 17,12 l -5,5 l 5,5"></path></svg>',
            nextHtml: '<svg><path d="M 14,12 l 5,5 l -5,5"></path></svg>',
            navTitles: {
                days: 'MM, <i>yyyy</i>',
                months: 'yyyy',
                years: 'yyyy1 - yyyy2'
            },
            // timepicker
            timepicker: false,
            onlyTimepicker: false,
            dateTimeSeparator: ' ',
            timeFormat: '',
            minHours: 0,
            maxHours: 24,
            minMinutes: 0,
            maxMinutes: 59,
            hoursStep: 1,
            minutesStep: 1,
            // events
            onSelect: '',
            onShow: '',
            onHide: '',
            onChangeMonth: '',
            onChangeYear: '',
            onChangeDecade: '',
            onChangeView: '',
            onRenderCell: ''
        },
        hotKeys = {
            'ctrlRight': [17, 39],
            'ctrlUp': [17, 38],
            'ctrlLeft': [17, 37],
            'ctrlDown': [17, 40],
            'shiftRight': [16, 39],
            'shiftUp': [16, 38],
            'shiftLeft': [16, 37],
            'shiftDown': [16, 40],
            'altUp': [18, 38],
            'altRight': [18, 39],
            'altLeft': [18, 37],
            'altDown': [18, 40],
            'ctrlShiftUp': [16, 17, 38]
        },
        datepicker;
    var Datepicker  = function (el, options) {
        this.el = el;
        this.$el = $(el);
        this.opts = $.extend(true, {}, defaults, options, this.$el.data());
        if ($body == undefined) {
            $body = $('body');
        }
        if (!this.opts.startDate) {
            this.opts.startDate = new Date();
        }
        if (this.el.nodeName == 'INPUT') {
            this.elIsInput = true;
        }
        if (this.opts.altField) {
            this.$altField = typeof this.opts.altField == 'string' ? $(this.opts.altField) : this.opts.altField;
        }
        this.inited = false;
        this.visible = false;
        this.silent = false; // Need to prevent unnecessary rendering
        this.currentDate = this.opts.startDate;
        this.currentView = this.opts.view;
        this._createShortCuts();
        this.selectedDates = [];
        this.views = {};
        this.keys = [];
        this.minRange = '';
        this.maxRange = '';
        this._prevOnSelectValue = '';
        this.init()
    };
    datepicker = Datepicker;
    datepicker.prototype = {
        VERSION: VERSION,
        viewIndexes: ['days', 'months', 'years'],
        init: function () {
            if (!containerBuilt && !this.opts.inline && this.elIsInput) {
                this._buildDatepickersContainer();
            }
            this._buildBaseHtml();
            this._defineLocale(this.opts.language);
            this._syncWithMinMaxDates();
            if (this.elIsInput) {
                if (!this.opts.inline) {
                    // Set extra classes for proper transitions
                    this._setPositionClasses(this.opts.position);
                    this._bindEvents()
                }
                if (this.opts.keyboardNav && !this.opts.onlyTimepicker) {
                    this._bindKeyboardEvents();
                }
                this.$datepicker.on('mousedown', this._onMouseDownDatepicker.bind(this));
                this.$datepicker.on('mouseup', this._onMouseUpDatepicker.bind(this));
            }
            if (this.opts.classes) {
                this.$datepicker.addClass(this.opts.classes)
            }
            if (this.opts.timepicker) {
                this.timepicker = new $.fn.datepicker.Timepicker(this, this.opts);
                this._bindTimepickerEvents();
            }
            if (this.opts.onlyTimepicker) {
                this.$datepicker.addClass('-only-timepicker-');
            }
            this.views[this.currentView] = new $.fn.datepicker.Body(this, this.currentView, this.opts);
            this.views[this.currentView].show();
            this.nav = new $.fn.datepicker.Navigation(this, this.opts);
            this.view = this.currentView;
            this.$el.on('clickCell.adp', this._onClickCell.bind(this));
            this.$datepicker.on('mouseenter', '.datepicker--cell', this._onMouseEnterCell.bind(this));
            this.$datepicker.on('mouseleave', '.datepicker--cell', this._onMouseLeaveCell.bind(this));
            this.inited = true;
        },
        _createShortCuts: function () {
            this.minDate = this.opts.minDate ? this.opts.minDate : new Date(-8639999913600000);
            this.maxDate = this.opts.maxDate ? this.opts.maxDate : new Date(8639999913600000);
        },
        _bindEvents : function () {
            this.$el.on(this.opts.showEvent + '.adp', this._onShowEvent.bind(this));
            this.$el.on('mouseup.adp', this._onMouseUpEl.bind(this));
            this.$el.on('blur.adp', this._onBlur.bind(this));
            this.$el.on('keyup.adp', this._onKeyUpGeneral.bind(this));
            $(window).on('resize.adp', this._onResize.bind(this));
            $('body').on('mouseup.adp', this._onMouseUpBody.bind(this));
        },
        _bindKeyboardEvents: function () {
            this.$el.on('keydown.adp', this._onKeyDown.bind(this));
            this.$el.on('keyup.adp', this._onKeyUp.bind(this));
            this.$el.on('hotKey.adp', this._onHotKey.bind(this));
        },
        _bindTimepickerEvents: function () {
            this.$el.on('timeChange.adp', this._onTimeChange.bind(this));
        },
        isWeekend: function (day) {
            return this.opts.weekends.indexOf(day) !== -1;
        },
        _defineLocale: function (lang) {
            if (typeof lang == 'string') {
                this.loc = $.fn.datepicker.language[lang];
                if (!this.loc) {
                    console.warn('Can\'t find language "' + lang + '" in Datepicker.language, will use "ru" instead');
                    this.loc = $.extend(true, {}, $.fn.datepicker.language.ru)
                }
                this.loc = $.extend(true, {}, $.fn.datepicker.language.ru, $.fn.datepicker.language[lang])
            } else {
                this.loc = $.extend(true, {}, $.fn.datepicker.language.ru, lang)
            }
            if (this.opts.dateFormat) {
                this.loc.dateFormat = this.opts.dateFormat
            }
            if (this.opts.timeFormat) {
                this.loc.timeFormat = this.opts.timeFormat
            }
            if (this.opts.firstDay !== '') {
                this.loc.firstDay = this.opts.firstDay
            }
            if (this.opts.timepicker) {
                this.loc.dateFormat = [this.loc.dateFormat, this.loc.timeFormat].join(this.opts.dateTimeSeparator);
            }
            if (this.opts.onlyTimepicker) {
                this.loc.dateFormat = this.loc.timeFormat;
            }
            var boundary = this._getWordBoundaryRegExp;
            if (this.loc.timeFormat.match(boundary('aa')) ||
                this.loc.timeFormat.match(boundary('AA'))
            ) {
               this.ampm = true;
            }
        },
        _buildDatepickersContainer: function () {
            containerBuilt = true;
            $body.append('<div class="datepickers-container" id="datepickers-container"></div>');
            $datepickersContainer = $('#datepickers-container');
        },
        _buildBaseHtml: function () {
            var $appendTarget,
                $inline = $('<div class="datepicker-inline">');
            if(this.el.nodeName == 'INPUT') {
                if (!this.opts.inline) {
                    $appendTarget = $datepickersContainer;
                } else {
                    $appendTarget = $inline.insertAfter(this.$el)
                }
            } else {
                $appendTarget = $inline.appendTo(this.$el)
            }
            this.$datepicker = $(baseTemplate).appendTo($appendTarget);
            this.$content = $('.datepicker--content', this.$datepicker);
            this.$nav = $('.datepicker--nav', this.$datepicker);
        },
        _triggerOnChange: function () {
            if (!this.selectedDates.length) {
                // Prevent from triggering multiple onSelect callback with same argument (empty string) in IE10-11
                if (this._prevOnSelectValue === '') return;
                this._prevOnSelectValue = '';
                return this.opts.onSelect('', '', this);
            }
            var selectedDates = this.selectedDates,
                parsedSelected = datepicker.getParsedDate(selectedDates[0]),
                formattedDates,
                _this = this,
                dates = new Date(
                    parsedSelected.year,
                    parsedSelected.month,
                    parsedSelected.date,
                    parsedSelected.hours,
                    parsedSelected.minutes
                );
                formattedDates = selectedDates.map(function (date) {
                    return _this.formatDate(_this.loc.dateFormat, date)
                }).join(this.opts.multipleDatesSeparator);
            // Create new dates array, to separate it from original selectedDates
            if (this.opts.multipleDates || this.opts.range) {
                dates = selectedDates.map(function(date) {
                    var parsedDate = datepicker.getParsedDate(date);
                    return new Date(
                        parsedDate.year,
                        parsedDate.month,
                        parsedDate.date,
                        parsedDate.hours,
                        parsedDate.minutes
                    );
                })
            }
            this._prevOnSelectValue = formattedDates;
            this.opts.onSelect(formattedDates, dates, this);
        },
        next: function () {
            var d = this.parsedDate,
                o = this.opts;
            switch (this.view) {
                case 'days':
                    this.date = new Date(d.year, d.month + 1, 1);
                    if (o.onChangeMonth) o.onChangeMonth(this.parsedDate.month, this.parsedDate.year);
                    break;
                case 'months':
                    this.date = new Date(d.year + 1, d.month, 1);
                    if (o.onChangeYear) o.onChangeYear(this.parsedDate.year);
                    break;
                case 'years':
                    this.date = new Date(d.year + 10, 0, 1);
                    if (o.onChangeDecade) o.onChangeDecade(this.curDecade);
                    break;
            }
        },
        prev: function () {
            var d = this.parsedDate,
                o = this.opts;
            switch (this.view) {
                case 'days':
                    this.date = new Date(d.year, d.month - 1, 1);
                    if (o.onChangeMonth) o.onChangeMonth(this.parsedDate.month, this.parsedDate.year);
                    break;
                case 'months':
                    this.date = new Date(d.year - 1, d.month, 1);
                    if (o.onChangeYear) o.onChangeYear(this.parsedDate.year);
                    break;
                case 'years':
                    this.date = new Date(d.year - 10, 0, 1);
                    if (o.onChangeDecade) o.onChangeDecade(this.curDecade);
                    break;
            }
        },
        formatDate: function (string, date) {
            date = date || this.date;
            var result = string,
                boundary = this._getWordBoundaryRegExp,
                locale = this.loc,
                leadingZero = datepicker.getLeadingZeroNum,
                decade = datepicker.getDecade(date),
                d = datepicker.getParsedDate(date),
                fullHours = d.fullHours,
                hours = d.hours,
                ampm = string.match(boundary('aa')) || string.match(boundary('AA')),
                dayPeriod = 'am',
                replacer = this._replacer,
                validHours;
            if (this.opts.timepicker && this.timepicker && ampm) {
                validHours = this.timepicker._getValidHoursFromDate(date, ampm);
                fullHours = leadingZero(validHours.hours);
                hours = validHours.hours;
                dayPeriod = validHours.dayPeriod;
            }
            switch (true) {
                case /@/.test(result):
                    result = result.replace(/@/, date.getTime());
                case /aa/.test(result):
                    result = replacer(result, boundary('aa'), dayPeriod);
                case /AA/.test(result):
                    result = replacer(result, boundary('AA'), dayPeriod.toUpperCase());
                case /dd/.test(result):
                    result = replacer(result, boundary('dd'), d.fullDate);
                case /d/.test(result):
                    result = replacer(result, boundary('d'), d.date);
                case /DD/.test(result):
                    result = replacer(result, boundary('DD'), locale.days[d.day]);
                case /D/.test(result):
                    result = replacer(result, boundary('D'), locale.daysShort[d.day]);
                case /mm/.test(result):
                    result = replacer(result, boundary('mm'), d.fullMonth);
                case /m/.test(result):
                    result = replacer(result, boundary('m'), d.month + 1);
                case /MM/.test(result):
                    result = replacer(result, boundary('MM'), this.loc.months[d.month]);
                case /M/.test(result):
                    result = replacer(result, boundary('M'), locale.monthsShort[d.month]);
                case /ii/.test(result):
                    result = replacer(result, boundary('ii'), d.fullMinutes);
                case /i/.test(result):
                    result = replacer(result, boundary('i'), d.minutes);
                case /hh/.test(result):
                    result = replacer(result, boundary('hh'), fullHours);
                case /h/.test(result):
                    result = replacer(result, boundary('h'), hours);
                case /yyyy/.test(result):
                    result = replacer(result, boundary('yyyy'), d.year);
                case /yyyy1/.test(result):
                    result = replacer(result, boundary('yyyy1'), decade[0]);
                case /yyyy2/.test(result):
                    result = replacer(result, boundary('yyyy2'), decade[1]);
                case /yy/.test(result):
                    result = replacer(result, boundary('yy'), d.year.toString().slice(-2));
            }
            return result;
        },
        _replacer: function (str, reg, data) {
            return str.replace(reg, function (match, p1,p2,p3) {
                return p1 + data + p3;
            })
        },
        _getWordBoundaryRegExp: function (sign) {
            var symbols = '\\s|\\.|-|/|\\\\|,|\\$|\\!|\\?|:|;';
            return new RegExp('(^|>|' + symbols + ')(' + sign + ')($|<|' + symbols + ')', 'g');
        },
        selectDate: function (date) {
            var _this = this,
                opts = _this.opts,
                d = _this.parsedDate,
                selectedDates = _this.selectedDates,
                len = selectedDates.length,
                newDate = '';
            if (Array.isArray(date)) {
                date.forEach(function (d) {
                    _this.selectDate(d)
                });
                return;
            }
            if (!(date instanceof Date)) return;
            this.lastSelectedDate = date;
            // Set new time values from Date
            if (this.timepicker) {
                this.timepicker._setTime(date);
            }
            // On this step timepicker will set valid values in it's instance
            _this._trigger('selectDate', date);
            // Set correct time values after timepicker's validation
            // Prevent from setting hours or minutes which values are lesser then `min` value or
            // greater then `max` value
            if (this.timepicker) {
                date.setHours(this.timepicker.hours);
                date.setMinutes(this.timepicker.minutes)
            }
            if (_this.view == 'days') {
                if (date.getMonth() != d.month && opts.moveToOtherMonthsOnSelect) {
                    newDate = new Date(date.getFullYear(), date.getMonth(), 1);
                }
            }
            if (_this.view == 'years') {
                if (date.getFullYear() != d.year && opts.moveToOtherYearsOnSelect) {
                    newDate = new Date(date.getFullYear(), 0, 1);
                }
            }
            if (newDate) {
                _this.silent = true;
                _this.date = newDate;
                _this.silent = false;
                _this.nav._render()
            }
            if (opts.multipleDates && !opts.range) { // Set priority to range functionality
                if (len === opts.multipleDates) return;
                if (!_this._isSelected(date)) {
                    _this.selectedDates.push(date);
                }
            } else if (opts.range) {
                if (len == 2) {
                    _this.selectedDates = [date];
                    _this.minRange = date;
                    _this.maxRange = '';
                } else if (len == 1) {
                    _this.selectedDates.push(date);
                    if (!_this.maxRange){
                        _this.maxRange = date;
                    } else {
                        _this.minRange = date;
                    }
                    // Swap dates if they were selected via dp.selectDate() and second date was smaller then first
                    if (datepicker.bigger(_this.maxRange, _this.minRange)) {
                        _this.maxRange = _this.minRange;
                        _this.minRange = date;
                    }
                    _this.selectedDates = [_this.minRange, _this.maxRange]
                } else {
                    _this.selectedDates = [date];
                    _this.minRange = date;
                }
            } else {
                _this.selectedDates = [date];
            }
            _this._setInputValue();
            if (opts.onSelect) {
                _this._triggerOnChange();
            }
            if (opts.autoClose && !this.timepickerIsActive) {
                if (!opts.multipleDates && !opts.range) {
                    _this.hide();
                } else if (opts.range && _this.selectedDates.length == 2) {
                    _this.hide();
                }
            }
            _this.views[this.currentView]._render()
        },
        removeDate: function (date) {
            var selected = this.selectedDates,
                _this = this;
            if (!(date instanceof Date)) return;
            return selected.some(function (curDate, i) {
                if (datepicker.isSame(curDate, date)) {
                    selected.splice(i, 1);
                    if (!_this.selectedDates.length) {
                        _this.minRange = '';
                        _this.maxRange = '';
                        _this.lastSelectedDate = '';
                    } else {
                        _this.lastSelectedDate = _this.selectedDates[_this.selectedDates.length - 1];
                    }
                    _this.views[_this.currentView]._render();
                    _this._setInputValue();
                    if (_this.opts.onSelect) {
                        _this._triggerOnChange();
                    }
                    return true
                }
            })
        },
        today: function () {
            this.silent = true;
            this.view = this.opts.minView;
            this.silent = false;
            this.date = new Date();
            if (this.opts.todayButton instanceof Date) {
                this.selectDate(this.opts.todayButton)
            }
        },
        clear: function () {
            this.selectedDates = [];
            this.minRange = '';
            this.maxRange = '';
            this.views[this.currentView]._render();
            this._setInputValue();
            if (this.opts.onSelect) {
                this._triggerOnChange()
            }
        },
        /**
         * Updates datepicker options
         * @param {String|Object} param - parameter's name to update. If object then it will extend current options
         * @param {String|Number|Object} [value] - new param value
         */
        update: function (param, value) {
            var len = arguments.length,
                lastSelectedDate = this.lastSelectedDate;
            if (len == 2) {
                this.opts[param] = value;
            } else if (len == 1 && typeof param == 'object') {
                this.opts = $.extend(true, this.opts, param)
            }
            this._createShortCuts();
            this._syncWithMinMaxDates();
            this._defineLocale(this.opts.language);
            this.nav._addButtonsIfNeed();
            if (!this.opts.onlyTimepicker) this.nav._render();
            this.views[this.currentView]._render();
            if (this.elIsInput && !this.opts.inline) {
                this._setPositionClasses(this.opts.position);
                if (this.visible) {
                    this.setPosition(this.opts.position)
                }
            }
            if (this.opts.classes) {
                this.$datepicker.addClass(this.opts.classes)
            }
            if (this.opts.onlyTimepicker) {
                this.$datepicker.addClass('-only-timepicker-');
            }
            if (this.opts.timepicker) {
                if (lastSelectedDate) this.timepicker._handleDate(lastSelectedDate);
                this.timepicker._updateRanges();
                this.timepicker._updateCurrentTime();
                // Change hours and minutes if it's values have been changed through min/max hours/minutes
                if (lastSelectedDate) {
                    lastSelectedDate.setHours(this.timepicker.hours);
                    lastSelectedDate.setMinutes(this.timepicker.minutes);
                }
            }
            this._setInputValue();
            return this;
        },
        _syncWithMinMaxDates: function () {
            var curTime = this.date.getTime();
            this.silent = true;
            if (this.minTime > curTime) {
                this.date = this.minDate;
            }
            if (this.maxTime < curTime) {
                this.date = this.maxDate;
            }
            this.silent = false;
        },
        _isSelected: function (checkDate, cellType) {
            var res = false;
            this.selectedDates.some(function (date) {
                if (datepicker.isSame(date, checkDate, cellType)) {
                    res = date;
                    return true;
                }
            });
            return res;
        },
        _setInputValue: function () {
            var _this = this,
                opts = _this.opts,
                format = _this.loc.dateFormat,
                altFormat = opts.altFieldDateFormat,
                value = _this.selectedDates.map(function (date) {
                    return _this.formatDate(format, date)
                }),
                altValues;
            if (opts.altField && _this.$altField.length) {
                altValues = this.selectedDates.map(function (date) {
                    return _this.formatDate(altFormat, date)
                });
                altValues = altValues.join(this.opts.multipleDatesSeparator);
                this.$altField.val(altValues);
            }
            value = value.join(this.opts.multipleDatesSeparator);
            this.$el.val(value)
        },
        /**
         * Check if date is between minDate and maxDate
         * @param date {object} - date object
         * @param type {string} - cell type
         * @returns {boolean}
         * @private
         */
        _isInRange: function (date, type) {
            var time = date.getTime(),
                d = datepicker.getParsedDate(date),
                min = datepicker.getParsedDate(this.minDate),
                max = datepicker.getParsedDate(this.maxDate),
                dMinTime = new Date(d.year, d.month, min.date).getTime(),
                dMaxTime = new Date(d.year, d.month, max.date).getTime(),
                types = {
                    day: time >= this.minTime && time <= this.maxTime,
                    month: dMinTime >= this.minTime && dMaxTime <= this.maxTime,
                    year: d.year >= min.year && d.year <= max.year
                };
            return type ? types[type] : types.day
        },
        _getDimensions: function ($el) {
            var offset = $el.offset();
            return {
                width: $el.outerWidth(),
                height: $el.outerHeight(),
                left: offset.left,
                top: offset.top
            }
        },
        _getDateFromCell: function (cell) {
            var curDate = this.parsedDate,
                year = cell.data('year') || curDate.year,
                month = cell.data('month') == undefined ? curDate.month : cell.data('month'),
                date = cell.data('date') || 1;
            return new Date(year, month, date);
        },
        _setPositionClasses: function (pos) {
            pos = pos.split(' ');
            var main = pos[0],
                sec = pos[1],
                classes = 'datepicker -' + main + '-' + sec + '- -from-' + main + '-';
            if (this.visible) classes += ' active';
            this.$datepicker
                .removeAttr('class')
                .addClass(classes);
        },
        setPosition: function (position) {
            position = position || this.opts.position;
            var dims = this._getDimensions(this.$el),
                selfDims = this._getDimensions(this.$datepicker),
                pos = position.split(' '),
                top, left,
                offset = this.opts.offset,
                main = pos[0],
                secondary = pos[1];
            switch (main) {
                case 'top':
                    top = dims.top - selfDims.height - offset;
                    break;
                case 'right':
                    left = dims.left + dims.width + offset;
                    break;
                case 'bottom':
                    top = dims.top + dims.height + offset;
                    break;
                case 'left':
                    left = dims.left - selfDims.width - offset;
                    break;
            }
            switch(secondary) {
                case 'top':
                    top = dims.top;
                    break;
                case 'right':
                    left = dims.left + dims.width - selfDims.width;
                    break;
                case 'bottom':
                    top = dims.top + dims.height - selfDims.height;
                    break;
                case 'left':
                    left = dims.left;
                    break;
                case 'center':
                    if (/left|right/.test(main)) {
                        top = dims.top + dims.height/2 - selfDims.height/2;
                    } else {
                        left = dims.left + dims.width/2 - selfDims.width/2;
                    }
            }
            this.$datepicker
                .css({
                    left: left,
                    top: top
                })
        },
        show: function () {
            var onShow = this.opts.onShow;
            this.setPosition(this.opts.position);
            this.$datepicker.addClass('active');
            this.visible = true;
            if (onShow) {
                this._bindVisionEvents(onShow)
            }
        },
        hide: function () {
            var onHide = this.opts.onHide;
            this.$datepicker
                .removeClass('active')
                .css({
                    left: '-100000px'
                });
            this.focused = '';
            this.keys = [];
            this.inFocus = false;
            this.visible = false;
            this.$el.blur();
            if (onHide) {
                this._bindVisionEvents(onHide)
            }
        },
        down: function (date) {
            this._changeView(date, 'down');
        },
        up: function (date) {
            this._changeView(date, 'up');
        },
        _bindVisionEvents: function (event) {
            this.$datepicker.off('transitionend.dp');
            event(this, false);
            this.$datepicker.one('transitionend.dp', event.bind(this, this, true))
        },
        _changeView: function (date, dir) {
            date = date || this.focused || this.date;
            var nextView = dir == 'up' ? this.viewIndex + 1 : this.viewIndex - 1;
            if (nextView > 2) nextView = 2;
            if (nextView < 0) nextView = 0;
            this.silent = true;
            this.date = new Date(date.getFullYear(), date.getMonth(), 1);
            this.silent = false;
            this.view = this.viewIndexes[nextView];
        },
        _handleHotKey: function (key) {
            var date = datepicker.getParsedDate(this._getFocusedDate()),
                focusedParsed,
                o = this.opts,
                newDate,
                totalDaysInNextMonth,
                monthChanged = false,
                yearChanged = false,
                decadeChanged = false,
                y = date.year,
                m = date.month,
                d = date.date;
            switch (key) {
                case 'ctrlRight':
                case 'ctrlUp':
                    m += 1;
                    monthChanged = true;
                    break;
                case 'ctrlLeft':
                case 'ctrlDown':
                    m -= 1;
                    monthChanged = true;
                    break;
                case 'shiftRight':
                case 'shiftUp':
                    yearChanged = true;
                    y += 1;
                    break;
                case 'shiftLeft':
                case 'shiftDown':
                    yearChanged = true;
                    y -= 1;
                    break;
                case 'altRight':
                case 'altUp':
                    decadeChanged = true;
                    y += 10;
                    break;
                case 'altLeft':
                case 'altDown':
                    decadeChanged = true;
                    y -= 10;
                    break;
                case 'ctrlShiftUp':
                    this.up();
                    break;
            }
            totalDaysInNextMonth = datepicker.getDaysCount(new Date(y,m));
            newDate = new Date(y,m,d);
            // If next month has less days than current, set date to total days in that month
            if (totalDaysInNextMonth < d) d = totalDaysInNextMonth;
            // Check if newDate is in valid range
            if (newDate.getTime() < this.minTime) {
                newDate = this.minDate;
            } else if (newDate.getTime() > this.maxTime) {
                newDate = this.maxDate;
            }
            this.focused = newDate;
            focusedParsed = datepicker.getParsedDate(newDate);
            if (monthChanged && o.onChangeMonth) {
                o.onChangeMonth(focusedParsed.month, focusedParsed.year)
            }
            if (yearChanged && o.onChangeYear) {
                o.onChangeYear(focusedParsed.year)
            }
            if (decadeChanged && o.onChangeDecade) {
                o.onChangeDecade(this.curDecade)
            }
        },
        _registerKey: function (key) {
            var exists = this.keys.some(function (curKey) {
                return curKey == key;
            });
            if (!exists) {
                this.keys.push(key)
            }
        },
        _unRegisterKey: function (key) {
            var index = this.keys.indexOf(key);
            this.keys.splice(index, 1);
        },
        _isHotKeyPressed: function () {
            var currentHotKey,
                found = false,
                _this = this,
                pressedKeys = this.keys.sort();
            for (var hotKey in hotKeys) {
                currentHotKey = hotKeys[hotKey];
                if (pressedKeys.length != currentHotKey.length) continue;
                if (currentHotKey.every(function (key, i) { return key == pressedKeys[i]})) {
                    _this._trigger('hotKey', hotKey);
                    found = true;
                }
            }
            return found;
        },
        _trigger: function (event, args) {
            this.$el.trigger(event, args)
        },
        _focusNextCell: function (keyCode, type) {
            type = type || this.cellType;
            var date = datepicker.getParsedDate(this._getFocusedDate()),
                y = date.year,
                m = date.month,
                d = date.date;
            if (this._isHotKeyPressed()){
                return;
            }
            switch(keyCode) {
                case 37: // left
                    type == 'day' ? (d -= 1) : '';
                    type == 'month' ? (m -= 1) : '';
                    type == 'year' ? (y -= 1) : '';
                    break;
                case 38: // up
                    type == 'day' ? (d -= 7) : '';
                    type == 'month' ? (m -= 3) : '';
                    type == 'year' ? (y -= 4) : '';
                    break;
                case 39: // right
                    type == 'day' ? (d += 1) : '';
                    type == 'month' ? (m += 1) : '';
                    type == 'year' ? (y += 1) : '';
                    break;
                case 40: // down
                    type == 'day' ? (d += 7) : '';
                    type == 'month' ? (m += 3) : '';
                    type == 'year' ? (y += 4) : '';
                    break;
            }
            var nd = new Date(y,m,d);
            if (nd.getTime() < this.minTime) {
                nd = this.minDate;
            } else if (nd.getTime() > this.maxTime) {
                nd = this.maxDate;
            }
            this.focused = nd;
        },
        _getFocusedDate: function () {
            var focused  = this.focused || this.selectedDates[this.selectedDates.length - 1],
                d = this.parsedDate;
            if (!focused) {
                switch (this.view) {
                    case 'days':
                        focused = new Date(d.year, d.month, new Date().getDate());
                        break;
                    case 'months':
                        focused = new Date(d.year, d.month, 1);
                        break;
                    case 'years':
                        focused = new Date(d.year, 0, 1);
                        break;
                }
            }
            return focused;
        },
        _getCell: function (date, type) {
            type = type || this.cellType;
            var d = datepicker.getParsedDate(date),
                selector = '.datepicker--cell[data-year="' + d.year + '"]',
                $cell;
            switch (type) {
                case 'month':
                    selector = '[data-month="' + d.month + '"]';
                    break;
                case 'day':
                    selector += '[data-month="' + d.month + '"][data-date="' + d.date + '"]';
                    break;
            }
            $cell = this.views[this.currentView].$el.find(selector);
            return $cell.length ? $cell : $('');
        },
        destroy: function () {
            var _this = this;
            _this.$el
                .off('.adp')
                .data('datepicker', '');
            _this.selectedDates = [];
            _this.focused = '';
            _this.views = {};
            _this.keys = [];
            _this.minRange = '';
            _this.maxRange = '';
            if (_this.opts.inline || !_this.elIsInput) {
                _this.$datepicker.closest('.datepicker-inline').remove();
            } else {
                _this.$datepicker.remove();
            }
        },
        _handleAlreadySelectedDates: function (alreadySelected, selectedDate) {
            if (this.opts.range) {
                if (!this.opts.toggleSelected) {
                    // Add possibility to select same date when range is true
                    if (this.selectedDates.length != 2) {
                        this._trigger('clickCell', selectedDate);
                    }
                } else {
                    this.removeDate(selectedDate);
                }
            } else if (this.opts.toggleSelected){
                this.removeDate(selectedDate);
            }
            // Change last selected date to be able to change time when clicking on this cell
            if (!this.opts.toggleSelected) {
                this.lastSelectedDate = alreadySelected;
                if (this.opts.timepicker) {
                    this.timepicker._setTime(alreadySelected);
                    this.timepicker.update();
                }
            }
        },
        _onShowEvent: function (e) {
            if (!this.visible) {
                this.show();
            }
        },
        _onBlur: function () {
            if (!this.inFocus && this.visible) {
                this.hide();
            }
        },
        _onMouseDownDatepicker: function (e) {
            this.inFocus = true;
        },
        _onMouseUpDatepicker: function (e) {
            this.inFocus = false;
            e.originalEvent.inFocus = true;
            if (!e.originalEvent.timepickerFocus) this.$el.focus();
        },
        _onKeyUpGeneral: function (e) {
            var val = this.$el.val();
            if (!val) {
                this.clear();
            }
        },
        _onResize: function () {
            if (this.visible) {
                this.setPosition();
            }
        },
        _onMouseUpBody: function (e) {
            if (e.originalEvent.inFocus) return;
            if (this.visible && !this.inFocus) {
                this.hide();
            }
        },
        _onMouseUpEl: function (e) {
            e.originalEvent.inFocus = true;
            setTimeout(this._onKeyUpGeneral.bind(this),4);
        },
        _onKeyDown: function (e) {
            var code = e.which;
            this._registerKey(code);
            // Arrows
            if (code >= 37 && code <= 40) {
                e.preventDefault();
                this._focusNextCell(code);
            }
            // Enter
            if (code == 13) {
                if (this.focused) {
                    if (this._getCell(this.focused).hasClass('-disabled-')) return;
                    if (this.view != this.opts.minView) {
                        this.down()
                    } else {
                        var alreadySelected = this._isSelected(this.focused, this.cellType);
                        if (!alreadySelected) {
                            if (this.timepicker) {
                                this.focused.setHours(this.timepicker.hours);
                                this.focused.setMinutes(this.timepicker.minutes);
                            }
                            this.selectDate(this.focused);
                            return;
                        }
                        this._handleAlreadySelectedDates(alreadySelected, this.focused)
                    }
                }
            }
            // Esc
            if (code == 27) {
                this.hide();
            }
        },
        _onKeyUp: function (e) {
            var code = e.which;
            this._unRegisterKey(code);
        },
        _onHotKey: function (e, hotKey) {
            this._handleHotKey(hotKey);
        },
        _onMouseEnterCell: function (e) {
            var $cell = $(e.target).closest('.datepicker--cell'),
                date = this._getDateFromCell($cell);
            // Prevent from unnecessary rendering and setting new currentDate
            this.silent = true;
            if (this.focused) {
                this.focused = ''
            }
            $cell.addClass('-focus-');
            this.focused = date;
            this.silent = false;
            if (this.opts.range && this.selectedDates.length == 1) {
                this.minRange = this.selectedDates[0];
                this.maxRange = '';
                if (datepicker.less(this.minRange, this.focused)) {
                    this.maxRange = this.minRange;
                    this.minRange = '';
                }
                this.views[this.currentView]._update();
            }
        },
        _onMouseLeaveCell: function (e) {
            var $cell = $(e.target).closest('.datepicker--cell');
            $cell.removeClass('-focus-');
            this.silent = true;
            this.focused = '';
            this.silent = false;
        },
        _onTimeChange: function (e, h, m) {
            var date = new Date(),
                selectedDates = this.selectedDates,
                selected = false;
            if (selectedDates.length) {
                selected = true;
                date = this.lastSelectedDate;
            }
            date.setHours(h);
            date.setMinutes(m);
            if (!selected && !this._getCell(date).hasClass('-disabled-')) {
                this.selectDate(date);
            } else {
                this._setInputValue();
                if (this.opts.onSelect) {
                    this._triggerOnChange();
                }
            }
        },
        _onClickCell: function (e, date) {
            if (this.timepicker) {
                date.setHours(this.timepicker.hours);
                date.setMinutes(this.timepicker.minutes);
            }
            this.selectDate(date);
        },
        set focused(val) {
            if (!val && this.focused) {
                var $cell = this._getCell(this.focused);
                if ($cell.length) {
                    $cell.removeClass('-focus-')
                }
            }
            this._focused = val;
            if (this.opts.range && this.selectedDates.length == 1) {
                this.minRange = this.selectedDates[0];
                this.maxRange = '';
                if (datepicker.less(this.minRange, this._focused)) {
                    this.maxRange = this.minRange;
                    this.minRange = '';
                }
            }
            if (this.silent) return;
            this.date = val;
        },
        get focused() {
            return this._focused;
        },
        get parsedDate() {
            return datepicker.getParsedDate(this.date);
        },
        set date (val) {
            if (!(val instanceof Date)) return;
            this.currentDate = val;
            if (this.inited && !this.silent) {
                this.views[this.view]._render();
                this.nav._render();
                if (this.visible && this.elIsInput) {
                    this.setPosition();
                }
            }
            return val;
        },
        get date () {
            return this.currentDate
        },
        set view (val) {
            this.viewIndex = this.viewIndexes.indexOf(val);
            if (this.viewIndex < 0) {
                return;
            }
            this.prevView = this.currentView;
            this.currentView = val;
            if (this.inited) {
                if (!this.views[val]) {
                    this.views[val] = new  $.fn.datepicker.Body(this, val, this.opts)
                } else {
                    this.views[val]._render();
                }
                this.views[this.prevView].hide();
                this.views[val].show();
                this.nav._render();
                if (this.opts.onChangeView) {
                    this.opts.onChangeView(val)
                }
                if (this.elIsInput && this.visible) this.setPosition();
            }
            return val
        },
        get view() {
            return this.currentView;
        },
        get cellType() {
            return this.view.substring(0, this.view.length - 1)
        },
        get minTime() {
            var min = datepicker.getParsedDate(this.minDate);
            return new Date(min.year, min.month, min.date).getTime()
        },
        get maxTime() {
            var max = datepicker.getParsedDate(this.maxDate);
            return new Date(max.year, max.month, max.date).getTime()
        },
        get curDecade() {
            return datepicker.getDecade(this.date)
        }
    };
    //  Utils
    // -------------------------------------------------
    datepicker.getDaysCount = function (date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };
    datepicker.getParsedDate = function (date) {
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            fullMonth: (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1, // One based
            date: date.getDate(),
            fullDate: date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
            day: date.getDay(),
            hours: date.getHours(),
            fullHours:  date.getHours() < 10 ? '0' + date.getHours() :  date.getHours() ,
            minutes: date.getMinutes(),
            fullMinutes:  date.getMinutes() < 10 ? '0' + date.getMinutes() :  date.getMinutes()
        }
    };
    datepicker.getDecade = function (date) {
        var firstYear = Math.floor(date.getFullYear() / 10) * 10;
        return [firstYear, firstYear + 9];
    };
    datepicker.template = function (str, data) {
        return str.replace(/#\{([\w]+)\}/g, function (source, match) {
            if (data[match] || data[match] === 0) {
                return data[match]
            }
        });
    };
    datepicker.isSame = function (date1, date2, type) {
        if (!date1 || !date2) return false;
        var d1 = datepicker.getParsedDate(date1),
            d2 = datepicker.getParsedDate(date2),
            _type = type ? type : 'day',
            conditions = {
                day: d1.date == d2.date && d1.month == d2.month && d1.year == d2.year,
                month: d1.month == d2.month && d1.year == d2.year,
                year: d1.year == d2.year
            };
        return conditions[_type];
    };
    datepicker.less = function (dateCompareTo, date, type) {
        if (!dateCompareTo || !date) return false;
        return date.getTime() < dateCompareTo.getTime();
    };
    datepicker.bigger = function (dateCompareTo, date, type) {
        if (!dateCompareTo || !date) return false;
        return date.getTime() > dateCompareTo.getTime();
    };
    datepicker.getLeadingZeroNum = function (num) {
        return parseInt(num) < 10 ? '0' + num : num;
    };
    /**
     * Returns copy of date with hours and minutes equals to 0
     * @param date {Date}
     */
    datepicker.resetTime = function (date) {
        if (typeof date != 'object') return;
        date = datepicker.getParsedDate(date);
        return new Date(date.year, date.month, date.date)
    };
    $.fn.datepicker = function ( options ) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this,  pluginName,
                    new Datepicker( this, options ));
            } else {
                var _this = $.data(this, pluginName);
                _this.opts = $.extend(true, _this.opts, options);
                _this.update();
            }
        });
    };
    $.fn.datepicker.Constructor = Datepicker;
    $.fn.datepicker.language = {
        ru: {
            days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
            daysShort: ['Вос','Пон','Вто','Сре','Чет','Пят','Суб'],
            daysMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
            months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
            today: 'Сегодня',
            clear: 'Очистить',
            dateFormat: 'dd.mm.yyyy',
            timeFormat: 'hh:ii',
            firstDay: 1
        }
    };
    $(function () {
        $(autoInitSelector).datepicker();
    })
})();
;(function () {
    var templates = {
        days:'' +
        '<div class="datepicker--days datepicker--body">' +
        '<div class="datepicker--days-names"></div>' +
        '<div class="datepicker--cells datepicker--cells-days"></div>' +
        '</div>',
        months: '' +
        '<div class="datepicker--months datepicker--body">' +
        '<div class="datepicker--cells datepicker--cells-months"></div>' +
        '</div>',
        years: '' +
        '<div class="datepicker--years datepicker--body">' +
        '<div class="datepicker--cells datepicker--cells-years"></div>' +
        '</div>'
        },
        datepicker = $.fn.datepicker,
        dp = datepicker.Constructor;
    datepicker.Body = function (d, type, opts) {
        this.d = d;
        this.type = type;
        this.opts = opts;
        this.$el = $('');
        if (this.opts.onlyTimepicker) return;
        this.init();
    };
    datepicker.Body.prototype = {
        init: function () {
            this._buildBaseHtml();
            this._render();
            this._bindEvents();
        },
        _bindEvents: function () {
            this.$el.on('click', '.datepicker--cell', $.proxy(this._onClickCell, this));
        },
        _buildBaseHtml: function () {
            this.$el = $(templates[this.type]).appendTo(this.d.$content);
            this.$names = $('.datepicker--days-names', this.$el);
            this.$cells = $('.datepicker--cells', this.$el);
        },
        _getDayNamesHtml: function (firstDay, curDay, html, i) {
            curDay = curDay != undefined ? curDay : firstDay;
            html = html ? html : '';
            i = i != undefined ? i : 0;
            if (i > 7) return html;
            if (curDay == 7) return this._getDayNamesHtml(firstDay, 0, html, ++i);
            html += '<div class="datepicker--day-name' + (this.d.isWeekend(curDay) ? " -weekend-" : "") + '">' + this.d.loc.daysMin[curDay] + '</div>';
            return this._getDayNamesHtml(firstDay, ++curDay, html, ++i);
        },
        _getCellContents: function (date, type) {
            var classes = "datepicker--cell datepicker--cell-" + type,
                currentDate = new Date(),
                parent = this.d,
                minRange = dp.resetTime(parent.minRange),
                maxRange = dp.resetTime(parent.maxRange),
                opts = parent.opts,
                d = dp.getParsedDate(date),
                render = {},
                html = d.date;
            switch (type) {
                case 'day':
                    if (parent.isWeekend(d.day)) classes += " -weekend-";
                    if (d.month != this.d.parsedDate.month) {
                        classes += " -other-month-";
                        if (!opts.selectOtherMonths) {
                            classes += " -disabled-";
                        }
                        if (!opts.showOtherMonths) html = '';
                    }
                    break;
                case 'month':
                    html = parent.loc[parent.opts.monthsField][d.month];
                    break;
                case 'year':
                    var decade = parent.curDecade;
                    html = d.year;
                    if (d.year < decade[0] || d.year > decade[1]) {
                        classes += ' -other-decade-';
                        if (!opts.selectOtherYears) {
                            classes += " -disabled-";
                        }
                        if (!opts.showOtherYears) html = '';
                    }
                    break;
            }
            if (opts.onRenderCell) {
                render = opts.onRenderCell(date, type) || {};
                html = render.html ? render.html : html;
                classes += render.classes ? ' ' + render.classes : '';
            }
            if (opts.range) {
                if (dp.isSame(minRange, date, type)) classes += ' -range-from-';
                if (dp.isSame(maxRange, date, type)) classes += ' -range-to-';
                if (parent.selectedDates.length == 1 && parent.focused) {
                    if (
                        (dp.bigger(minRange, date) && dp.less(parent.focused, date)) ||
                        (dp.less(maxRange, date) && dp.bigger(parent.focused, date)))
                    {
                        classes += ' -in-range-'
                    }
                    if (dp.less(maxRange, date) && dp.isSame(parent.focused, date)) {
                        classes += ' -range-from-'
                    }
                    if (dp.bigger(minRange, date) && dp.isSame(parent.focused, date)) {
                        classes += ' -range-to-'
                    }
                } else if (parent.selectedDates.length == 2) {
                    if (dp.bigger(minRange, date) && dp.less(maxRange, date)) {
                        classes += ' -in-range-'
                    }
                }
            }
            if (dp.isSame(currentDate, date, type)) classes += ' -current-';
            if (parent.focused && dp.isSame(date, parent.focused, type)) classes += ' -focus-';
            if (parent._isSelected(date, type)) classes += ' -selected-';
            if (!parent._isInRange(date, type) || render.disabled) classes += ' -disabled-';
            return {
                html: html,
                classes: classes
            }
        },
        /**
         * Calculates days number to render. Generates days html and returns it.
         * @param {object} date - Date object
         * @returns {string}
         * @private
         */
        _getDaysHtml: function (date) {
            var totalMonthDays = dp.getDaysCount(date),
                firstMonthDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
                lastMonthDay = new Date(date.getFullYear(), date.getMonth(), totalMonthDays).getDay(),
                daysFromPevMonth = firstMonthDay - this.d.loc.firstDay,
                daysFromNextMonth = 6 - lastMonthDay + this.d.loc.firstDay;
            daysFromPevMonth = daysFromPevMonth < 0 ? daysFromPevMonth + 7 : daysFromPevMonth;
            daysFromNextMonth = daysFromNextMonth > 6 ? daysFromNextMonth - 7 : daysFromNextMonth;
            var startDayIndex = -daysFromPevMonth + 1,
                m, y,
                html = '';
            for (var i = startDayIndex, max = totalMonthDays + daysFromNextMonth; i <= max; i++) {
                y = date.getFullYear();
                m = date.getMonth();
                html += this._getDayHtml(new Date(y, m, i))
            }
            return html;
        },
        _getDayHtml: function (date) {
           var content = this._getCellContents(date, 'day');
            return '<div class="' + content.classes + '" ' +
                'data-date="' + date.getDate() + '" ' +
                'data-month="' + date.getMonth() + '" ' +
                'data-year="' + date.getFullYear() + '">' + content.html + '</div>';
        },
        /**
         * Generates months html
         * @param {object} date - date instance
         * @returns {string}
         * @private
         */
        _getMonthsHtml: function (date) {
            var html = '',
                d = dp.getParsedDate(date),
                i = 0;
            while(i < 12) {
                html += this._getMonthHtml(new Date(d.year, i));
                i++
            }
            return html;
        },
        _getMonthHtml: function (date) {
            var content = this._getCellContents(date, 'month');
            return '<div class="' + content.classes + '" data-month="' + date.getMonth() + '">' + content.html + '</div>'
        },
        _getYearsHtml: function (date) {
            var d = dp.getParsedDate(date),
                decade = dp.getDecade(date),
                firstYear = decade[0] - 1,
                html = '',
                i = firstYear;
            for (i; i <= decade[1] + 1; i++) {
                html += this._getYearHtml(new Date(i , 0));
            }
            return html;
        },
        _getYearHtml: function (date) {
            var content = this._getCellContents(date, 'year');
            return '<div class="' + content.classes + '" data-year="' + date.getFullYear() + '">' + content.html + '</div>'
        },
        _renderTypes: {
            days: function () {
                var dayNames = this._getDayNamesHtml(this.d.loc.firstDay),
                    days = this._getDaysHtml(this.d.currentDate);
                this.$cells.html(days);
                this.$names.html(dayNames)
            },
            months: function () {
                var html = this._getMonthsHtml(this.d.currentDate);
                this.$cells.html(html)
            },
            years: function () {
                var html = this._getYearsHtml(this.d.currentDate);
                this.$cells.html(html)
            }
        },
        _render: function () {
            if (this.opts.onlyTimepicker) return;
            this._renderTypes[this.type].bind(this)();
        },
        _update: function () {
            var $cells = $('.datepicker--cell', this.$cells),
                _this = this,
                classes,
                $cell,
                date;
            $cells.each(function (cell, i) {
                $cell = $(this);
                date = _this.d._getDateFromCell($(this));
                classes = _this._getCellContents(date, _this.d.cellType);
                $cell.attr('class',classes.classes)
            });
        },
        show: function () {
            if (this.opts.onlyTimepicker) return;
            this.$el.addClass('active');
            this.acitve = true;
        },
        hide: function () {
            this.$el.removeClass('active');
            this.active = false;
        },
        //  Events
        // -------------------------------------------------
        _handleClick: function (el) {
            var date = el.data('date') || 1,
                month = el.data('month') || 0,
                year = el.data('year') || this.d.parsedDate.year,
                dp = this.d;
            // Change view if min view does not reach yet
            if (dp.view != this.opts.minView) {
                dp.down(new Date(year, month, date));
                return;
            }
            // Select date if min view is reached
            var selectedDate = new Date(year, month, date),
                alreadySelected = this.d._isSelected(selectedDate, this.d.cellType);
            if (!alreadySelected) {
                dp._trigger('clickCell', selectedDate);
                return;
            }
            dp._handleAlreadySelectedDates.bind(dp, alreadySelected, selectedDate)();
        },
        _onClickCell: function (e) {
            var $el = $(e.target).closest('.datepicker--cell');
            if ($el.hasClass('-disabled-')) return;
            this._handleClick.bind(this)($el);
        }
    };
})();
;(function () {
    var template = '' +
        '<div class="datepicker--nav-action" data-action="prev">#{prevHtml}</div>' +
        '<div class="datepicker--nav-title">#{title}</div>' +
        '<div class="datepicker--nav-action" data-action="next">#{nextHtml}</div>',
        buttonsContainerTemplate = '<div class="datepicker--buttons"></div>',
        button = '<span class="datepicker--button" data-action="#{action}">#{label}</span>',
        datepicker = $.fn.datepicker,
        dp = datepicker.Constructor;
    datepicker.Navigation = function (d, opts) {
        this.d = d;
        this.opts = opts;
        this.$buttonsContainer = '';
        this.init();
    };
    datepicker.Navigation.prototype = {
        init: function () {
            this._buildBaseHtml();
            this._bindEvents();
        },
        _bindEvents: function () {
            this.d.$nav.on('click', '.datepicker--nav-action', $.proxy(this._onClickNavButton, this));
            this.d.$nav.on('click', '.datepicker--nav-title', $.proxy(this._onClickNavTitle, this));
            this.d.$datepicker.on('click', '.datepicker--button', $.proxy(this._onClickNavButton, this));
        },
        _buildBaseHtml: function () {
            if (!this.opts.onlyTimepicker) {
                this._render();
            }
            this._addButtonsIfNeed();
        },
        _addButtonsIfNeed: function () {
            if (this.opts.todayButton) {
                this._addButton('today')
            }
            if (this.opts.clearButton) {
                this._addButton('clear')
            }
        },
        _render: function () {
            var title = this._getTitle(this.d.currentDate),
                html = dp.template(template, $.extend({title: title}, this.opts));
            this.d.$nav.html(html);
            if (this.d.view == 'years') {
                $('.datepicker--nav-title', this.d.$nav).addClass('-disabled-');
            }
            this.setNavStatus();
        },
        _getTitle: function (date) {
            return this.d.formatDate(this.opts.navTitles[this.d.view], date)
        },
        _addButton: function (type) {
            if (!this.$buttonsContainer.length) {
                this._addButtonsContainer();
            }
            var data = {
                    action: type,
                    label: this.d.loc[type]
                },
                html = dp.template(button, data);
            if ($('[data-action=' + type + ']', this.$buttonsContainer).length) return;
            this.$buttonsContainer.append(html);
        },
        _addButtonsContainer: function () {
            this.d.$datepicker.append(buttonsContainerTemplate);
            this.$buttonsContainer = $('.datepicker--buttons', this.d.$datepicker);
        },
        setNavStatus: function () {
            if (!(this.opts.minDate || this.opts.maxDate) || !this.opts.disableNavWhenOutOfRange) return;
            var date = this.d.parsedDate,
                m = date.month,
                y = date.year,
                d = date.date;
            switch (this.d.view) {
                case 'days':
                    if (!this.d._isInRange(new Date(y, m-1, 1), 'month')) {
                        this._disableNav('prev')
                    }
                    if (!this.d._isInRange(new Date(y, m+1, 1), 'month')) {
                        this._disableNav('next')
                    }
                    break;
                case 'months':
                    if (!this.d._isInRange(new Date(y-1, m, d), 'year')) {
                        this._disableNav('prev')
                    }
                    if (!this.d._isInRange(new Date(y+1, m, d), 'year')) {
                        this._disableNav('next')
                    }
                    break;
                case 'years':
                    var decade = dp.getDecade(this.d.date);
                    if (!this.d._isInRange(new Date(decade[0] - 1, 0, 1), 'year')) {
                        this._disableNav('prev')
                    }
                    if (!this.d._isInRange(new Date(decade[1] + 1, 0, 1), 'year')) {
                        this._disableNav('next')
                    }
                    break;
            }
        },
        _disableNav: function (nav) {
            $('[data-action="' + nav + '"]', this.d.$nav).addClass('-disabled-')
        },
        _activateNav: function (nav) {
            $('[data-action="' + nav + '"]', this.d.$nav).removeClass('-disabled-')
        },
        _onClickNavButton: function (e) {
            var $el = $(e.target).closest('[data-action]'),
                action = $el.data('action');
            this.d[action]();
        },
        _onClickNavTitle: function (e) {
            if ($(e.target).hasClass('-disabled-')) return;
            if (this.d.view == 'days') {
                return this.d.view = 'months'
            }
            this.d.view = 'years';
        }
    }
})();
;(function () {
    var template = '<div class="datepicker--time">' +
        '<div class="datepicker--time-current">' +
        '   <span class="datepicker--time-current-hours">#{hourVisible}</span>' +
        '   <span class="datepicker--time-current-colon">:</span>' +
        '   <span class="datepicker--time-current-minutes">#{minValue}</span>' +
        '</div>' +
        '<div class="datepicker--time-sliders">' +
        '   <div class="datepicker--time-row">' +
        '      <input type="range" name="hours" value="#{hourValue}" min="#{hourMin}" max="#{hourMax}" step="#{hourStep}"/>' +
        '   </div>' +
        '   <div class="datepicker--time-row">' +
        '      <input type="range" name="minutes" value="#{minValue}" min="#{minMin}" max="#{minMax}" step="#{minStep}"/>' +
        '   </div>' +
        '</div>' +
        '</div>',
        datepicker = $.fn.datepicker,
        dp = datepicker.Constructor;
    datepicker.Timepicker = function (inst, opts) {
        this.d = inst;
        this.opts = opts;
        this.init();
    };
    datepicker.Timepicker.prototype = {
        init: function () {
            var input = 'input';
            this._setTime(this.d.date);
            this._buildHTML();
            if (navigator.userAgent.match(/trident/gi)) {
                input = 'change';
            }
            this.d.$el.on('selectDate', this._onSelectDate.bind(this));
            this.$ranges.on(input, this._onChangeRange.bind(this));
            this.$ranges.on('mouseup', this._onMouseUpRange.bind(this));
            this.$ranges.on('mousemove focus ', this._onMouseEnterRange.bind(this));
            this.$ranges.on('mouseout blur', this._onMouseOutRange.bind(this));
        },
        _setTime: function (date) {
            var _date = dp.getParsedDate(date);
            this._handleDate(date);
            this.hours = _date.hours < this.minHours ? this.minHours : _date.hours;
            this.minutes = _date.minutes < this.minMinutes ? this.minMinutes : _date.minutes;
        },
        /**
         * Sets minHours and minMinutes from date (usually it's a minDate)
         * Also changes minMinutes if current hours are bigger then @date hours
         * @param date {Date}
         * @private
         */
        _setMinTimeFromDate: function (date) {
            this.minHours = date.getHours();
            this.minMinutes = date.getMinutes();
            // If, for example, min hours are 10, and current hours are 12,
            // update minMinutes to default value, to be able to choose whole range of values
            if (this.d.lastSelectedDate) {
                if (this.d.lastSelectedDate.getHours() > date.getHours()) {
                    this.minMinutes = this.opts.minMinutes;
                }
            }
        },
        _setMaxTimeFromDate: function (date) {
            this.maxHours = date.getHours();
            this.maxMinutes = date.getMinutes();
            if (this.d.lastSelectedDate) {
                if (this.d.lastSelectedDate.getHours() < date.getHours()) {
                    this.maxMinutes = this.opts.maxMinutes;
                }
            }
        },
        _setDefaultMinMaxTime: function () {
            var maxHours = 23,
                maxMinutes = 59,
                opts = this.opts;
            this.minHours = opts.minHours < 0 || opts.minHours > maxHours ? 0 : opts.minHours;
            this.minMinutes = opts.minMinutes < 0 || opts.minMinutes > maxMinutes ? 0 : opts.minMinutes;
            this.maxHours = opts.maxHours < 0 || opts.maxHours > maxHours ? maxHours : opts.maxHours;
            this.maxMinutes = opts.maxMinutes < 0 || opts.maxMinutes > maxMinutes ? maxMinutes : opts.maxMinutes;
        },
        /**
         * Looks for min/max hours/minutes and if current values
         * are out of range sets valid values.
         * @private
         */
        _validateHoursMinutes: function (date) {
            if (this.hours < this.minHours) {
                this.hours = this.minHours;
            } else if (this.hours > this.maxHours) {
                this.hours = this.maxHours;
            }
            if (this.minutes < this.minMinutes) {
                this.minutes = this.minMinutes;
            } else if (this.minutes > this.maxMinutes) {
                this.minutes = this.maxMinutes;
            }
        },
        _buildHTML: function () {
            var lz = dp.getLeadingZeroNum,
                data = {
                    hourMin: this.minHours,
                    hourMax: lz(this.maxHours),
                    hourStep: this.opts.hoursStep,
                    hourValue: this.hours,
                    hourVisible: lz(this.displayHours),
                    minMin: this.minMinutes,
                    minMax: lz(this.maxMinutes),
                    minStep: this.opts.minutesStep,
                    minValue: lz(this.minutes)
                },
                _template = dp.template(template, data);
            this.$timepicker = $(_template).appendTo(this.d.$datepicker);
            this.$ranges = $('[type="range"]', this.$timepicker);
            this.$hours = $('[name="hours"]', this.$timepicker);
            this.$minutes = $('[name="minutes"]', this.$timepicker);
            this.$hoursText = $('.datepicker--time-current-hours', this.$timepicker);
            this.$minutesText = $('.datepicker--time-current-minutes', this.$timepicker);
            if (this.d.ampm) {
                this.$ampm = $('<span class="datepicker--time-current-ampm">')
                    .appendTo($('.datepicker--time-current', this.$timepicker))
                    .html(this.dayPeriod);
                this.$timepicker.addClass('-am-pm-');
            }
        },
        _updateCurrentTime: function () {
            var h =  dp.getLeadingZeroNum(this.displayHours),
                m = dp.getLeadingZeroNum(this.minutes);
            this.$hoursText.html(h);
            this.$minutesText.html(m);
            if (this.d.ampm) {
                this.$ampm.html(this.dayPeriod);
            }
        },
        _updateRanges: function () {
            this.$hours.attr({
                min: this.minHours,
                max: this.maxHours
            }).val(this.hours);
            this.$minutes.attr({
                min: this.minMinutes,
                max: this.maxMinutes
            }).val(this.minutes)
        },
        /**
         * Sets minHours, minMinutes etc. from date. If date is not passed, than sets
         * values from options
         * @param [date] {object} - Date object, to get values from
         * @private
         */
        _handleDate: function (date) {
            this._setDefaultMinMaxTime();
            if (date) {
                if (dp.isSame(date, this.d.opts.minDate)) {
                    this._setMinTimeFromDate(this.d.opts.minDate);
                } else if (dp.isSame(date, this.d.opts.maxDate)) {
                    this._setMaxTimeFromDate(this.d.opts.maxDate);
                }
            }
            this._validateHoursMinutes(date);
        },
        update: function () {
            this._updateRanges();
            this._updateCurrentTime();
        },
        /**
         * Calculates valid hour value to display in text input and datepicker's body.
         * @param date {Date|Number} - date or hours
         * @param [ampm] {Boolean} - 12 hours mode
         * @returns {{hours: *, dayPeriod: string}}
         * @private
         */
        _getValidHoursFromDate: function (date, ampm) {
            var d = date,
                hours = date;
            if (date instanceof Date) {
                d = dp.getParsedDate(date);
                hours = d.hours;
            }
            var _ampm = ampm || this.d.ampm,
                dayPeriod = 'am';
            if (_ampm) {
                switch(true) {
                    case hours == 0:
                        hours = 12;
                        break;
                    case hours == 12:
                        dayPeriod = 'pm';
                        break;
                    case hours > 11:
                        hours = hours - 12;
                        dayPeriod = 'pm';
                        break;
                    default:
                        break;
                }
            }
            return {
                hours: hours,
                dayPeriod: dayPeriod
            }
        },
        set hours (val) {
            this._hours = val;
            var displayHours = this._getValidHoursFromDate(val);
            this.displayHours = displayHours.hours;
            this.dayPeriod = displayHours.dayPeriod;
        },
        get hours() {
            return this._hours;
        },
        //  Events
        // -------------------------------------------------
        _onChangeRange: function (e) {
            var $target = $(e.target),
                name = $target.attr('name');
            
            this.d.timepickerIsActive = true;
            this[name] = $target.val();
            this._updateCurrentTime();
            this.d._trigger('timeChange', [this.hours, this.minutes]);
            this._handleDate(this.d.lastSelectedDate);
            this.update()
        },
        _onSelectDate: function (e, data) {
            this._handleDate(data);
            this.update();
        },
        _onMouseEnterRange: function (e) {
            var name = $(e.target).attr('name');
            $('.datepicker--time-current-' + name, this.$timepicker).addClass('-focus-');
        },
        _onMouseOutRange: function (e) {
            var name = $(e.target).attr('name');
            if (this.d.inFocus) return; // Prevent removing focus when mouse out of range slider
            $('.datepicker--time-current-' + name, this.$timepicker).removeClass('-focus-');
        },
        _onMouseUpRange: function (e) {
            this.d.timepickerIsActive = false;
        }
    };
})();
 })(window, jQuery);
// ==================================================
// fancyBox v3.0.47
//
// Licensed GPLv3 for open source use
// or fancyBox Commercial License for commercial use
//
// http://fancyapps.com/fancybox/
// Copyright 2017 fancyApps
//
// ==================================================
;(function (window, document, $, undefined) {
    'use strict';
    // If there's no jQuery, fancyBox can't work
    // =========================================
    if ( !$ ) {
        return undefined;
    }
    // Private default settings
    // ========================
    var defaults = {
        // Animation duration in ms
        speed : 330,
        // Enable infinite gallery navigation
        loop : true,
        // Should zoom animation change opacity, too
        // If opacity is 'auto', then fade-out if image and thumbnail have different aspect ratios
        opacity : 'auto',
        // Space around image, ignored if zoomed-in or viewport smaller than 800px
        margin : [44, 0],
        // Horizontal space between slides
        gutter : 30,
        // Should display toolbars
        infobar : true,
        buttons : true,
        // What buttons should appear in the toolbar
        slideShow  : true,
        fullScreen : true,
        thumbs     : true,
        closeBtn   : true,
        // Should apply small close button at top right corner of the content
        // If 'auto' - will be set for content having type 'html', 'inline' or 'ajax'
        smallBtn : 'auto',
        image : {
            // Wait for images to load before displaying
            // Requires predefined image dimensions
            // If 'auto' - will zoom in thumbnail if 'width' and 'height' attributes are found
            preload : "auto",
            // Protect an image from downloading by right-click
            protect : false
        },
        ajax : {
            // Object containing settings for ajax request
            settings : {
                // This helps to indicate that request comes from the modal
                // Feel free to change naming
                data : {
                    fancybox : true
                }
            }
        },
        iframe : {
            // Iframe template
            tpl : '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen allowtransparency="true" src=""></iframe>',
            // Preload iframe before displaying it
            // This allows to calculate iframe content width and height
            // (note: Due to "Same Origin Policy", you can't get cross domain data).
            preload : true,
            // Scrolling attribute for iframe tag
            scrolling : 'no',
            // Custom CSS styling for iframe wrapping element
            css : {}
        },
        // Custom CSS class for layout
        baseClass : '',
        // Custom CSS class for slide element
        slideClass : '',
        // Base template for layout
        baseTpl : '<div class="fancybox-container" role="dialog" tabindex="-1">' +
                '<div class="fancybox-bg"></div>' +
                '<div class="fancybox-controls">' +
                    '<div class="fancybox-infobar">' +
                        '<button data-fancybox-previous class="fancybox-button fancybox-button--left" title="Previous"></button>' +
                        '<div class="fancybox-infobar__body">' +
                            '<span class="js-fancybox-index"></span>&nbsp;/&nbsp;<span class="js-fancybox-count"></span>' +
                        '</div>' +
                        '<button data-fancybox-next class="fancybox-button fancybox-button--right" title="Next"></button>' +
                    '</div>' +
                    '<div class="fancybox-buttons">' +
                        '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="Close (Esc)"></button>' +
                    '</div>' +
                '</div>' +
                '<div class="fancybox-slider-wrap">' +
                    '<div class="fancybox-slider"></div>' +
                '</div>' +
                '<div class="fancybox-caption-wrap"><div class="fancybox-caption"></div></div>' +
            '</div>',
        // Loading indicator template
        spinnerTpl : '<div class="fancybox-loading"></div>',
        // Error message template
        errorTpl : '<div class="fancybox-error"><p>The requested content cannot be loaded. <br /> Please try again later.<p></div>',
        // This will be appended to html content, if "smallBtn" option is not set to false
        closeTpl : '<button data-fancybox-close class="fancybox-close-small"></button>',
        // Container is injected into this element
        parentEl : 'body',
        // Enable gestures (tap, zoom, pan and pinch)
        touch : true,
        // Enable keyboard navigation
        keyboard : true,
        // Try to focus on first focusable element after opening
        focus : true,
        // Close when clicked outside of the content
        closeClickOutside : true,
        // Callbacks
        beforeLoad   : $.noop,
        afterLoad    : $.noop,
        beforeMove   : $.noop,
        afterMove    : $.noop,
        onComplete   : $.noop,
        onInit       : $.noop,
        beforeClose  : $.noop,
        afterClose   : $.noop,
        onActivate   : $.noop,
        onDeactivate : $.noop
    };
    var $W = $(window);
    var $D = $(document);
    var called = 0;
    // Check if an object is a jQuery object and not a native JavaScript object
    // ========================================================================
    var isQuery = function (obj) {
        return obj && obj.hasOwnProperty && obj instanceof $;
    };
    // Handle multiple browsers for requestAnimationFrame()
    // ====================================================
    var requestAFrame = (function() {
        return  window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function( callback ) {
                    window.setTimeout(callback, 1000 / 60); };
                })();
    // Check if element is inside the viewport by at least 1 pixel
    // ===========================================================
    var isElementInViewport = function( el ) {
        var rect;
        if ( typeof $ === "function" && el instanceof $ ) {
            el = el[0];
        }
        rect = el.getBoundingClientRect();
        return rect.bottom > 0 && rect.right > 0 &&
                rect.left < (window.innerWidth || document.documentElement.clientWidth)  &&
                rect.top < (window.innerHeight || document.documentElement.clientHeight);
    };
    // Class definition
    // ================
    var FancyBox = function( content, opts, index ) {
        var self = this;
        self.opts  = $.extend( true, { index : index }, defaults, opts || {} );
        self.id    = self.opts.id || ++called;
        self.group = [];
        self.currIndex = parseInt( self.opts.index, 10 ) || 0;
        self.prevIndex = null;
        self.prevPos = null;
        self.currPos = 0;
        self.firstRun = null;
        // Create group elements from original item collection
        self.createGroup( content );
        if ( !self.group.length ) {
            return;
        }
        // Save last active element and current scroll position
        self.$lastFocus = $(document.activeElement).blur();
        // Collection of gallery objects
        self.slides = {};
        self.init( content );
    };
    $.extend(FancyBox.prototype, {
        // Create DOM structure
        // ====================
        init : function() {
            var self = this;
            var galleryHasHtml = false;
            var testWidth;
            var $container;
            self.scrollTop  = $D.scrollTop();
            self.scrollLeft = $D.scrollLeft();
            if ( !$.fancybox.getInstance() ) {
                testWidth = $( 'body' ).width();
                $( 'html' ).addClass( 'fancybox-enabled' );
                if ( $.fancybox.isTouch ) {
                    // Ugly workaround for iOS page shifting issue (when inputs get focus)
                    // Do not apply for images, otherwise top/bottom bars will appear
                    $.each( self.group, function( key, item ) {
                        if ( item.type !== 'image' && item.type !== 'iframe' ) {
                            galleryHasHtml = true;
                            return false;
                        }
                    });
                    if ( galleryHasHtml ) {
                        $('body').css({
                            position : 'fixed',
                            width    : testWidth,
                            top      : self.scrollTop * -1
                        });
                    }
                } else {
                    // Compare page width after adding "overflow:hidden"
                    testWidth = $( 'body' ).width() - testWidth;
                    // Width has changed - compensate missing scrollbars
                    if ( testWidth > 1 ) {
                        $( '<style id="fancybox-noscroll" type="text/css">' ).html( '.compensate-for-scrollbar, .fancybox-enabled body { margin-right: ' + testWidth + 'px; }' ).appendTo( 'head' );
                    }
                }
            }
            $container = $( self.opts.baseTpl )
                .attr('id', 'fancybox-container-' + self.id)
                .data( 'FancyBox', self )
                .addClass( self.opts.baseClass )
                .hide()
                .prependTo( self.opts.parentEl );
            // Create object holding references to jQuery wrapped nodes
            self.$refs = {
                container   : $container,
                bg          : $container.find('.fancybox-bg'),
                controls    : $container.find('.fancybox-controls'),
                buttons     : $container.find('.fancybox-buttons'),
                slider_wrap : $container.find('.fancybox-slider-wrap'),
                slider      : $container.find('.fancybox-slider'),
                caption     : $container.find('.fancybox-caption')
            };
            self.trigger( 'onInit' );
            // Bring to front and enable events
            self.activate();
            // Try to avoid running multiple times
            if ( self.current ) {
                return;
            }
            self.jumpTo( self.currIndex );
        },
        // Create array of gally item objects
        // Check if each object has valid type and content
        // ===============================================
        createGroup : function ( content ) {
            var self  = this;
            var items = $.makeArray( content );
            $.each(items, function( i, item ) {
                var obj  = {},
                    opts = {},
                    data = [],
                    $item,
                    type,
                    src,
                    srcParts;
                // Step 1 - Make sure we have an object
                if ( $.isPlainObject( item ) ) {
                    obj  = item;
                    opts = item.opts || {};
                } else if ( $.type( item ) === 'object' && $( item ).length ) {
                    $item = $( item );
                    data  = $item.data();
                    opts = 'options' in data ? data.options : {};
                    opts = $.type( opts ) === 'object' ? opts : {};
                    obj.type = 'type' in data ? data.type : opts.type;
                    obj.src  = 'src'  in data ? data.src  : ( opts.src || $item.attr( 'href' ) );
                    opts.width   = 'width'   in data ? data.width   : opts.width;
                    opts.height  = 'height'  in data ? data.height  : opts.height;
                    opts.thumb   = 'thumb'   in data ? data.thumb   : opts.thumb;
                    opts.selector = 'selector'  in data ? data.selector  : opts.selector;
                    if ( 'srcset' in data ) {
                        opts.image = { srcset : data.srcset };
                    }
                    opts.$orig = $item;
                } else {
                    obj = {
                        type    : 'html',
                        content : item + ''
                    };
                }
                obj.opts = $.extend( true, {}, self.opts, opts );
                // Step 2 - Make sure we have supported content type
                type = obj.type;
                src  = obj.src || '';
                if ( !type ) {
                    if ( obj.content ) {
                        type = 'html';
                    } else if ( src.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i) ) {
                        type = 'image';
                    } else if ( src.match(/\.(pdf)((\?|#).*)?$/i) ) {
                        type = 'pdf';
                    } else if ( src.charAt(0) === '#' ) {
                        type = 'inline';
                    }
                    obj.type = type;
                }
                // Step 3 - Some adjustments
                obj.index = self.group.length;
                // Check if $orig and $thumb objects exist
                if ( obj.opts.$orig && !obj.opts.$orig.length ) {
                    delete obj.opts.$orig;
                }
                if ( !obj.opts.$thumb && obj.opts.$orig ) {
                    obj.opts.$thumb = obj.opts.$orig.find( 'img:first' );
                }
                if ( obj.opts.$thumb && !obj.opts.$thumb.length ) {
                    delete obj.opts.$thumb;
                }
                // Caption is a "special" option, it can be passed as a method
                if ( $.type( obj.opts.caption ) === 'function' ) {
                    obj.opts.caption = obj.opts.caption.apply( item, [ self, obj ] );
                } else if ( 'caption' in data ) {
                    obj.opts.caption = data.caption;
                } else if ( opts.$orig ) {
                    obj.opts.caption = $item.attr( 'title' );
                }
                // Make sure we have caption as a string
                obj.opts.caption = obj.opts.caption === undefined ? '' : obj.opts.caption + '';
                // Check if url contains selector used to filter the content
                // Example: "ajax.html #something"
                if ( type === 'ajax' ) {
                    srcParts = src.split(/\s+/, 2);
                    if ( srcParts.length > 1 ) {
                        obj.src = srcParts.shift();
                        obj.opts.selector = srcParts.shift();
                    }
                }
                if ( obj.opts.smallBtn == 'auto' ) {
                    if ( $.inArray( type, ['html', 'inline', 'ajax'] ) > -1 ) {
                        obj.opts.buttons  = false;
                        obj.opts.smallBtn = true;
                    } else {
                        obj.opts.smallBtn = false;
                    }
                }
                if ( type === 'pdf' ) {
                    obj.type = 'iframe';
                    obj.opts.closeBtn = true;
                    obj.opts.smallBtn = false;
                    obj.opts.iframe.preload = false;
                }
                if ( obj.opts.modal ) {
                    $.extend(true, obj.opts, {
                        infobar     : 0,
                        buttons     : 0,
                        keyboard    : 0,
                        slideShow   : 0,
                        fullScreen  : 0,
                        closeClickOutside   : 0
                    });
                }
                self.group.push( obj );
            });
        },
        // Attach an event handler functions for:
        //   - navigation elements
        //   - browser scrolling, resizing;
        //   - focusing
        //   - keyboard
        // =================
        addEvents : function() {
            var self = this;
            self.removeEvents();
            // Make navigation elements clickable
            self.$refs.container.on('click.fb-close', '[data-fancybox-close]', function(e) {
                e.stopPropagation();
                e.preventDefault();
                self.close( e );
            }).on('click.fb-previous', '[data-fancybox-previous]', function(e) {
                e.stopPropagation();
                e.preventDefault();
                self.previous();
            }).on('click.fb-next', '[data-fancybox-next]', function(e) {
                e.stopPropagation();
                e.preventDefault();
                self.next();
            });
            // Handle page scrolling and browser resizing
            $( window ).on('orientationchange.fb resize.fb', function(e) {
                requestAFrame(function() {
                    if ( e && e.originalEvent && e.originalEvent.type === "resize" ) {
                        self.update();
                    } else {
                        self.$refs.slider_wrap.hide();
                        requestAFrame(function () {
                            self.$refs.slider_wrap.show();
                            self.update();
                        });
                    }
                });
            });
            // Trap focus
            $D.on('focusin.fb', function(e) {
                var instance = $.fancybox ? $.fancybox.getInstance() : null;
                if ( instance && !$( e.target ).hasClass( 'fancybox-container' ) && !$.contains( instance.$refs.container[0], e.target ) ) {
                    e.stopPropagation();
                    instance.focus();
                    // Sometimes page gets scrolled, set it back
                    $W.scrollTop( self.scrollTop ).scrollLeft( self.scrollLeft );
                }
            });
            // Enable keyboard navigation
            $D.on('keydown.fb', function (e) {
                var current = self.current,
                    keycode = e.keyCode || e.which;
                if ( !current || !current.opts.keyboard ) {
                    return;
                }
                if ( $(e.target).is('input') || $(e.target).is('textarea') ) {
                    return;
                }
                // Backspace and Esc keys
                if ( keycode === 8 || keycode === 27 ) {
                    e.preventDefault();
                    self.close( e );
                    return;
                }
                switch ( keycode ) {
                    case 37: // Left arrow
                    case 38: // Up arrow
                        e.preventDefault();
                        self.previous();
                    break;
                    case 39: // Right arrow
                    case 40: // Down arrow
                        e.preventDefault();
                        self.next();
                    break;
                    case 80: // "P"
                    case 32: // Spacebar
                        e.preventDefault();
                        if ( self.SlideShow ) {
                            e.preventDefault();
                            self.SlideShow.toggle();
                        }
                    break;
                    case 70: // "F"
                        if ( self.FullScreen ) {
                            e.preventDefault();
                            self.FullScreen.toggle();
                        }
                    break;
                    case 71: // "G"
                        if ( self.Thumbs ) {
                            e.preventDefault();
                            self.Thumbs.toggle();
                        }
                    break;
                }
            });
        },
        // Remove events added by the core
        // ===============================
        removeEvents : function () {
            $W.off( 'scroll.fb resize.fb orientationchange.fb' );
            $D.off( 'keydown.fb focusin.fb click.fb-close' );
            this.$refs.container.off('click.fb-close click.fb-previous click.fb-next');
        },
        // Slide to left
        // ==================
        previous : function( duration ) {
            this.jumpTo( this.currIndex - 1, duration );
        },
        // Slide to right
        // ===================
        next : function( duration ) {
            this.jumpTo( this.currIndex + 1, duration );
        },
        // Display current gallery item, move slider to current position
        // =============================================================
        jumpTo : function ( to, duration ) {
            var self = this,
                firstRun,
                index,
                pos,
                loop;
            firstRun = self.firstRun = ( self.firstRun === null );
            index = pos = to = parseInt( to, 10 );
            loop  = self.current ? self.current.opts.loop : false;
            if ( self.isAnimating || ( index == self.currIndex && !firstRun ) ) {
                return;
            }
            if ( self.group.length > 1 && loop ) {
                index = index % self.group.length;
                index = index < 0 ? self.group.length + index : index;
                // Calculate closest position of upcoming item from the current one
                if ( self.group.length == 2 ) {
                    pos = to - self.currIndex + self.currPos;
                } else {
                    pos = index - self.currIndex + self.currPos;
                    if ( Math.abs( self.currPos - ( pos + self.group.length ) ) < Math.abs( self.currPos - pos ) ) {
                        pos = pos + self.group.length;
                    } else if ( Math.abs( self.currPos - ( pos - self.group.length ) ) < Math.abs( self.currPos - pos ) ) {
                        pos = pos - self.group.length;
                    }
                }
            } else if ( !self.group[ index ] ) {
                self.update( false, false, duration );
                return;
            }
            if ( self.current ) {
                self.current.$slide.removeClass('fancybox-slide--current fancybox-slide--complete');
                self.updateSlide( self.current, true );
            }
            self.prevIndex = self.currIndex;
            self.prevPos   = self.currPos;
            self.currIndex = index;
            self.currPos   = pos;
            // Create slides
            self.current = self.createSlide( pos );
            if ( self.group.length > 1 ) {
                if ( self.opts.loop || pos - 1 >= 0 ) {
                    self.createSlide( pos - 1 );
                }
                if ( self.opts.loop || pos + 1 < self.group.length ) {
                    self.createSlide( pos + 1 );
                }
            }
            self.current.isMoved    = false;
            self.current.isComplete = false;
            duration = parseInt( duration === undefined ? self.current.opts.speed * 1.5 : duration, 10 );
            // Move slider to the next position
            // Note: the content might still be loading
            self.trigger( 'beforeMove' );
            self.updateControls();
            if ( firstRun ) {
                self.current.$slide.addClass('fancybox-slide--current');
                self.$refs.container.show();
                requestAFrame(function() {
                    self.$refs.bg.css('transition-duration', self.current.opts.speed + 'ms');
                    self.$refs.container.addClass( 'fancybox-container--ready' );
                });
            }
            // Set position immediately on first opening
            self.update( true, false, firstRun ? 0 : duration, function() {
                self.afterMove();
            });
            self.loadSlide( self.current );
            if ( !( firstRun && self.current.$ghost ) ) {
                self.preload();
            }
        },
        // Create new "slide" element
        // These are gallery items  that are actually added to DOM
        // =======================================================
        createSlide : function( pos ) {
            var self = this;
            var $slide;
            var index;
            var found;
            index = pos % self.group.length;
            index = index < 0 ? self.group.length + index : index;
            if ( !self.slides[ pos ] && self.group[ index ] ) {
                // If we are looping and slide with that index already exists, then reuse it
                if ( self.opts.loop && self.group.length > 2 ) {
                    for (var key in self.slides) {
                        if ( self.slides[ key ].index === index ) {
                            found = self.slides[ key ];
                            found.pos = pos;
                            self.slides[ pos ] = found;
                            delete self.slides[ key ];
                            self.updateSlide( found );
                            return found;
                        }
                    }
                }
                $slide = $('<div class="fancybox-slide"></div>').appendTo( self.$refs.slider );
                self.slides[ pos ] = $.extend( true, {}, self.group[ index ], {
                    pos      : pos,
                    $slide   : $slide,
                    isMoved  : false,
                    isLoaded : false
                });
            }
            return self.slides[ pos ];
        },
        zoomInOut : function( type, duration, callback ) {
            var self     = this;
            var current  = self.current;
            var $what    = current.$placeholder;
            var opacity  = current.opts.opacity;
            var $thumb   = current.opts.$thumb;
            var thumbPos = $thumb ? $thumb.offset() : 0;
            var slidePos = current.$slide.offset();
            var props;
            var start;
            var end;
            if ( !$what || !current.isMoved || !thumbPos || !isElementInViewport( $thumb ) ) {
                return false;
            }
            if ( type === 'In' && !self.firstRun ) {
                return false;
            }
            $.fancybox.stop( $what );
            self.isAnimating = true;
            props = {
                top    : thumbPos.top  - slidePos.top  + parseFloat( $thumb.css( "border-top-width" ) || 0 ),
                left   : thumbPos.left - slidePos.left + parseFloat( $thumb.css( "border-left-width" ) || 0 ),
                width  : $thumb.width(),
                height : $thumb.height(),
                scaleX : 1,
                scaleY : 1
            };
            // Check if we need to animate opacity
            if ( opacity == 'auto' ) {
                opacity = Math.abs( current.width / current.height - props.width / props.height ) > 0.1;
            }
            if ( type === 'In' ) {
                start = props;
                end   = self.getFitPos( current );
                end.scaleX = end.width  / start.width;
                end.scaleY = end.height / start.height;
                if ( opacity ) {
                    start.opacity = 0.1;
                    end.opacity   = 1;
                }
            } else {
                start = $.fancybox.getTranslate( $what );
                end   = props;
                // Switch to thumbnail image to improve animation performance
                if ( current.$ghost ) {
                    current.$ghost.show();
                    if ( current.$image ) {
                        current.$image.remove();
                    }
                }
                start.scaleX = start.width  / end.width;
                start.scaleY = start.height / end.height;
                start.width  = end.width;
                start.height = end.height;
                if ( opacity ) {
                    end.opacity = 0;
                }
            }
            self.updateCursor( end.width, end.height );
            // There is no need to animate width/height properties
            delete end.width;
            delete end.height;
            $.fancybox.setTranslate( $what, start );
            $what.show();
            self.trigger( 'beforeZoom' + type );
            $what.css( 'transition', 'all ' + duration + 'ms' );
            $.fancybox.setTranslate( $what, end );
            setTimeout(function() {
                var reset;
                $what.css( 'transition', 'none' );
                reset = $.fancybox.getTranslate( $what );
                reset.scaleX = 1;
                reset.scaleY = 1;
                // Reset scalex/scaleY values; this helps for perfomance
                $.fancybox.setTranslate( $what, reset );
                self.trigger( 'afterZoom' + type );
                callback.apply( self );
                self.isAnimating = false;
            }, duration);
            return true;
        },
        // Check if image dimensions exceed parent element
        // ===============================================
        canPan : function() {
            var self = this;
            var current = self.current;
            var $what   = current.$placeholder;
            var rez = false;
            if ( $what ) {
                rez = self.getFitPos( current );
                rez = Math.abs( $what.width() - rez.width ) > 1  || Math.abs( $what.height() - rez.height ) > 1;
            }
            return rez;
        },
        // Check if current image dimensions are smaller than actual
        // =========================================================
        isScaledDown : function() {
            var self = this;
            var current = self.current;
            var $what   = current.$placeholder;
            var rez = false;
            if ( $what ) {
                rez = $.fancybox.getTranslate( $what );
                rez = rez.width < current.width || rez.height < current.height;
            }
            return rez;
        },
        // Scale image to the actual size of the image
        // ===========================================
        scaleToActual : function( x, y, duration ) {
            var self = this;
            var current = self.current;
            var $what   = current.$placeholder;
            var imgPos, posX, posY, scaleX, scaleY;
            var canvasWidth  = parseInt( current.$slide.width(), 10 );
            var canvasHeight = parseInt( current.$slide.height(), 10 );
            var newImgWidth  = current.width;
            var newImgHeight = current.height;
            if ( !$what ) {
                return;
            }
            self.isAnimating = true;
            x = x === undefined ? canvasWidth  * 0.5  : x;
            y = y === undefined ? canvasHeight * 0.5  : y;
            imgPos = $.fancybox.getTranslate( $what );
            scaleX  = newImgWidth  / imgPos.width;
            scaleY  = newImgHeight / imgPos.height;
            // Get center position for original image
            posX = ( canvasWidth * 0.5  - newImgWidth * 0.5 );
            posY = ( canvasHeight * 0.5 - newImgHeight * 0.5 );
            // Make sure image does not move away from edges
            if ( newImgWidth > canvasWidth ) {
                posX = imgPos.left * scaleX - ( ( x * scaleX ) - x );
                if ( posX > 0 ) {
                    posX = 0;
                }
                if ( posX <  canvasWidth - newImgWidth ) {
                    posX = canvasWidth - newImgWidth;
                }
            }
            if ( newImgHeight > canvasHeight) {
                posY = imgPos.top  * scaleY - ( ( y * scaleY ) - y );
                if ( posY > 0 ) {
                    posY = 0;
                }
                if ( posY <  canvasHeight - newImgHeight ) {
                    posY = canvasHeight - newImgHeight;
                }
            }
            self.updateCursor( newImgWidth, newImgHeight );
            $.fancybox.animate( $what, null, {
                top    : posY,
                left   : posX,
                scaleX : scaleX,
                scaleY : scaleY
            }, duration || current.opts.speed, function() {
                self.isAnimating = false;
            });
        },
        // Scale image to fit inside parent element
        // ========================================
        scaleToFit : function( duration ) {
            var self = this;
            var current = self.current;
            var $what   = current.$placeholder;
            var end;
            if ( !$what ) {
                return;
            }
            self.isAnimating = true;
            end = self.getFitPos( current );
            self.updateCursor( end.width, end.height );
            $.fancybox.animate( $what, null, {
                top    : end.top,
                left   : end.left,
                scaleX : end.width  / $what.width(),
                scaleY : end.height / $what.height()
            }, duration || current.opts.speed, function() {
                self.isAnimating = false;
            });
        },
        // Calculate image size to fit inside viewport
        // ===========================================
        getFitPos : function( slide ) {
            var $what = slide.$placeholder || slide.$content;
            var imgWidth  = slide.width;
            var imgHeight = slide.height;
            var margin = slide.opts.margin;
            var canvasWidth, canvasHeight, minRatio, top, left, width, height;
            if ( !$what || !$what.length || ( !imgWidth && !imgHeight) ) {
                return false;
            }
            // Convert "margin to CSS style: [ top, right, bottom, left ]
            if ( $.type( margin ) === "number" ) {
                margin = [ margin, margin ];
            }
            if ( margin.length == 2 ) {
                margin = [ margin[0], margin[1], margin[0], margin[1] ];
            }
            if ( $W.width() < 800 ) {
                margin = [0, 0, 0, 0];
            }
            canvasWidth  = parseInt( slide.$slide.width(), 10 )  - ( margin[ 1 ] + margin[ 3 ] );
            canvasHeight = parseInt( slide.$slide.height(), 10 ) - ( margin[ 0 ] + margin[ 2 ] );
            minRatio = Math.min(1, canvasWidth / imgWidth, canvasHeight / imgHeight );
            // Use floor rounding to make sure it really fits
            width  = Math.floor( minRatio * imgWidth );
            height = Math.floor( minRatio * imgHeight );
            top  = Math.floor( ( canvasHeight - height ) * 0.5 ) + margin[ 0 ];
            left = Math.floor( ( canvasWidth  - width )  * 0.5 ) + margin[ 3 ];
            return {
                top    : top,
                left   : left,
                width  : width,
                height : height
            };
        },
        // Move slider to current position
        // Update all slides (and their content)
        // =====================================
        update : function( andSlides, andContent, duration, callback ) {
            var self = this;
            var leftValue;
            if ( self.isAnimating === true || !self.current ) {
                return;
            }
            leftValue = ( self.current.pos * Math.floor( self.current.$slide.width() ) * -1 ) - ( self.current.pos * self.current.opts.gutter );
            duration  = parseInt( duration, 10 ) || 0;
            $.fancybox.stop( self.$refs.slider );
            if ( andSlides === false ) {
                self.updateSlide( self.current, andContent );
            } else {
                $.each( self.slides, function( key, slide ) {
                    self.updateSlide( slide, andContent );
                });
            }
            if ( duration ) {
                $.fancybox.animate( self.$refs.slider, null, {
                    top  : 0,
                    left : leftValue
                }, duration, function() {
                    self.current.isMoved = true;
                    if ( $.type( callback ) === 'function' ) {
                        callback.apply( self );
                    }
                });
            } else {
                $.fancybox.setTranslate( self.$refs.slider, { top : 0, left : leftValue } );
                self.current.isMoved = true;
                if ( $.type( callback ) === 'function' ) {
                    callback.apply( self );
                }
            }
        },
        // Update slide position and scale content to fit
        // ==============================================
        updateSlide : function( slide, andContent ) {
            var self  = this;
            var $what = slide.$placeholder;
            var leftPos;
            slide = slide || self.current;
            if ( !slide || self.isClosing ) {
                return;
            }
            leftPos = ( slide.pos * Math.floor( slide.$slide.width() )  ) + ( slide.pos * slide.opts.gutter);
            if ( leftPos !== slide.leftPos ) {
                $.fancybox.setTranslate( slide.$slide, { top: 0, left : leftPos } );
                slide.leftPos = leftPos;
            }
            if ( andContent !== false && $what ) {
                $.fancybox.setTranslate( $what, self.getFitPos( slide ) );
                if ( slide.pos === self.currPos ) {
                    self.updateCursor();
                }
            }
            slide.$slide.trigger( 'refresh' );
            self.trigger( 'onUpdate', slide );
        },
        // Update cursor style depending if content can be zoomed
        // ======================================================
        updateCursor : function( nextWidth, nextHeight ) {
            var self = this;
            var canScale;
            var $container = self.$refs.container.removeClass('fancybox-controls--canzoomIn fancybox-controls--canzoomOut fancybox-controls--canGrab');
            if ( self.isClosing || !self.opts.touch ) {
                return;
            }
            if ( nextWidth !== undefined && nextHeight !== undefined ) {
                canScale = nextWidth < self.current.width && nextHeight < self.current.height;
            } else {
                canScale = self.isScaledDown();
            }
            if ( canScale ) {
                $container.addClass('fancybox-controls--canzoomIn');
            } else if ( self.group.length < 2 ) {
                $container.addClass('fancybox-controls--canzoomOut');
            } else {
                $container.addClass('fancybox-controls--canGrab');
            }
        },
        // Load content into the slide
        // ===========================
        loadSlide : function( slide ) {
            var self = this, type, $slide;
            var ajaxLoad;
            if ( !slide || slide.isLoaded || slide.isLoading ) {
                return;
            }
            slide.isLoading = true;
            self.trigger( 'beforeLoad', slide );
            type   = slide.type;
            $slide = slide.$slide;
            $slide
                .off( 'refresh' )
                .trigger( 'onReset' )
                .addClass( 'fancybox-slide--' + ( type || 'unknown' ) )
                .addClass( slide.opts.slideClass );
            // Create content depending on the type
            switch ( type ) {
                case 'image':
                    self.setImage( slide );
                break;
                case 'iframe':
                    self.setIframe( slide );
                break;
                case 'html':
                    self.setContent( slide, slide.content );
                break;
                case 'inline':
                    if ( $( slide.src ).length ) {
                        self.setContent( slide, $( slide.src ) );
                    } else {
                        self.setError( slide );
                    }
                break;
                case 'ajax':
                    self.showLoading( slide );
                    ajaxLoad = $.ajax( $.extend( {}, slide.opts.ajax.settings, {
                        url: slide.src,
                        success: function ( data, textStatus ) {
                            if ( textStatus === 'success' ) {
                                self.setContent( slide, data );
                            }
                        },
                        error: function ( jqXHR, textStatus ) {
                            if ( jqXHR && textStatus !== 'abort' ) {
                                self.setError( slide );
                            }
                        }
                    }));
                    $slide.one( 'onReset', function () {
                        ajaxLoad.abort();
                    });
                break;
                default:
                    self.setError( slide );
                break;
            }
            return true;
        },
        // Use thumbnail image, if possible
        // ================================
        setImage : function( slide ) {
            var self   = this;
            var srcset = slide.opts.image.srcset;
            var found, temp, pxRatio, windowWidth;
            if ( slide.isLoaded && !slide.hasError ) {
                self.afterLoad( slide );
                return;
            }
            // If we have "srcset", then we need to find matching "src" value.
            // This is necessary, because when you set an src attribute, the browser will preload the image
            // before any javascript or even CSS is applied.
            if ( srcset ) {
                pxRatio     = window.devicePixelRatio || 1;
                windowWidth = window.innerWidth  * pxRatio;
                temp = srcset.split(',').map(function (el) {
                    var ret = {};
                    el.trim().split(/\s+/).forEach(function (el, i) {
                        var value = parseInt(el.substring(0, el.length - 1), 10);
                        if ( i === 0 ) {
                            return (ret.url = el);
                        }
                        if ( value ) {
                            ret.value   = value;
                            ret.postfix = el[el.length - 1];
                        }
                    });
                    return ret;
                });
                // Sort by value
                temp.sort(function (a, b) {
                  return a.value - b.value;
                });
                // Ok, now we have an array of all srcset values
                for ( var j = 0; j < temp.length; j++ ) {
                    var el = temp[ j ];
                    if ( ( el.postfix === 'w' && el.value >= windowWidth ) || ( el.postfix === 'x' && el.value >= pxRatio ) ) {
                        found = el;
                        break;
                    }
                }
                // If not found, take the last one
                if ( !found && temp.length ) {
                    found = temp[ temp.length - 1 ];
                }
                if ( found ) {
                    slide.src = found.url;
                    // If we have default width/height values, we can calculate height for matching source
                    if ( slide.width && slide.height && found.postfix == 'w' ) {
                        slide.height = ( slide.width / slide.height ) * found.value;
                        slide.width  = found.value;
                    }
                }
            }
            slide.$placeholder = $('<div class="fancybox-placeholder"></div>')
                .hide()
                .appendTo( slide.$slide );
            if ( slide.opts.preload !== false && slide.opts.width && slide.opts.height && ( slide.opts.thumb || slide.opts.$thumb ) ) {
                slide.width  = slide.opts.width;
                slide.height = slide.opts.height;
                slide.$ghost = $('<img />')
                    .one('load error', function() {
                        if ( self.isClosing ) {
                            return;
                        }
                        // Start preloading full size image
                        $('<img/>')[0].src = slide.src;
                        // zoomIn or just show
                        self.revealImage( slide, function() {
                            self.setBigImage( slide );
                            if ( self.firstRun && slide.index === self.currIndex ) {
                                self.preload();
                            }
                        });
                    })
                    .addClass( 'fancybox-image' )
                    .appendTo( slide.$placeholder )
                    .attr( 'src', slide.opts.thumb || slide.opts.$thumb.attr( 'src' ) );
            } else {
                self.setBigImage( slide );
            }
        },
        // Create full-size image
        // ======================
        setBigImage : function ( slide ) {
            var self = this;
            var $img = $('<img />');
            slide.$image = $img
                .one('error', function() {
                    self.setError( slide );
                })
                .one('load', function() {
                    // Clear timeout that checks if loading icon needs to be displayed
                    clearTimeout( slide.timouts );
                    slide.timouts = null;
                    if ( self.isClosing ) {
                        return;
                    }
                    slide.width  = this.naturalWidth;
                    slide.height = this.naturalHeight;
                    if ( slide.opts.image.srcset ) {
                        $img.attr('sizes', '100vw').attr('srcset', slide.opts.image.srcset);
                    }
                    self.afterLoad( slide );
                    if ( slide.$ghost ) {
                        slide.timouts = setTimeout(function() {
                            slide.$ghost.hide();
                        }, 350);
                    }
                })
                .addClass('fancybox-image')
                .attr('src', slide.src)
                .appendTo( slide.$placeholder );
            if ( $img[0].complete ) {
                  $img.trigger('load');
            } else if( $img[0].error ) {
                 $img.trigger('error');
            } else {
                slide.timouts = setTimeout(function() {
                    if ( !$img[0].complete && !slide.hasError ) {
                        self.showLoading( slide );
                    }
                }, 150);
            }
            if ( slide.opts.image.protect ) {
                $('<div class="fancybox-spaceball"></div>').appendTo( slide.$placeholder ).on('contextmenu.fb',function(e){
                     if ( e.button == 2 ) {
                         e.preventDefault();
                     }
                    return true;
                });
            }
        },
        // Simply show image holder without animation
        // It has been hidden initially to avoid flickering
        // ================================================
        revealImage : function( slide, callback ) {
            var self = this;
            callback = callback || $.noop;
            if ( slide.type !== 'image' || slide.hasError || slide.isRevealed === true ) {
                callback.apply( self );
                return;
            }
            slide.isRevealed = true;
            if ( !( slide.pos === self.currPos && self.zoomInOut( 'In', slide.opts.speed, callback ) ) ) {
                if ( slide.$ghost && !slide.isLoaded ) {
                    self.updateSlide( slide, true );
                }
                if ( slide.pos === self.currPos ) {
                    $.fancybox.animate( slide.$placeholder, { opacity: 0 }, { opacity: 1 }, 300, callback );
                } else {
                    slide.$placeholder.show();
                }
                callback.apply( self );
            }
        },
        // Create iframe wrapper, iframe and bindings
        // ==========================================
        setIframe : function( slide ) {
            var self    = this,
                opts    = slide.opts.iframe,
                $slide  = slide.$slide,
                $iframe;
            slide.$content = $('<div class="fancybox-content"></div>')
                .css( opts.css )
                .appendTo( $slide );
            $iframe = $( opts.tpl.replace(/\{rnd\}/g, new Date().getTime()) )
                .attr('scrolling', $.fancybox.isTouch ? 'auto' : opts.scrolling)
                .appendTo( slide.$content );
            if ( opts.preload ) {
                slide.$content.addClass( 'fancybox-tmp' );
                self.showLoading( slide );
                // Unfortunately, it is not always possible to determine if iframe is successfully loaded
                // (due to browser security policy)
                $iframe.on('load.fb error.fb', function(e) {
                    this.isReady = 1;
                    slide.$slide.trigger( 'refresh' );
                    self.afterLoad( slide );
                });
                // Recalculate iframe content size
                $slide.on('refresh.fb', function() {
                    var $wrap = slide.$content,
                        $contents,
                        $body,
                        scrollWidth,
                        frameWidth,
                        frameHeight;
                    if ( $iframe[0].isReady !== 1 ) {
                        return;
                    }
                    // Check if content is accessible,
                    // it will fail if frame is not with the same origin
                    try {
                        $contents = $iframe.contents();
                        $body     = $contents.find('body');
                    } catch (ignore) {}
                    // Calculate dimensions for the wrapper
                    if ( $body && $body.length && !( opts.css.width !== undefined && opts.css.height !== undefined ) ) {
                        scrollWidth = $iframe[0].contentWindow.document.documentElement.scrollWidth;
                        frameWidth  = Math.ceil( $body.outerWidth(true) + ( $wrap.width() - scrollWidth ) );
                        frameHeight = Math.ceil( $body.outerHeight(true) );
                        // Resize wrapper to fit iframe content
                        $wrap.css({
                            'width'  : opts.css.width  === undefined ? frameWidth  + ( $wrap.outerWidth()  - $wrap.innerWidth() )  : opts.css.width,
                            'height' : opts.css.height === undefined ? frameHeight + ( $wrap.outerHeight() - $wrap.innerHeight() ) : opts.css.height
                        });
                    }
                    $wrap.removeClass( 'fancybox-tmp' );
                });
            } else {
                this.afterLoad( slide );
            }
            $iframe.attr( 'src', slide.src );
            if ( slide.opts.smallBtn ) {
                slide.$content.prepend( slide.opts.closeTpl );
            }
            // Remove iframe if closing or changing gallery item
            $slide.one('onReset', function () {
                // This helps IE not to throw errors when closing
                try {
                    $(this).find('iframe').hide().attr('src', '//about:blank');
                } catch (ignore) {}
                $(this).empty();
                slide.isLoaded = false;
            });
        },
        // Wrap and append content to the slide
        // ======================================
        setContent : function ( slide, content ) {
            var self = this;
            if ( self.isClosing ) {
                return;
            }
            self.hideLoading( slide );
            slide.$slide.empty();
            if ( isQuery( content ) && content.parent().length ) {
                // If it is a jQuery object, then it will be moved to the box.
                // The placeholder is created so we will know where to put it back.
                // If user is navigating gallery fast, then the content might be already moved to the box
                if ( content.data( 'placeholder' ) ) {
                    content.parents('.fancybox-slide').trigger( 'onReset' );
                }
                content.data({'placeholder' : $('<div></div>' ).hide().insertAfter( content ) }).css('display', 'inline-block');
            } else {
                if ( $.type( content ) === 'string' ) {
                    content = $('<div>').append( content ).contents();
                    if ( content[0].nodeType === 3 ) {
                        content = $('<div>').html( content );
                    }
                }
                if ( slide.opts.selector ) {
                    content = $('<div>').html( content ).find( slide.opts.selector );
                }
            }
            slide.$slide.one('onReset', function () {
                var placeholder = isQuery( content ) ? content.data('placeholder') : 0;
                if ( placeholder ) {
                    content.hide().replaceAll( placeholder );
                    content.data( 'placeholder', null );
                }
                if ( !slide.hasError ) {
                    $(this).empty();
                    slide.isLoaded = false;
                }
            });
            slide.$content = $( content ).appendTo( slide.$slide );
            if ( slide.opts.smallBtn === true ) {
                slide.$content.find( '.fancybox-close-small' ).remove().end().eq(0).append( slide.opts.closeTpl );
            }
            this.afterLoad( slide );
        },
        // Display error message
        // =====================
        setError : function ( slide ) {
            slide.hasError = true;
            this.setContent( slide, slide.opts.errorTpl );
        },
        showLoading : function( slide ) {
            var self = this;
            slide = slide || self.current;
            if ( slide && !slide.$spinner ) {
                slide.$spinner = $( self.opts.spinnerTpl ).appendTo( slide.$slide );
            }
        },
        hideLoading : function( slide ) {
            var self = this;
            slide = slide || self.current;
            if ( slide && slide.$spinner ) {
                slide.$spinner.remove();
                delete slide.$spinner;
            }
        },
        afterMove : function() {
            var self    = this;
            var current = self.current;
            var slides  = {};
            if ( !current ) {
                return;
            }
            current.$slide.siblings().trigger( 'onReset' );
            // Remove unnecessary slides
            $.each( self.slides, function( key, slide ) {
                if (  slide.pos >= self.currPos - 1 && slide.pos <= self.currPos + 1 ) {
                    slides[ slide.pos ] = slide;
                } else if ( slide ) {
                    slide.$slide.remove();
                }
            });
            self.slides = slides;
            self.trigger( 'afterMove' );
            if ( current.isLoaded ) {
                self.complete();
            }
        },
        // Adjustments after slide has been loaded
        // =======================================
        afterLoad : function( slide ) {
            var self = this;
            if ( self.isClosing ) {
                return;
            }
            slide.isLoading = false;
            slide.isLoaded  = true;
            self.trigger( 'afterLoad', slide );
            self.hideLoading( slide );
            // Resize content to fit inside slide
            // Skip if slide has an $ghost element, because then it has been already processed
            if ( !slide.$ghost ) {
                self.updateSlide( slide, true );
            }
            if ( slide.index === self.currIndex && slide.isMoved ) {
                self.complete();
            } else if ( !slide.$ghost ) {
                self.revealImage( slide );
            }
        },
        // Final adjustments after current gallery item is moved to position
        // and it`s content is loaded
        // ==================================================================
        complete : function() {
            var self = this;
            var current = self.current;
            self.revealImage( current, function() {
                current.isComplete = true;
                current.$slide.addClass('fancybox-slide--complete');
                self.updateCursor();
                self.trigger( 'onComplete' );
                // Try to focus on the first focusable element, skip for images and iframes
                if ( current.opts.focus && !( current.type === 'image' || current.type === 'iframe' ) ) {
                    self.focus();
                }
            });
        },
        // Preload next and previous slides
        // ================================
        preload : function() {
            var self = this;
            var next, prev;
            if ( self.group.length < 2 ) {
                return;
            }
            next  = self.slides[ self.currPos + 1 ];
            prev  = self.slides[ self.currPos - 1 ];
            if ( next && next.type === 'image' ) {
                self.loadSlide( next );
            }
            if ( prev && prev.type === 'image' ) {
                self.loadSlide( prev );
            }
        },
        // Try to find and focus on the first focusable element
        // ====================================================
        focus : function() {
            var current = this.current;
            var $el;
            $el = current && current.isComplete ? current.$slide.find('button,:input,[tabindex],a:not(".disabled")').filter(':visible:first') : null;
            if ( !$el || !$el.length ) {
                $el = this.$refs.container;
            }
            $el.focus();
            // Scroll position of wrapper element sometimes changes after focusing (IE)
            this.$refs.slider_wrap.scrollLeft(0);
            // And the same goes for slide element
            if ( current ) {
                current.$slide.scrollTop(0);
            }
        },
        // Activates current instance - brings container to the front and enables keyboard,
        // notifies other instances about deactivating
        // =================================================================================
        activate : function () {
            var self = this;
            // Deactivate all instances
            $( '.fancybox-container' ).each(function () {
                var instance = $(this).data( 'FancyBox' );
                // Skip self and closing instances
                if (instance && instance.uid !== self.uid && !instance.isClosing) {
                    instance.trigger( 'onDeactivate' );
                }
            });
            if ( self.current ) {
                if ( self.$refs.container.index() > 0 ) {
                    self.$refs.container.prependTo( document.body );
                }
                self.updateControls();
            }
            self.trigger( 'onActivate' );
            self.addEvents();
        },
        // Start closing procedure
        // This will start "zoom-out" animation if needed and clean everything up afterwards
        // =================================================================================
        close : function( e ) {
            var self     = this;
            var current  = self.current;
            var duration = current.opts.speed;
            var done = $.proxy(function() {
                self.cleanUp( e );  // Now "this" is again our instance
            }, this);
            if ( self.isAnimating || self.isClosing ) {
                return false;
            }
            // If beforeClose callback prevents closing, make sure content is centered
            if ( self.trigger( 'beforeClose', e ) === false ) {
                $.fancybox.stop( self.$refs.slider );
                requestAFrame(function() {
                    self.update( true, true, 150 );
                });
                return;
            }
            self.isClosing = true;
            if ( current.timouts ) {
                clearTimeout( current.timouts );
            }
            if ( e !== true) {
                $.fancybox.stop( self.$refs.slider );
            }
            self.$refs.container
                .removeClass('fancybox-container--active')
                .addClass('fancybox-container--closing');
            current.$slide
                .removeClass('fancybox-slide--complete')
                .siblings()
                .remove();
            if ( !current.isMoved ) {
                current.$slide.css('overflow', 'visible');
            }
            // Remove all events
            // If there are multiple instances, they will be set again by "activate" method
            self.removeEvents();
            // Clean up
            self.hideLoading( current );
            self.hideControls();
            self.updateCursor();
            self.$refs.bg.css('transition-duration', duration + 'ms');
            this.$refs.container.removeClass( 'fancybox-container--ready' );
            if ( e === true ) {
                setTimeout( done, duration );
            } else if ( !self.zoomInOut( 'Out', duration, done ) ) {
                $.fancybox.animate( self.$refs.container, null, { opacity : 0 }, duration, "easeInSine", done );
            }
        },
        // Final adjustments after removing the instance
        // =============================================
        cleanUp : function( e ) {
            var self = this,
                instance;
            self.$refs.slider.children().trigger( 'onReset' );
            self.$refs.container.empty().remove();
            self.trigger( 'afterClose', e );
            self.current = null;
            // Check if there are other instances
            instance = $.fancybox.getInstance();
            if ( instance ) {
                instance.activate();
            } else {
                $( 'html' ).removeClass( 'fancybox-enabled' );
                $( 'body' ).removeAttr( 'style' );
                $W.scrollTop( self.scrollTop ).scrollLeft( self.scrollLeft );
                $( '#fancybox-noscroll' ).remove();
            }
            // Place back focus
            if ( self.$lastFocus ) {
                self.$lastFocus.focus();
            }
        },
        // Call callback and trigger an event
        // ==================================
        trigger : function( name, slide ) {
            var args  = Array.prototype.slice.call(arguments, 1),
                self  = this,
                obj   = slide && slide.opts ? slide : self.current,
                rez;
            if ( obj ) {
                args.unshift( obj );
            } else {
                obj = self;
            }
            args.unshift( self );
            if ( $.isFunction( obj.opts[ name ] ) ) {
                rez = obj.opts[ name ].apply( obj, args );
            }
            if ( rez === false ) {
                return rez;
            }
            if ( name === 'afterClose' ) {
                $( document ).trigger( name + '.fb', args );
            } else {
                self.$refs.container.trigger( name + '.fb', args );
            }
        },
        // Toggle toolbar and caption
        // ==========================
        toggleControls : function( force ) {
            if ( this.isHiddenControls ) {
                this.updateControls( force );
            } else {
                this.hideControls();
            }
        },
        // Hide toolbar and caption
        // ========================
        hideControls : function () {
            this.isHiddenControls = true;
            this.$refs.container.removeClass('fancybox-show-controls');
            this.$refs.container.removeClass('fancybox-show-caption');
        },
        // Update infobar values, navigation button states and reveal caption
        // ==================================================================
        updateControls : function ( force ) {
            var self = this;
            var $container = self.$refs.container;
            var $caption   = self.$refs.caption;
            // Toggle infobar and buttons
            var current  = self.current;
            var index    = current.index;
            var opts     = current.opts;
            var caption  = opts.caption;
            if ( this.isHiddenControls && force !== true ) {
                return;
            }
            this.isHiddenControls = false;
            $container
                .addClass('fancybox-show-controls')
                .toggleClass('fancybox-show-infobar', !!opts.infobar && self.group.length > 1)
                .toggleClass('fancybox-show-buttons', !!opts.buttons )
                .toggleClass('fancybox-is-modal',     !!opts.modal );
            $('.fancybox-button--left',  $container).toggleClass( 'fancybox-button--disabled', (!opts.loop && index <= 0 ) );
            $('.fancybox-button--right', $container).toggleClass( 'fancybox-button--disabled', (!opts.loop && index >= self.group.length - 1) );
            $('.fancybox-button--play',  $container).toggle( !!( opts.slideShow && self.group.length > 1) );
            $('.fancybox-button--close', $container).toggle( !!opts.closeBtn );
            // Update infobar values
            $('.js-fancybox-count', $container).html( self.group.length );
            $('.js-fancybox-index', $container).html( index + 1 );
            // Recalculate content dimensions
            current.$slide.trigger( 'refresh' );
            // Reveal or create new caption
            if ( $caption ) {
                $caption.empty();
            }
            if ( caption && caption.length ) {
                $caption.html( caption );
                this.$refs.container.addClass( 'fancybox-show-caption ');
                self.$caption = $caption;
            } else {
                this.$refs.container.removeClass( 'fancybox-show-caption' );
            }
        }
    });
    $.fancybox = {
        version  : "3.0.47",
        defaults : defaults,
        // Get current instance and execute a command.
        //
        // Examples of usage:
        //
        //   $instance = $.fancybox.getInstance();
        //   $.fancybox.getInstance().jumpTo( 1 );
        //   $.fancybox.getInstance( 'jumpTo', 1 );
        //   $.fancybox.getInstance( function() {
        //       console.info( this.currIndex );
        //   });
        // ======================================================
        getInstance : function ( command ) {
            var instance = $('.fancybox-container:not(".fancybox-container--closing"):first').data( 'FancyBox' );
            var args     = Array.prototype.slice.call(arguments, 1);
            if ( instance instanceof FancyBox ) {
                if ( $.type( command ) === 'string' ) {
                    instance[ command ].apply( instance, args );
                } else if ( $.type( command ) === 'function' ) {
                    command.apply( instance, args );
                }
                return instance;
            }
            return false;
        },
        // Create new instance
        // ===================
        open : function ( items, opts, index ) {
            pageScroll.hide(0);
            return new FancyBox( items, opts, index );
        },
        // Close current or all instances
        // ==============================
        close : function ( all ) {
            pageScroll.show(0);
            var instance = this.getInstance();
            if ( instance ) {
                instance.close();
                // Try to find and close next instance
                if ( all === true ) {
                    this.close();
                }
            }
        },
        // Test for the existence of touch events in the browser
        // Limit to mobile devices
        // ====================================================
        isTouch : document.createTouch !== undefined && /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent),
        // Detect if 'translate3d' support is available
        // ============================================
        use3d : (function() {
            var div = document.createElement('div');
            return window.getComputedStyle( div ).getPropertyValue('transform') && !(document.documentMode && document.documentMode <= 11);
        }()),
        // Helper function to get current visual state of an element
        // returns array[ top, left, horizontal-scale, vertical-scale, opacity ]
        // =====================================================================
        getTranslate : function( $el ) {
            var position, matrix;
            if ( !$el || !$el.length ) {
                return false;
            }
            position = $el.get( 0 ).getBoundingClientRect();
            matrix   = $el.eq( 0 ).css('transform');
            if ( matrix && matrix.indexOf( 'matrix' ) !== -1 ) {
                matrix = matrix.split('(')[1];
                matrix = matrix.split(')')[0];
                matrix = matrix.split(',');
            } else {
                matrix = [];
            }
            if ( matrix.length ) {
                // If IE
                if ( matrix.length > 10 ) {
                    matrix = [ matrix[13], matrix[12], matrix[0], matrix[5] ];
                } else {
                    matrix = [ matrix[5], matrix[4], matrix[0], matrix[3]];
                }
                matrix = matrix.map(parseFloat);
            } else {
                matrix = [ 0, 0, 1, 1 ];
            }
            return {
                top     : matrix[ 0 ],
                left    : matrix[ 1 ],
                scaleX  : matrix[ 2 ],
                scaleY  : matrix[ 3 ],
                opacity : parseFloat( $el.css('opacity') ),
                width   : position.width,
                height  : position.height
            };
        },
        // Shortcut for setting "translate3d" properties for element
        // Can set be used to set opacity, too
        // ========================================================
        setTranslate : function( $el, props ) {
            var str  = '';
            var css  = {};
            if ( !$el || !props ) {
                return;
            }
            if ( props.left !== undefined || props.top !== undefined ) {
                str = ( props.left === undefined ? $el.position().top : props.left )  + 'px, ' + ( props.top === undefined ? $el.position().top : props.top ) + 'px';
                if ( this.use3d ) {
                    str = 'translate3d(' + str + ', 0px)';
                } else {
                    str = 'translate(' + str + ')';
                }
            }
            if ( props.scaleX !== undefined && props.scaleY !== undefined ) {
                str = (str.length ? str + ' ' : '') + 'scale(' + props.scaleX + ', ' + props.scaleY + ')';
            }
            if ( str.length ) {
                css.transform = str;
            }
            if ( props.opacity !== undefined ) {
                css.opacity = props.opacity;
            }
            if ( props.width !== undefined ) {
                css.width = props.width;
            }
            if ( props.height !== undefined ) {
                css.height = props.height;
            }
            return $el.css( css );
        },
        // Common easings for entrances and exits
        // t: current time, b: begInnIng value, c: change In value, d: duration
        // ====================================================================
        easing : {
            easeOutCubic : function (t, b, c, d) {
                return c * ((t=t/d-1)*t*t + 1) + b;
            },
            easeInCubic : function (t, b, c, d) {
                return c * (t/=d)*t*t + b;
            },
            easeOutSine : function (t, b, c, d) {
                return c * Math.sin(t/d * (Math.PI/2)) + b;
            },
            easeInSine : function (t, b, c, d) {
                return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
            }
        },
        // Stop fancyBox animation
        // =======================
        stop : function( $el ) {
            $el.removeData( 'animateID' );
        },
        // Animate element using "translate3d"
        // Usage:
        // animate( element, start properties, end properties, duration, easing, callback )
        // or
        // animate( element, start properties, end properties, duration, callback )
        // =================================================================================
        animate : function( $el, from, to, duration, easing, done ) {
            var self = this;
            var lastTime = null;
            var animTime = 0;
            var curr;
            var diff;
            var id;
            var finish = function() {
                if ( to.scaleX !== undefined && to.scaleY !== undefined && from && from.width !== undefined && from.height !== undefined ) {
                    to.width  = from.width  * to.scaleX;
                    to.height = from.height * to.scaleY;
                    to.scaleX = 1;
                    to.scaleY = 1;
                }
                self.setTranslate( $el, to );
                done();
            };
            var frame = function ( timestamp ) {
                curr = [];
                diff = 0;
                // If "stop" method has been called on this element, then just stop
                if ( !$el.length || $el.data( 'animateID' ) !== id ) {
                    return;
                }
                timestamp = timestamp || Date.now();
                if ( lastTime ) {
                    diff = timestamp - lastTime;
                }
                lastTime = timestamp;
                animTime += diff;
                // Are we done?
                if ( animTime >= duration ) {
                    finish();
                    return;
                }
                for ( var prop in to ) {
                    if ( to.hasOwnProperty( prop ) && from[ prop ] !== undefined ) {
                        if ( from[ prop ] == to[ prop ] ) {
                            curr[ prop ] = to[ prop ];
                        } else {
                            curr[ prop ] = self.easing[ easing ]( animTime, from[ prop ], to[ prop ] - from[ prop ], duration );
                        }
                    }
                }
                self.setTranslate( $el, curr );
                requestAFrame( frame );
            };
            self.animateID = id = self.animateID === undefined ? 1 : self.animateID + 1;
            $el.data( 'animateID', id );
            if ( done === undefined && $.type(easing) == 'function' ) {
                done   = easing;
                easing = undefined;
            }
            if ( !easing ) {
                easing = "easeOutCubic";
            }
            done = done || $.noop;
            if ( from ) {
                this.setTranslate( $el, from );
            } else {
                // We need current values to calculate change in time
                from = this.getTranslate( $el );
            }
            if ( duration ) {
                $el.show();
                requestAFrame( frame );
            } else {
                finish();
            }
        }
    };
    // Event handler for click event to "fancyboxed" links
    // ===================================================
    function _run( e ) {
        var target  = e.currentTarget,
            opts    = e.data ? e.data.options : {},
            items   = e.data ? e.data.items : [],
            value   = '',
            index   = 0;
        e.preventDefault();
        e.stopPropagation();
        // Get all related items and find index for clicked one
        if ( $(target).attr( 'data-fancybox' ) ) {
            value = $(target).data( 'fancybox' );
        }
        if ( value ) {
            items = items.length ? items.filter( '[data-fancybox="' + value + '"]' ) : $( '[data-fancybox=' + value + ']' );
            index = items.index( target );
        } else {
            items = [ target ];
        }
        $.fancybox.open( items, opts, index );
    }
    // Create a jQuery plugin
    // ======================
    $.fn.fancybox = function (options) {
        this.off('click.fb-start').on('click.fb-start', {
            items   : this,
            options : options || {}
        }, _run);
        return this;
    };
    // Self initializing plugin
    // ========================
    $(document).on('click.fb-start', '[data-fancybox]', _run);
}(window, document, window.jQuery));
// ==========================================================================
//
// Media
// Adds additional media type support
//
// ==========================================================================
;(function ($) {
    'use strict';
    // Formats matching url to final form
    var format = function (url, rez, params) {
        if ( !url ) {
            return;
        }
        params = params || '';
        if ( $.type(params) === "object" ) {
            params = $.param(params, true);
        }
        $.each(rez, function (key, value) {
            url = url.replace('$' + key, value || '');
        });
        if (params.length) {
            url += (url.indexOf('?') > 0 ? '&' : '?') + params;
        }
        return url;
    };
    // Object containing properties for each media type
    var media = {
        youtube: {
            matcher: /(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,
            params: {
                autoplay: 1,
                autohide: 1,
                fs: 1,
                rel: 0,
                hd: 1,
                wmode: 'transparent',
                enablejsapi: 1,
                html5: 1
            },
            paramPlace : 8,
            type: 'iframe',
            url: '//www.youtube.com/embed/$4',
            thumb: '//img.youtube.com/vi/$4/hqdefault.jpg'
        },
        vimeo: {
            matcher: /^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,
            params: {
                autoplay: 1,
                hd: 1,
                show_title: 1,
                show_byline: 1,
                show_portrait: 0,
                fullscreen: 1,
                api: 1
            },
            paramPlace : 3,
            type: 'iframe',
            url: '//player.vimeo.com/video/$2'
        },
        metacafe: {
            matcher: /metacafe.com\/watch\/(\d+)\/(.*)?/,
            type: 'iframe',
            url: '//www.metacafe.com/embed/$1/?ap=1'
        },
        dailymotion: {
            matcher: /dailymotion.com\/video\/(.*)\/?(.*)/,
            params: {
                additionalInfos: 0,
                autoStart: 1
            },
            type: 'iframe',
            url: '//www.dailymotion.com/embed/video/$1'
        },
        vine: {
            matcher: /vine.co\/v\/([a-zA-Z0-9\?\=\-]+)/,
            type: 'iframe',
            url: '//vine.co/v/$1/embed/simple'
        },
        instagram: {
            matcher: /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,
            type: 'image',
            url: '//$1/p/$2/media/?size=l'
        },
        // Examples:
        // http://maps.google.com/?ll=48.857995,2.294297&spn=0.007666,0.021136&t=m&z=16
        // http://maps.google.com/?ll=48.857995,2.294297&spn=0.007666,0.021136&t=m&z=16
        // https://www.google.lv/maps/place/Googleplex/@37.4220041,-122.0833494,17z/data=!4m5!3m4!1s0x0:0x6c296c66619367e0!8m2!3d37.4219998!4d-122.0840572
        google_maps: {
            matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,
            type: 'iframe',
            url: function (rez) {
                return '//maps.google.' + rez[2] + '/?ll=' + ( rez[9] ? rez[9] + '&z=' + Math.floor(  rez[10]  ) + ( rez[12] ? rez[12].replace(/^\//, "&") : '' )  : rez[12] ) + '&output=' + ( rez[12] && rez[12].indexOf('layer=c') > 0 ? 'svembed' : 'embed' );
            }
        }
    };
    $(document).on('onInit.fb', function (e, instance) {
        $.each(instance.group, function( i, item ) {
            var url  = item.src || '',
                type = false,
                thumb,
                rez,
                params,
                urlParams,
                o,
                provider;
            // Skip items that already have content type
            if ( item.type ) {
                return;
            }
            // Look for any matching media type
            $.each(media, function ( n, el ) {
                rez = url.match(el.matcher);
                o   = {};
                provider = n;
                if (!rez) {
                    return;
                }
                type = el.type;
                if ( el.paramPlace && rez[ el.paramPlace ] ) {
                    urlParams = rez[ el.paramPlace ];
                    if ( urlParams[ 0 ] == '?' ) {
                        urlParams = urlParams.substring(1);
                    }
                    urlParams = urlParams.split('&');
                    for ( var m = 0; m < urlParams.length; ++m ) {
                        var p = urlParams[ m ].split('=', 2);
                        if ( p.length == 2 ) {
                            o[ p[0] ] = decodeURIComponent( p[1].replace(/\+/g, " ") );
                        }
                    }
                }
                params = $.extend( true, {}, el.params, item.opts[ n ], o );
                url   = $.type(el.url) === "function" ? el.url.call(this, rez, params, item) : format(el.url, rez, params);
                thumb = $.type(el.thumb) === "function" ? el.thumb.call(this, rez, params, item) : format(el.thumb, rez);
                if ( provider === 'vimeo' ) {
                    url = url.replace('&%23', '#');
                }
                return false;
            });
            // If it is found, then change content type and update the url
            if ( type ) {
                item.src  = url;
                item.type = type;
                if ( !item.opts.thumb && !(item.opts.$thumb && item.opts.$thumb.length ) ) {
                    item.opts.thumb = thumb;
                }
                if ( type === 'iframe' ) {
                    $.extend(true, item.opts, {
                        iframe : {
                            preload   : false,
                            scrolling : "no"
                        },
                        smallBtn   : false,
                        closeBtn   : true,
                        fullScreen : false,
                        slideShow  : false
                    });
                    item.opts.slideClass += ' fancybox-slide--video';
                }
            } else {
                // If no content type is found, then set it to `iframe` as fallback
                item.type = 'iframe';
            }
        });
    });
}(window.jQuery));
// ==========================================================================
//
// Guestures
// Adds touch guestures, handles click and tap events
//
// ==========================================================================
;(function (window, document, $) {
    'use strict';
    var requestAFrame = (function() {
        return  window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function( callback ) {
                    window.setTimeout(callback, 1000 / 60); };
                })();
    var pointers = function( e ) {
        var result = [];
        e = e.originalEvent || e || window.e;
        e = e.touches && e.touches.length ? e.touches : ( e.changedTouches && e.changedTouches.length ? e.changedTouches : [ e ] );
        for ( var key in e ) {
            if ( e[ key ].pageX ) {
                result.push( { x : e[ key ].pageX, y : e[ key ].pageY } );
            } else if ( e[ key ].clientX ) {
                result.push( { x : e[ key ].clientX, y : e[ key ].clientY } );
            }
        }
        return result;
    };
    var distance = function( point2, point1, what ) {
        if ( !point1 || !point2 ) {
            return 0;
        }
        if ( what === 'x' ) {
            return point2.x - point1.x;
        } else if ( what === 'y' ) {
            return point2.y - point1.y;
        }
        return Math.sqrt( Math.pow( point2.x - point1.x, 2 ) + Math.pow( point2.y - point1.y, 2 ) );
    };
    var isClickable = function( $el ) {
        return $el.is('a') || $el.is('button') || $el.is('input') || $el.is('select') || $el.is('textarea') || $.isFunction( $el.get(0).onclick );
    };
    var hasScrollbars = function( el ) {
        var overflowY = window.getComputedStyle( el )['overflow-y'];
        var overflowX = window.getComputedStyle( el )['overflow-x'];
        var vertical   = (overflowY === 'scroll' || overflowY === 'auto') && el.scrollHeight > el.clientHeight;
        var horizontal = (overflowX === 'scroll' || overflowX === 'auto') && el.scrollWidth > el.clientWidth;
        return vertical || horizontal;
    };
    var isScrollable = function ( $el ) {
        var rez = false;
        while ( true ) {
            rez = hasScrollbars( $el.get(0) );
            if ( rez ) {
                break;
            }
            $el = $el.parent();
            if ( !$el.length || $el.hasClass('fancybox-slider') || $el.is('body') ) {
                break;
            }
        }
        return rez;
    };
    var Guestures = function ( instance ) {
        var self = this;
        self.instance = instance;
        self.$wrap       = instance.$refs.slider_wrap;
        self.$slider     = instance.$refs.slider;
        self.$container  = instance.$refs.container;
        self.destroy();
        self.$wrap.on('touchstart.fb mousedown.fb', $.proxy(self, "ontouchstart"));
    };
    Guestures.prototype.destroy = function() {
        this.$wrap.off('touchstart.fb mousedown.fb touchmove.fb mousemove.fb touchend.fb touchcancel.fb mouseup.fb mouseleave.fb');
    };
    Guestures.prototype.ontouchstart = function( e ) {
        var self = this;
        var $target  = $( e.target );
        var instance = self.instance;
        var current  = instance.current;
        var $content = current.$content || current.$placeholder;
        self.startPoints = pointers( e );
        self.$target  = $target;
        self.$content = $content;
        self.canvasWidth  = Math.round( current.$slide[0].clientWidth );
        self.canvasHeight = Math.round( current.$slide[0].clientHeight );
        self.startEvent = e;
        // Skip if clicked on the scrollbar
        if ( e.originalEvent.clientX > self.canvasWidth + current.$slide.offset().left ) {
            return true;
        }
        // Ignore taping on links, buttons and scrollable items
        if ( isClickable( $target ) || isClickable( $target.parent() ) || ( isScrollable( $target ) ) ) {
            return;
        }
        // If "touch" is disabled, then handle click event
        if ( !current.opts.touch ) {
            self.endPoints = self.startPoints;
            return self.ontap();
        }
        // Ignore right click
        if ( e.originalEvent && e.originalEvent.button == 2 ) {
            return;
        }
        e.stopPropagation();
        e.preventDefault();
        if ( !current || self.instance.isAnimating || self.instance.isClosing ) {
            return;
        }
        // Prevent zooming if already swiping
        if ( !self.startPoints || ( self.startPoints.length > 1 && !current.isMoved ) ) {
            return;
        }
        self.$wrap.off('touchmove.fb mousemove.fb',  $.proxy(self, "ontouchmove"));
        self.$wrap.off('touchend.fb touchcancel.fb mouseup.fb mouseleave.fb',  $.proxy(self, "ontouchend"));
        self.$wrap.on('touchend.fb touchcancel.fb mouseup.fb mouseleave.fb',  $.proxy(self, "ontouchend"));
        self.$wrap.on('touchmove.fb mousemove.fb',  $.proxy(self, "ontouchmove"));
        self.startTime = new Date().getTime();
        self.distanceX = self.distanceY = self.distance = 0;
        self.canTap    = false;
        self.isPanning = false;
        self.isSwiping = false;
        self.isZooming = false;
        self.sliderStartPos = $.fancybox.getTranslate( self.$slider );
        self.contentStartPos = $.fancybox.getTranslate( self.$content );
        self.contentLastPos  = null;
        if ( self.startPoints.length === 1 && !self.isZooming ) {
            self.canTap = current.isMoved;
            if ( current.type === 'image' && ( self.contentStartPos.width > self.canvasWidth + 1 || self.contentStartPos.height > self.canvasHeight + 1 ) ) {
                $.fancybox.stop( self.$content );
                self.isPanning = true;
            } else {
                $.fancybox.stop( self.$slider );
                self.isSwiping = true;
            }
            self.$container.addClass('fancybox-controls--isGrabbing');
        }
        if ( self.startPoints.length === 2 && current.isMoved  && !current.hasError && current.type === 'image' && ( current.isLoaded || current.$ghost ) ) {
            self.isZooming = true;
            self.isSwiping = false;
            self.isPanning = false;
            $.fancybox.stop( self.$content );
            self.centerPointStartX = ( ( self.startPoints[0].x + self.startPoints[1].x ) * 0.5 ) - $(window).scrollLeft();
            self.centerPointStartY = ( ( self.startPoints[0].y + self.startPoints[1].y ) * 0.5 ) - $(window).scrollTop();
            self.percentageOfImageAtPinchPointX = ( self.centerPointStartX - self.contentStartPos.left ) / self.contentStartPos.width;
            self.percentageOfImageAtPinchPointY = ( self.centerPointStartY - self.contentStartPos.top  ) / self.contentStartPos.height;
            self.startDistanceBetweenFingers = distance( self.startPoints[0], self.startPoints[1] );
        }
    };
    Guestures.prototype.ontouchmove = function( e ) {
        var self = this;
        e.preventDefault();
        self.newPoints = pointers( e );
        if ( !self.newPoints || !self.newPoints.length ) {
            return;
        }
        self.distanceX = distance( self.newPoints[0], self.startPoints[0], 'x' );
        self.distanceY = distance( self.newPoints[0], self.startPoints[0], 'y' );
        self.distance = distance( self.newPoints[0], self.startPoints[0] );
        // Skip false ontouchmove events (Chrome)
        if ( self.distance > 0 ) {
            if ( self.isSwiping ) {
                self.onSwipe();
            } else if ( self.isPanning ) {
                self.onPan();
            } else if ( self.isZooming ) {
                self.onZoom();
            }
        }
    };
    Guestures.prototype.onSwipe = function() {
        var self = this;
        var swiping = self.isSwiping;
        var left    = self.sliderStartPos.left;
        var angle;
        if ( swiping === true ) {
            if ( Math.abs( self.distance ) > 10 )  {
                if ( self.instance.group.length < 2 ) {
                    self.isSwiping  = 'y';
                } else if ( !self.instance.current.isMoved || self.instance.opts.touch.vertical === false || ( self.instance.opts.touch.vertical === 'auto' && $( window ).width() > 800 ) ) {
                    self.isSwiping  = 'x';
                } else {
                    angle = Math.abs( Math.atan2( self.distanceY, self.distanceX ) * 180 / Math.PI );
                    self.isSwiping = ( angle > 45 && angle < 135 ) ? 'y' : 'x';
                }
                self.canTap  = false;
                self.instance.current.isMoved = false;
                // Reset points to avoid jumping, because we dropped first swipes to calculate the angle
                self.startPoints = self.newPoints;
            }
        } else {
            if ( swiping == 'x' ) {
                // Sticky edges
                if ( !self.instance.current.opts.loop && self.instance.current.index === 0  && self.distanceX > 0 ) {
                    left = left + Math.pow( self.distanceX, 0.8 );
                } else if ( !self.instance.current.opts.loop &&self.instance.current.index === self.instance.group.length - 1 && self.distanceX < 0 ) {
                    left = left - Math.pow( -self.distanceX, 0.8 );
                } else {
                    left = left + self.distanceX;
                }
            }
            self.sliderLastPos = {
                top  : swiping == 'x' ? 0 : self.sliderStartPos.top + self.distanceY,
                left : left
            };
            requestAFrame(function() {
                $.fancybox.setTranslate( self.$slider, self.sliderLastPos );
            });
        }
    };
    Guestures.prototype.onPan = function() {
        var self = this;
        var newOffsetX, newOffsetY, newPos;
        self.canTap = false;
        if ( self.contentStartPos.width > self.canvasWidth ) {
            newOffsetX = self.contentStartPos.left + self.distanceX;
        } else {
            newOffsetX = self.contentStartPos.left;
        }
        newOffsetY = self.contentStartPos.top + self.distanceY;
        newPos = self.limitMovement( newOffsetX, newOffsetY, self.contentStartPos.width, self.contentStartPos.height );
        newPos.scaleX = self.contentStartPos.scaleX;
        newPos.scaleY = self.contentStartPos.scaleY;
        self.contentLastPos = newPos;
        requestAFrame(function() {
            $.fancybox.setTranslate( self.$content, self.contentLastPos );
        });
    };
    // Make panning sticky to the edges
    Guestures.prototype.limitMovement = function( newOffsetX, newOffsetY, newWidth, newHeight ) {
        var self = this;
        var minTranslateX, minTranslateY, maxTranslateX, maxTranslateY;
        var canvasWidth  = self.canvasWidth;
        var canvasHeight = self.canvasHeight;
        var currentOffsetX = self.contentStartPos.left;
        var currentOffsetY = self.contentStartPos.top;
        var distanceX = self.distanceX;
        var distanceY = self.distanceY;
        // Slow down proportionally to traveled distance
        minTranslateX = Math.max(0, canvasWidth  * 0.5 - newWidth  * 0.5 );
        minTranslateY = Math.max(0, canvasHeight * 0.5 - newHeight * 0.5 );
        maxTranslateX = Math.min( canvasWidth  - newWidth,  canvasWidth  * 0.5 - newWidth  * 0.5 );
        maxTranslateY = Math.min( canvasHeight - newHeight, canvasHeight * 0.5 - newHeight * 0.5 );
        if ( newWidth > canvasWidth ) {
            //   ->
            if ( distanceX > 0 && newOffsetX > minTranslateX ) {
                newOffsetX = minTranslateX - 1 + Math.pow( -minTranslateX + currentOffsetX + distanceX, 0.8 ) || 0;
            }
            //    <-
            if ( distanceX  < 0 && newOffsetX < maxTranslateX ) {
                newOffsetX = maxTranslateX + 1 - Math.pow( maxTranslateX - currentOffsetX - distanceX, 0.8 ) || 0;
            }
        }
        if ( newHeight > canvasHeight ) {
            //   \/
            if ( distanceY > 0 && newOffsetY > minTranslateY ) {
                newOffsetY = minTranslateY - 1 + Math.pow(-minTranslateY + currentOffsetY + distanceY, 0.8 ) || 0;
            }
            //   /\
            if ( distanceY < 0 && newOffsetY < maxTranslateY ) {
                newOffsetY = maxTranslateY + 1 - Math.pow ( maxTranslateY - currentOffsetY - distanceY, 0.8 ) || 0;
            }
        }
        return {
            top  : newOffsetY,
            left : newOffsetX
        };
    };
    Guestures.prototype.limitPosition = function( newOffsetX, newOffsetY, newWidth, newHeight ) {
        var self = this;
        var canvasWidth  = self.canvasWidth;
        var canvasHeight = self.canvasHeight;
        if ( newWidth > canvasWidth ) {
            newOffsetX = newOffsetX > 0 ? 0 : newOffsetX;
            newOffsetX = newOffsetX < canvasWidth - newWidth ? canvasWidth - newWidth : newOffsetX;
        } else {
            // Center horizontally
            newOffsetX = Math.max( 0, canvasWidth / 2 - newWidth / 2 );
        }
        if ( newHeight > canvasHeight ) {
            newOffsetY = newOffsetY > 0 ? 0 : newOffsetY;
            newOffsetY = newOffsetY < canvasHeight - newHeight ? canvasHeight - newHeight : newOffsetY;
        } else {
            // Center vertically
            newOffsetY = Math.max( 0, canvasHeight / 2 - newHeight / 2 );
        }
        return {
            top  : newOffsetY,
            left : newOffsetX
        };
    };
    Guestures.prototype.onZoom = function() {
        var self = this;
        // Calculate current distance between points to get pinch ratio and new width and height
        var currentWidth  = self.contentStartPos.width;
        var currentHeight = self.contentStartPos.height;
        var currentOffsetX = self.contentStartPos.left;
        var currentOffsetY = self.contentStartPos.top;
        var endDistanceBetweenFingers = distance( self.newPoints[0], self.newPoints[1] );
        var pinchRatio = endDistanceBetweenFingers / self.startDistanceBetweenFingers;
        var newWidth  = Math.floor( currentWidth  * pinchRatio );
        var newHeight = Math.floor( currentHeight * pinchRatio );
        // This is the translation due to pinch-zooming
        var translateFromZoomingX = (currentWidth  - newWidth)  * self.percentageOfImageAtPinchPointX;
        var translateFromZoomingY = (currentHeight - newHeight) * self.percentageOfImageAtPinchPointY;
        //Point between the two touches
        var centerPointEndX = ((self.newPoints[0].x + self.newPoints[1].x) / 2) - $(window).scrollLeft();
        var centerPointEndY = ((self.newPoints[0].y + self.newPoints[1].y) / 2) - $(window).scrollTop();
        // And this is the translation due to translation of the centerpoint
        // between the two fingers
        var translateFromTranslatingX = centerPointEndX - self.centerPointStartX;
        var translateFromTranslatingY = centerPointEndY - self.centerPointStartY;
        // The new offset is the old/current one plus the total translation
        var newOffsetX = currentOffsetX + ( translateFromZoomingX + translateFromTranslatingX );
        var newOffsetY = currentOffsetY + ( translateFromZoomingY + translateFromTranslatingY );
        var newPos = {
            top    : newOffsetY,
            left   : newOffsetX,
            scaleX : self.contentStartPos.scaleX * pinchRatio,
            scaleY : self.contentStartPos.scaleY * pinchRatio
        };
        self.canTap = false;
        self.newWidth  = newWidth;
        self.newHeight = newHeight;
        self.contentLastPos = newPos;
        requestAFrame(function() {
            $.fancybox.setTranslate( self.$content, self.contentLastPos );
        });
    };
    Guestures.prototype.ontouchend = function( e ) {
        var self = this;
        var current = self.instance.current;
        var dMs = Math.max( (new Date().getTime() ) - self.startTime, 1);
        var swiping = self.isSwiping;
        var panning = self.isPanning;
        var zooming = self.isZooming;
        self.endPoints = pointers( e );
        self.$container.removeClass('fancybox-controls--isGrabbing');
        self.$wrap.off('touchmove.fb mousemove.fb',  $.proxy(this, "ontouchmove"));
        self.$wrap.off('touchend.fb touchcancel.fb mouseup.fb mouseleave.fb',  $.proxy(this, "ontouchend"));
        self.isSwiping = false;
        self.isPanning = false;
        self.isZooming = false;
        if ( self.canTap )  {
            return self.ontap();
        }
        // Speed in px/ms
        self.velocityX = self.distanceX / dMs * 0.5;
        self.velocityY = self.distanceY / dMs * 0.5;
        self.speed = current.opts.speed || 330;
        self.speedX = Math.max( self.speed * 0.75, Math.min( self.speed * 1.5, ( 1 / Math.abs( self.velocityX ) ) * self.speed ) );
        self.speedY = Math.max( self.speed * 0.75, Math.min( self.speed * 1.5, ( 1 / Math.abs( self.velocityY ) ) * self.speed ) );
        if ( panning ) {
            self.endPanning();
        } else if ( zooming ) {
            self.endZooming();
        } else {
            self.endSwiping( swiping );
        }
        return;
    };
    Guestures.prototype.endSwiping = function( swiping ) {
        var self = this;
        // Close if swiped vertically / navigate if horizontally
        if ( swiping == 'y' && Math.abs( self.distanceY ) > 50 ) {
            // Continue vertical movement
            $.fancybox.animate( self.$slider, null, {
                top     : self.sliderStartPos.top + self.distanceY + self.velocityY * 150,
                left    : self.sliderStartPos.left,
                opacity : 0
            }, self.speedY );
            self.instance.close( true );
        } else if ( swiping == 'x' && self.distanceX > 50 ) {
            self.instance.previous( self.speedX );
        } else if ( swiping == 'x' && self.distanceX < -50 ) {
            self.instance.next( self.speedX );
        } else {
            // Move back to center
            self.instance.update( false, true, 150 );
        }
    };
    Guestures.prototype.endPanning = function() {
        var self = this;
        var newOffsetX, newOffsetY, newPos;
        if ( !self.contentLastPos ) {
            return;
        }
        newOffsetX = self.contentLastPos.left + ( self.velocityX * self.speed * 2 );
        newOffsetY = self.contentLastPos.top  + ( self.velocityY * self.speed * 2 );
        newPos = self.limitPosition( newOffsetX, newOffsetY, self.contentStartPos.width, self.contentStartPos.height );
         newPos.width  = self.contentStartPos.width;
         newPos.height = self.contentStartPos.height;
        $.fancybox.animate( self.$content, null, newPos, self.speed, "easeOutSine" );
    };
    Guestures.prototype.endZooming = function() {
        var self = this;
        var current = self.instance.current;
        var newOffsetX, newOffsetY, newPos, reset;
        var newWidth  = self.newWidth;
        var newHeight = self.newHeight;
        if ( !self.contentLastPos ) {
            return;
        }
        newOffsetX = self.contentLastPos.left;
        newOffsetY = self.contentLastPos.top;
        reset = {
            top    : newOffsetY,
            left   : newOffsetX,
            width  : newWidth,
            height : newHeight,
            scaleX : 1,
            scaleY : 1
       };
       // Reset scalex/scaleY values; this helps for perfomance and does not break animation
       $.fancybox.setTranslate( self.$content, reset );
        if ( newWidth < self.canvasWidth && newHeight < self.canvasHeight ) {
            self.instance.scaleToFit( 150 );
        } else if ( newWidth > current.width || newHeight > current.height ) {
            self.instance.scaleToActual( self.centerPointStartX, self.centerPointStartY, 150 );
        } else {
            newPos = self.limitPosition( newOffsetX, newOffsetY, newWidth, newHeight );
            $.fancybox.animate( self.$content, null, newPos, self.speed, "easeOutSine" );
        }
    };
    Guestures.prototype.ontap = function() {
        var self = this;
        var instance = self.instance;
        var current  = instance.current;
        var x = self.endPoints[0].x;
        var y = self.endPoints[0].y;
        x = x - self.$wrap.offset().left;
        y = y - self.$wrap.offset().top;
        // Stop slideshow
        if ( instance.SlideShow && instance.SlideShow.isActive ) {
            instance.SlideShow.stop();
        }
        if ( !$.fancybox.isTouch ) {
            if ( current.opts.closeClickOutside && self.$target.is('.fancybox-slide') ) {
                instance.close( self.startEvent );
                return;
            }
            if ( current.type == 'image' && current.isMoved ) {
                if ( instance.canPan() ) {
                    instance.scaleToFit();
                } else if ( instance.isScaledDown() ) {
                    instance.scaleToActual( x, y );
                } else if ( instance.group.length < 2 ) {
                    instance.close( self.startEvent );
                }
            }
            return;
        }
        // Double tap
        if ( self.tapped ) {
            clearTimeout( self.tapped );
            self.tapped = null;
            if ( Math.abs( x - self.x ) > 50 || Math.abs( y - self.y ) > 50 || !current.isMoved ) {
                return this;
            }
            if ( current.type == 'image' && ( current.isLoaded || current.$ghost ) ) {
                if ( instance.canPan() ) {
                    instance.scaleToFit();
                } else if ( instance.isScaledDown() ) {
                    instance.scaleToActual( x, y );
                }
            }
        } else {
            // Single tap
            self.x = x;
            self.y = y;
            self.tapped = setTimeout(function() {
                self.tapped = null;
                instance.toggleControls( true );
            }, 300);
        }
        return this;
    };
    $(document).on('onActivate.fb', function (e, instance) {
        if ( instance && !instance.Guestures ) {
            instance.Guestures = new Guestures( instance );
        }
    });
    $(document).on('beforeClose.fb', function (e, instance) {
        if ( instance && instance.Guestures ) {
            instance.Guestures.destroy();
        }
    });
}(window, document, window.jQuery));
// ==========================================================================
//
// SlideShow
// Enables slideshow functionality
//
// Example of usage:
// $.fancybox.getInstance().slideShow.start()
//
// ==========================================================================
;(function (document, $) {
    'use strict';
    var SlideShow = function( instance ) {
        this.instance = instance;
        this.init();
    };
    $.extend( SlideShow.prototype, {
        timer    : null,
        isActive : false,
        $button  : null,
        speed    : 3000,
        init : function() {
            var self = this;
            self.$button = $('<button data-fancybox-play class="fancybox-button fancybox-button--play" title="Slideshow (P)"></button>')
                .appendTo( self.instance.$refs.buttons );
            self.instance.$refs.container.on('click', '[data-fancybox-play]', function() {
                self.toggle();
            });
        },
        set : function() {
            var self = this;
            // Check if reached last element
            if ( self.instance && self.instance.current && (self.instance.current.opts.loop || self.instance.currIndex < self.instance.group.length - 1 )) {
                self.timer = setTimeout(function() {
                    self.instance.next();
                }, self.instance.current.opts.slideShow.speed || self.speed);
            } else {
                self.stop();
            }
        },
        clear : function() {
            var self = this;
            clearTimeout( self.timer );
            self.timer = null;
        },
        start : function() {
            var self = this;
            self.stop();
            if ( self.instance && self.instance.current && ( self.instance.current.opts.loop || self.instance.currIndex < self.instance.group.length - 1 )) {
                self.instance.$refs.container.on({
                    'beforeLoad.fb.player'  : $.proxy(self, "clear"),
                    'onComplete.fb.player'  : $.proxy(self, "set"),
                });
                self.isActive = true;
                if ( self.instance.current.isComplete ) {
                    self.set();
                }
                self.instance.$refs.container.trigger('onPlayStart');
                self.$button.addClass('fancybox-button--pause');
            }
        },
        stop: function() {
            var self = this;
            self.clear();
            self.instance.$refs.container
                .trigger('onPlayEnd')
                .off('.player');
            self.$button.removeClass('fancybox-button--pause');
            self.isActive = false;
        },
        toggle : function() {
            var self = this;
            if ( self.isActive ) {
                self.stop();
            } else {
                self.start();
            }
        }
    });
    $(document).on('onInit.fb', function(e, instance) {
        if ( instance && instance.group.length > 1 && !!instance.opts.slideShow && !instance.SlideShow ) {
            instance.SlideShow = new SlideShow( instance );
        }
    });
    $(document).on('beforeClose.fb onDeactivate.fb', function(e, instance) {
        if ( instance && instance.SlideShow ) {
            instance.SlideShow.stop();
        }
    });
}(document, window.jQuery));
// ==========================================================================
//
// FullScreen
// Adds fullscreen functionality
//
// ==========================================================================
;(function (document, $) {
    'use strict';
    // Collection of methods supported by user browser
    var fn = (function () {
        var fnMap = [
            [
                'requestFullscreen',
                'exitFullscreen',
                'fullscreenElement',
                'fullscreenEnabled',
                'fullscreenchange',
                'fullscreenerror'
            ],
            // new WebKit
            [
                'webkitRequestFullscreen',
                'webkitExitFullscreen',
                'webkitFullscreenElement',
                'webkitFullscreenEnabled',
                'webkitfullscreenchange',
                'webkitfullscreenerror'
            ],
            // old WebKit (Safari 5.1)
            [
                'webkitRequestFullScreen',
                'webkitCancelFullScreen',
                'webkitCurrentFullScreenElement',
                'webkitCancelFullScreen',
                'webkitfullscreenchange',
                'webkitfullscreenerror'
            ],
            [
                'mozRequestFullScreen',
                'mozCancelFullScreen',
                'mozFullScreenElement',
                'mozFullScreenEnabled',
                'mozfullscreenchange',
                'mozfullscreenerror'
            ],
            [
                'msRequestFullscreen',
                'msExitFullscreen',
                'msFullscreenElement',
                'msFullscreenEnabled',
                'MSFullscreenChange',
                'MSFullscreenError'
            ]
        ];
        var val;
        var ret = {};
        var i, j;
        for ( i = 0; i < fnMap.length; i++ ) {
            val = fnMap[ i ];
            if ( val && val[ 1 ] in document ) {
                for ( j = 0; j < val.length; j++ ) {
                    ret[ fnMap[ 0 ][ j ] ] = val[ j ];
                }
                return ret;
            }
        }
        return false;
    })();
    if ( !fn ) {
        return;
    }
    var FullScreen = {
        request : function ( elem ) {
            elem = elem || document.documentElement;
            elem[ fn.requestFullscreen ]( elem.ALLOW_KEYBOARD_INPUT );
        },
        exit : function () {
            document[ fn.exitFullscreen ]();
        },
        toggle : function ( elem ) {
            if ( this.isFullscreen() ) {
                this.exit();
            } else {
                this.request( elem );
            }
        },
        isFullscreen : function()  {
            return Boolean( document[ fn.fullscreenElement ] );
        },
        enabled : function()  {
            return Boolean( document[ fn.fullscreenEnabled ] );
        }
    };
    $(document).on({
        'onInit.fb' : function(e, instance) {
            var $container;
            if ( instance && !!instance.opts.fullScreen && !instance.FullScreen) {
                $container = instance.$refs.container;
                instance.$refs.button_fs = $('<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fullscreen" title="Full screen (F)"></button>')
                    .appendTo( instance.$refs.buttons );
                $container.on('click.fb-fullscreen', '[data-fancybox-fullscreen]', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    FullScreen.toggle( $container[ 0 ] );
                });
                if ( instance.opts.fullScreen.requestOnStart === true ) {
                    FullScreen.request( $container[ 0 ] );
                }
            }
        }, 'beforeMove.fb' : function(e, instance) {
            if ( instance && instance.$refs.button_fs ) {
                instance.$refs.button_fs.toggle( !!instance.current.opts.fullScreen );
            }
        }, 'beforeClose.fb':  function() {
            FullScreen.exit();
        }
    });
    $(document).on(fn.fullscreenchange, function() {
        var instance = $.fancybox.getInstance();
        var  $what   = instance ? instance.current.$placeholder : null;
        if ( $what ) {
            // If image is zooming, then this will force it to stop and reposition properly
            $what.css( 'transition', 'none' );
            instance.isAnimating = false;
            instance.update( true, true, 0 );
        }
    });
}(document, window.jQuery));
// ==========================================================================
//
// Thumbs
// Displays thumbnails in a grid
//
// ==========================================================================
;(function (document, $) {
    'use strict';
    var FancyThumbs = function( instance ) {
        this.instance = instance;
        this.init();
    };
    $.extend( FancyThumbs.prototype, {
        $button     : null,
        $grid       : null,
        $list       : null,
        isVisible   : false,
        init : function() {
            var self = this;
            self.$button = $('<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="Thumbnails (G)"></button>')
                .appendTo( this.instance.$refs.buttons )
                .on('touchend click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    self.toggle();
                });
        },
        create : function() {
            var instance = this.instance,
                list,
                src;
            this.$grid = $('<div class="fancybox-thumbs"></div>').appendTo( instance.$refs.container );
            list = '<ul>';
            $.each(instance.group, function( i, item ) {
                src = item.opts.thumb || ( item.opts.$thumb ? item.opts.$thumb.attr('src') : null );
                if ( !src && item.type === 'image' ) {
                    src = item.src;
                }
                if ( src && src.length ) {
                    list += '<li data-index="' + i + '"  tabindex="0" class="fancybox-thumbs-loading"><img data-src="' + src + '" /></li>';
                }
            });
            list += '</ul>';
            this.$list = $( list ).appendTo( this.$grid ).on('click touchstart', 'li', function() {
                instance.jumpTo( $(this).data('index') );
            });
            this.$list.find('img').hide().one('load', function() {
                var $parent     = $(this).parent().removeClass('fancybox-thumbs-loading'),
                    thumbWidth  = $parent.outerWidth(),
                    thumbHeight = $parent.outerHeight(),
                    width,
                    height,
                    widthRatio,
                    heightRatio;
                width  = this.naturalWidth  || this.width;
                height = this.naturalHeight || this.height;
                //Calculate thumbnail width/height and center it
                widthRatio  = width  / thumbWidth;
                heightRatio = height / thumbHeight;
                if (widthRatio >= 1 && heightRatio >= 1) {
                    if (widthRatio > heightRatio) {
                        width  = width / heightRatio;
                        height = thumbHeight;
                    } else {
                        width  = thumbWidth;
                        height = height / widthRatio;
                    }
                }
                $(this).css({
                    width         : Math.floor(width),
                    height        : Math.floor(height),
                    'margin-top'  : Math.min( 0, Math.floor(thumbHeight * 0.3 - height * 0.3 ) ),
                    'margin-left' : Math.min( 0, Math.floor(thumbWidth  * 0.5 - width  * 0.5 ) )
                }).show();
            })
            .each(function() {
                this.src = $( this ).data( 'src' );
            });
        },
        focus : function() {
            if ( this.instance.current ) {
                this.$list
                    .children()
                    .removeClass('fancybox-thumbs-active')
                    .filter('[data-index="' + this.instance.current.index  + '"]')
                    .addClass('fancybox-thumbs-active')
                    .focus();
            }
        },
        close : function() {
            this.$grid.hide();
        },
        update : function() {
            this.instance.$refs.container.toggleClass('fancybox-container--thumbs', this.isVisible);
            if ( this.isVisible ) {
                if ( !this.$grid ) {
                    this.create();
                }
                this.$grid.show();
                this.focus();
            } else if ( this.$grid ) {
                this.$grid.hide();
            }
            this.instance.update();
        },
        hide : function() {
            this.isVisible = false;
            this.update();
        },
        show : function() {
            this.isVisible = true;
            this.update();
        },
        toggle : function() {
            if ( this.isVisible ) {
                this.hide();
            } else {
                this.show();
            }
        }
    });
    $(document).on('onInit.fb', function(e, instance) {
        var first  = instance.group[0],
            second = instance.group[1];
        if ( !!instance.opts.thumbs && !instance.Thumbs && instance.group.length > 1 && (
                    ( first.type == 'image'  || first.opts.thumb  || first.opts.$thumb ) &&
                    ( second.type == 'image' || second.opts.thumb || second.opts.$thumb )
                )
           ) {
            instance.Thumbs = new FancyThumbs( instance );
        }
    });
    $(document).on('beforeMove.fb', function(e, instance, item) {
        var self = instance && instance.Thumbs;
        if ( !self ) {
            return;
        }
        if ( item.modal ) {
            self.$button.hide();
            self.hide();
        } else {
            if ( instance.opts.thumbs.showOnStart === true && instance.firstRun ) {
                self.show();
            }
            self.$button.show();
            if ( self.isVisible ) {
                self.focus();
            }
        }
    });
    $(document).on('beforeClose.fb', function(e, instance) {
        if ( instance && instance.Thumbs) {
            if ( instance.Thumbs.isVisible && instance.opts.thumbs.hideOnClosing !== false ) {
                instance.Thumbs.close();
            }
            instance.Thumbs = null;
        }
    });
}(document, window.jQuery));
// ==========================================================================
//
// Hash
// Enables linking to each modal
//
// ==========================================================================
;(function (document, window, $) {
    'use strict';
    // Simple $.escapeSelector polyfill (for jQuery prior v3)
    if ( !$.escapeSelector ) {
        $.escapeSelector = function( sel ) {
            var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
            var fcssescape = function( ch, asCodePoint ) {
                if ( asCodePoint ) {
                    // U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
                    if ( ch === "\0" ) {
                        return "\uFFFD";
                    }
                    // Control characters and (dependent upon position) numbers get escaped as code points
                    return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
                }
                // Other potentially-special ASCII characters get backslash-escaped
                return "\\" + ch;
            };
            return ( sel + "" ).replace( rcssescape, fcssescape );
        };
    }
    // Variable containing last hash value set by fancyBox
    // It will be used to determine if fancyBox needs to close after hash change is detected
    var currentHash = null;
    // Get info about gallery name and current index from url
    function parseUrl() {
        var hash    = window.location.hash.substr( 1 );
        var rez     = hash.split( '-' );
        var index   = rez.length > 1 && /^\+?\d+$/.test( rez[ rez.length - 1 ] ) ? parseInt( rez.pop( -1 ), 10 ) || 1 : 1;
        var gallery = rez.join( '-' );
        // Index is starting from 1
        if ( index < 1 ) {
            index = 1;
        }
        return {
            hash    : hash,
            index   : index,
            gallery : gallery
        };
    }
    // Trigger click evnt on links to open new fancyBox instance
    function triggerFromUrl( url ) {
        var $el;
        if ( url.gallery !== '' ) {
            // If we can find element matching 'data-fancybox' atribute, then trigger click event for that ..
            $el = $( "[data-fancybox='" + $.escapeSelector( url.gallery ) + "']" ).eq( url.index - 1 );
            if ( $el.length ) {
                $el.trigger( 'click' );
            } else {
                // .. if not, try finding element by ID
                $( "#" + $.escapeSelector( url.gallery ) + "" ).trigger( 'click' );
            }
        }
    }
    // Get gallery name from current instance
    function getGallery( instance ) {
        var opts;
        if ( !instance ) {
            return false;
        }
        opts = instance.current ? instance.current.opts : instance.opts;
        return opts.$orig ? opts.$orig.data( 'fancybox' ) : ( opts.hash || '' );
    }
    // Star when DOM becomes ready
    $(function() {
        // Small delay is used to allow other scripts to process "dom ready" event
        setTimeout(function() {
            // Check if this module is not disabled
            if ( $.fancybox.defaults.hash === false ) {
                return;
            }
            // Check if need to close after url has changed
            $(window).on('hashchange.fb', function() {
                var url = parseUrl();
                if ( $.fancybox.getInstance() ) {
                    if ( currentHash && currentHash !== url.gallery + '-' + url.index )  {
                        currentHash = null;
                        $.fancybox.close();
                    }
                } else if ( url.gallery !== '' ) {
                    triggerFromUrl( url );
                }
            });
            // Update hash when opening/closing fancyBox
            $(document).on({
                'onInit.fb' : function( e, instance ) {
                    var url     = parseUrl();
                    var gallery = getGallery( instance );
                    // Make sure gallery start index matches index from hash
                    if ( gallery && url.gallery && gallery == url.gallery ) {
                        instance.currIndex = url.index - 1;
                    }
                }, 'beforeMove.fb' : function( e, instance, current ) {
                    var gallery = getGallery( instance );
                    // Update window hash
                    if ( gallery && gallery !== '' ) {
                        if ( window.location.hash.indexOf( gallery ) < 0 ) {
                            instance.opts.origHash = window.location.hash;
                        }
                        currentHash = gallery + ( instance.group.length > 1 ? '-' + ( current.index + 1 ) : '' );
                        if ( "pushState" in history ) {
                            history.pushState( '', document.title, window.location.pathname + window.location.search + '#' +  currentHash );
                        } else {
                            window.location.hash = currentHash;
                        }
                    }
                }, 'beforeClose.fb' : function( e, instance, current ) {
                    var gallery  = getGallery( instance );
                    var origHash = instance && instance.opts.origHash ? instance.opts.origHash : '';
                    // Remove hash from location bar
                    if ( gallery && gallery !== '' ) {
                        if ( "pushState" in history ) {
                            history.pushState( '', document.title, window.location.pathname + window.location.search + origHash );
                        } else {
                            window.location.hash = origHash;
                        }
                    }
                    currentHash = null;
                }
            });
            // Check current hash and trigger click event on matching element to start fancyBox, if needed
            triggerFromUrl( parseUrl() );
        }, 50);
    });
}(document, window, window.jQuery));
/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/
 Version: 1.6.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues
 */
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):"undefined"!=typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){"use strict";var b=window.Slick||{};b=function(){function c(c,d){var f,e=this;e.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:a(c),appendDots:a(c),arrows:!0,asNavFor:null,prevArrow:'<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',nextArrow:'<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(b,c){return a('<button type="button" data-role="none" role="button" tabindex="0" />').text(c+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},e.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},a.extend(e,e.initials),e.activeBreakpoint=null,e.animType=null,e.animProp=null,e.breakpoints=[],e.breakpointSettings=[],e.cssTransitions=!1,e.focussed=!1,e.interrupted=!1,e.hidden="hidden",e.paused=!0,e.positionProp=null,e.respondTo=null,e.rowCount=1,e.shouldClick=!0,e.$slider=a(c),e.$slidesCache=null,e.transformType=null,e.transitionType=null,e.visibilityChange="visibilitychange",e.windowWidth=0,e.windowTimer=null,f=a(c).data("slick")||{},e.options=a.extend({},e.defaults,d,f),e.currentSlide=e.options.initialSlide,e.originalSettings=e.options,"undefined"!=typeof document.mozHidden?(e.hidden="mozHidden",e.visibilityChange="mozvisibilitychange"):"undefined"!=typeof document.webkitHidden&&(e.hidden="webkitHidden",e.visibilityChange="webkitvisibilitychange"),e.autoPlay=a.proxy(e.autoPlay,e),e.autoPlayClear=a.proxy(e.autoPlayClear,e),e.autoPlayIterator=a.proxy(e.autoPlayIterator,e),e.changeSlide=a.proxy(e.changeSlide,e),e.clickHandler=a.proxy(e.clickHandler,e),e.selectHandler=a.proxy(e.selectHandler,e),e.setPosition=a.proxy(e.setPosition,e),e.swipeHandler=a.proxy(e.swipeHandler,e),e.dragHandler=a.proxy(e.dragHandler,e),e.keyHandler=a.proxy(e.keyHandler,e),e.instanceUid=b++,e.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,e.registerBreakpoints(),e.init(!0)}var b=0;return c}(),b.prototype.activateADA=function(){var a=this;a.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},b.prototype.addSlide=b.prototype.slickAdd=function(b,c,d){var e=this;if("boolean"==typeof c)d=c,c=null;else if(0>c||c>=e.slideCount)return!1;e.unload(),"number"==typeof c?0===c&&0===e.$slides.length?a(b).appendTo(e.$slideTrack):d?a(b).insertBefore(e.$slides.eq(c)):a(b).insertAfter(e.$slides.eq(c)):d===!0?a(b).prependTo(e.$slideTrack):a(b).appendTo(e.$slideTrack),e.$slides=e.$slideTrack.children(this.options.slide),e.$slideTrack.children(this.options.slide).detach(),e.$slideTrack.append(e.$slides),e.$slides.each(function(b,c){a(c).attr("data-slick-index",b)}),e.$slidesCache=e.$slides,e.reinit()},b.prototype.animateHeight=function(){var a=this;if(1===a.options.slidesToShow&&a.options.adaptiveHeight===!0&&a.options.vertical===!1){var b=a.$slides.eq(a.currentSlide).outerHeight(!0);a.$list.animate({height:b},a.options.speed)}},b.prototype.animateSlide=function(b,c){var d={},e=this;e.animateHeight(),e.options.rtl===!0&&e.options.vertical===!1&&(b=-b),e.transformsEnabled===!1?e.options.vertical===!1?e.$slideTrack.animate({left:b},e.options.speed,e.options.easing,c):e.$slideTrack.animate({top:b},e.options.speed,e.options.easing,c):e.cssTransitions===!1?(e.options.rtl===!0&&(e.currentLeft=-e.currentLeft),a({animStart:e.currentLeft}).animate({animStart:b},{duration:e.options.speed,easing:e.options.easing,step:function(a){a=Math.ceil(a),e.options.vertical===!1?(d[e.animType]="translate("+a+"px, 0px)",e.$slideTrack.css(d)):(d[e.animType]="translate(0px,"+a+"px)",e.$slideTrack.css(d))},complete:function(){c&&c.call()}})):(e.applyTransition(),b=Math.ceil(b),e.options.vertical===!1?d[e.animType]="translate3d("+b+"px, 0px, 0px)":d[e.animType]="translate3d(0px,"+b+"px, 0px)",e.$slideTrack.css(d),c&&setTimeout(function(){e.disableTransition(),c.call()},e.options.speed))},b.prototype.getNavTarget=function(){var b=this,c=b.options.asNavFor;return c&&null!==c&&(c=a(c).not(b.$slider)),c},b.prototype.asNavFor=function(b){var c=this,d=c.getNavTarget();null!==d&&"object"==typeof d&&d.each(function(){var c=a(this).slick("getSlick");c.unslicked||c.slideHandler(b,!0)})},b.prototype.applyTransition=function(a){var b=this,c={};b.options.fade===!1?c[b.transitionType]=b.transformType+" "+b.options.speed+"ms "+b.options.cssEase:c[b.transitionType]="opacity "+b.options.speed+"ms "+b.options.cssEase,b.options.fade===!1?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.autoPlay=function(){var a=this;a.autoPlayClear(),a.slideCount>a.options.slidesToShow&&(a.autoPlayTimer=setInterval(a.autoPlayIterator,a.options.autoplaySpeed))},b.prototype.autoPlayClear=function(){var a=this;a.autoPlayTimer&&clearInterval(a.autoPlayTimer)},b.prototype.autoPlayIterator=function(){var a=this,b=a.currentSlide+a.options.slidesToScroll;a.paused||a.interrupted||a.focussed||(a.options.infinite===!1&&(1===a.direction&&a.currentSlide+1===a.slideCount-1?a.direction=0:0===a.direction&&(b=a.currentSlide-a.options.slidesToScroll,a.currentSlide-1===0&&(a.direction=1))),a.slideHandler(b))},b.prototype.buildArrows=function(){var b=this;b.options.arrows===!0&&(b.$prevArrow=a(b.options.prevArrow).addClass("slick-arrow"),b.$nextArrow=a(b.options.nextArrow).addClass("slick-arrow"),b.slideCount>b.options.slidesToShow?(b.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),b.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),b.htmlExpr.test(b.options.prevArrow)&&b.$prevArrow.prependTo(b.options.appendArrows),b.htmlExpr.test(b.options.nextArrow)&&b.$nextArrow.appendTo(b.options.appendArrows),b.options.infinite!==!0&&b.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):b.$prevArrow.add(b.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},b.prototype.buildDots=function(){var c,d,b=this;if(b.options.dots===!0&&b.slideCount>b.options.slidesToShow){for(b.$slider.addClass("slick-dotted"),d=a("<ul />").addClass(b.options.dotsClass),c=0;c<=b.getDotCount();c+=1)d.append(a("<li />").append(b.options.customPaging.call(this,b,c)));b.$dots=d.appendTo(b.options.appendDots),b.$dots.find("li").first().addClass("slick-active").attr("aria-hidden","false")}},b.prototype.buildOut=function(){var b=this;b.$slides=b.$slider.children(b.options.slide+":not(.slick-cloned)").addClass("slick-slide"),b.slideCount=b.$slides.length,b.$slides.each(function(b,c){a(c).attr("data-slick-index",b).data("originalStyling",a(c).attr("style")||"")}),b.$slider.addClass("slick-slider"),b.$slideTrack=0===b.slideCount?a('<div class="slick-track"/>').appendTo(b.$slider):b.$slides.wrapAll('<div class="slick-track"/>').parent(),b.$list=b.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(),b.$slideTrack.css("opacity",0),(b.options.centerMode===!0||b.options.swipeToSlide===!0)&&(b.options.slidesToScroll=1),a("img[data-lazy]",b.$slider).not("[src]").addClass("slick-loading"),b.setupInfinite(),b.buildArrows(),b.buildDots(),b.updateDots(),b.setSlideClasses("number"==typeof b.currentSlide?b.currentSlide:0),b.options.draggable===!0&&b.$list.addClass("draggable")},b.prototype.buildRows=function(){var b,c,d,e,f,g,h,a=this;if(e=document.createDocumentFragment(),g=a.$slider.children(),a.options.rows>1){for(h=a.options.slidesPerRow*a.options.rows,f=Math.ceil(g.length/h),b=0;f>b;b++){var i=document.createElement("div");for(c=0;c<a.options.rows;c++){var j=document.createElement("div");for(d=0;d<a.options.slidesPerRow;d++){var k=b*h+(c*a.options.slidesPerRow+d);g.get(k)&&j.appendChild(g.get(k))}i.appendChild(j)}e.appendChild(i)}a.$slider.empty().append(e),a.$slider.children().children().children().css({width:100/a.options.slidesPerRow+"%",display:"inline-block"})}},b.prototype.checkResponsive=function(b,c){var e,f,g,d=this,h=!1,i=d.$slider.width(),j=window.innerWidth||a(window).width();if("window"===d.respondTo?g=j:"slider"===d.respondTo?g=i:"min"===d.respondTo&&(g=Math.min(j,i)),d.options.responsive&&d.options.responsive.length&&null!==d.options.responsive){f=null;for(e in d.breakpoints)d.breakpoints.hasOwnProperty(e)&&(d.originalSettings.mobileFirst===!1?g<d.breakpoints[e]&&(f=d.breakpoints[e]):g>d.breakpoints[e]&&(f=d.breakpoints[e]));null!==f?null!==d.activeBreakpoint?(f!==d.activeBreakpoint||c)&&(d.activeBreakpoint=f,"unslick"===d.breakpointSettings[f]?d.unslick(f):(d.options=a.extend({},d.originalSettings,d.breakpointSettings[f]),b===!0&&(d.currentSlide=d.options.initialSlide),d.refresh(b)),h=f):(d.activeBreakpoint=f,"unslick"===d.breakpointSettings[f]?d.unslick(f):(d.options=a.extend({},d.originalSettings,d.breakpointSettings[f]),b===!0&&(d.currentSlide=d.options.initialSlide),d.refresh(b)),h=f):null!==d.activeBreakpoint&&(d.activeBreakpoint=null,d.options=d.originalSettings,b===!0&&(d.currentSlide=d.options.initialSlide),d.refresh(b),h=f),b||h===!1||d.$slider.trigger("breakpoint",[d,h])}},b.prototype.changeSlide=function(b,c){var f,g,h,d=this,e=a(b.currentTarget);switch(e.is("a")&&b.preventDefault(),e.is("li")||(e=e.closest("li")),h=d.slideCount%d.options.slidesToScroll!==0,f=h?0:(d.slideCount-d.currentSlide)%d.options.slidesToScroll,b.data.message){case"previous":g=0===f?d.options.slidesToScroll:d.options.slidesToShow-f,d.slideCount>d.options.slidesToShow&&d.slideHandler(d.currentSlide-g,!1,c);break;case"next":g=0===f?d.options.slidesToScroll:f,d.slideCount>d.options.slidesToShow&&d.slideHandler(d.currentSlide+g,!1,c);break;case"index":var i=0===b.data.index?0:b.data.index||e.index()*d.options.slidesToScroll;d.slideHandler(d.checkNavigable(i),!1,c),e.children().trigger("focus");break;default:return}},b.prototype.checkNavigable=function(a){var c,d,b=this;if(c=b.getNavigableIndexes(),d=0,a>c[c.length-1])a=c[c.length-1];else for(var e in c){if(a<c[e]){a=d;break}d=c[e]}return a},b.prototype.cleanUpEvents=function(){var b=this;b.options.dots&&null!==b.$dots&&a("li",b.$dots).off("click.slick",b.changeSlide).off("mouseenter.slick",a.proxy(b.interrupt,b,!0)).off("mouseleave.slick",a.proxy(b.interrupt,b,!1)),b.$slider.off("focus.slick blur.slick"),b.options.arrows===!0&&b.slideCount>b.options.slidesToShow&&(b.$prevArrow&&b.$prevArrow.off("click.slick",b.changeSlide),b.$nextArrow&&b.$nextArrow.off("click.slick",b.changeSlide)),b.$list.off("touchstart.slick mousedown.slick",b.swipeHandler),b.$list.off("touchmove.slick mousemove.slick",b.swipeHandler),b.$list.off("touchend.slick mouseup.slick",b.swipeHandler),b.$list.off("touchcancel.slick mouseleave.slick",b.swipeHandler),b.$list.off("click.slick",b.clickHandler),a(document).off(b.visibilityChange,b.visibility),b.cleanUpSlideEvents(),b.options.accessibility===!0&&b.$list.off("keydown.slick",b.keyHandler),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().off("click.slick",b.selectHandler),a(window).off("orientationchange.slick.slick-"+b.instanceUid,b.orientationChange),a(window).off("resize.slick.slick-"+b.instanceUid,b.resize),a("[draggable!=true]",b.$slideTrack).off("dragstart",b.preventDefault),a(window).off("load.slick.slick-"+b.instanceUid,b.setPosition),a(document).off("ready.slick.slick-"+b.instanceUid,b.setPosition)},b.prototype.cleanUpSlideEvents=function(){var b=this;b.$list.off("mouseenter.slick",a.proxy(b.interrupt,b,!0)),b.$list.off("mouseleave.slick",a.proxy(b.interrupt,b,!1))},b.prototype.cleanUpRows=function(){var b,a=this;a.options.rows>1&&(b=a.$slides.children().children(),b.removeAttr("style"),a.$slider.empty().append(b))},b.prototype.clickHandler=function(a){var b=this;b.shouldClick===!1&&(a.stopImmediatePropagation(),a.stopPropagation(),a.preventDefault())},b.prototype.destroy=function(b){var c=this;c.autoPlayClear(),c.touchObject={},c.cleanUpEvents(),a(".slick-cloned",c.$slider).detach(),c.$dots&&c.$dots.remove(),c.$prevArrow&&c.$prevArrow.length&&(c.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),c.htmlExpr.test(c.options.prevArrow)&&c.$prevArrow.remove()),c.$nextArrow&&c.$nextArrow.length&&(c.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),c.htmlExpr.test(c.options.nextArrow)&&c.$nextArrow.remove()),c.$slides&&(c.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){a(this).attr("style",a(this).data("originalStyling"))}),c.$slideTrack.children(this.options.slide).detach(),c.$slideTrack.detach(),c.$list.detach(),c.$slider.append(c.$slides)),c.cleanUpRows(),c.$slider.removeClass("slick-slider"),c.$slider.removeClass("slick-initialized"),c.$slider.removeClass("slick-dotted"),c.unslicked=!0,b||c.$slider.trigger("destroy",[c])},b.prototype.disableTransition=function(a){var b=this,c={};c[b.transitionType]="",b.options.fade===!1?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.fadeSlide=function(a,b){var c=this;c.cssTransitions===!1?(c.$slides.eq(a).css({zIndex:c.options.zIndex}),c.$slides.eq(a).animate({opacity:1},c.options.speed,c.options.easing,b)):(c.applyTransition(a),c.$slides.eq(a).css({opacity:1,zIndex:c.options.zIndex}),b&&setTimeout(function(){c.disableTransition(a),b.call()},c.options.speed))},b.prototype.fadeSlideOut=function(a){var b=this;b.cssTransitions===!1?b.$slides.eq(a).animate({opacity:0,zIndex:b.options.zIndex-2},b.options.speed,b.options.easing):(b.applyTransition(a),b.$slides.eq(a).css({opacity:0,zIndex:b.options.zIndex-2}))},b.prototype.filterSlides=b.prototype.slickFilter=function(a){var b=this;null!==a&&(b.$slidesCache=b.$slides,b.unload(),b.$slideTrack.children(this.options.slide).detach(),b.$slidesCache.filter(a).appendTo(b.$slideTrack),b.reinit())},b.prototype.focusHandler=function(){var b=this;b.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick","*:not(.slick-arrow)",function(c){c.stopImmediatePropagation();var d=a(this);setTimeout(function(){b.options.pauseOnFocus&&(b.focussed=d.is(":focus"),b.autoPlay())},0)})},b.prototype.getCurrent=b.prototype.slickCurrentSlide=function(){var a=this;return a.currentSlide},b.prototype.getDotCount=function(){var a=this,b=0,c=0,d=0;if(a.options.infinite===!0)for(;b<a.slideCount;)++d,b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;else if(a.options.centerMode===!0)d=a.slideCount;else if(a.options.asNavFor)for(;b<a.slideCount;)++d,b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;else d=1+Math.ceil((a.slideCount-a.options.slidesToShow)/a.options.slidesToScroll);return d-1},b.prototype.getLeft=function(a){var c,d,f,b=this,e=0;return b.slideOffset=0,d=b.$slides.first().outerHeight(!0),b.options.infinite===!0?(b.slideCount>b.options.slidesToShow&&(b.slideOffset=b.slideWidth*b.options.slidesToShow*-1,e=d*b.options.slidesToShow*-1),b.slideCount%b.options.slidesToScroll!==0&&a+b.options.slidesToScroll>b.slideCount&&b.slideCount>b.options.slidesToShow&&(a>b.slideCount?(b.slideOffset=(b.options.slidesToShow-(a-b.slideCount))*b.slideWidth*-1,e=(b.options.slidesToShow-(a-b.slideCount))*d*-1):(b.slideOffset=b.slideCount%b.options.slidesToScroll*b.slideWidth*-1,e=b.slideCount%b.options.slidesToScroll*d*-1))):a+b.options.slidesToShow>b.slideCount&&(b.slideOffset=(a+b.options.slidesToShow-b.slideCount)*b.slideWidth,e=(a+b.options.slidesToShow-b.slideCount)*d),b.slideCount<=b.options.slidesToShow&&(b.slideOffset=0,e=0),b.options.centerMode===!0&&b.options.infinite===!0?b.slideOffset+=b.slideWidth*Math.floor(b.options.slidesToShow/2)-b.slideWidth:b.options.centerMode===!0&&(b.slideOffset=0,b.slideOffset+=b.slideWidth*Math.floor(b.options.slidesToShow/2)),c=b.options.vertical===!1?a*b.slideWidth*-1+b.slideOffset:a*d*-1+e,b.options.variableWidth===!0&&(f=b.slideCount<=b.options.slidesToShow||b.options.infinite===!1?b.$slideTrack.children(".slick-slide").eq(a):b.$slideTrack.children(".slick-slide").eq(a+b.options.slidesToShow),c=b.options.rtl===!0?f[0]?-1*(b.$slideTrack.width()-f[0].offsetLeft-f.width()):0:f[0]?-1*f[0].offsetLeft:0,b.options.centerMode===!0&&(f=b.slideCount<=b.options.slidesToShow||b.options.infinite===!1?b.$slideTrack.children(".slick-slide").eq(a):b.$slideTrack.children(".slick-slide").eq(a+b.options.slidesToShow+1),c=b.options.rtl===!0?f[0]?-1*(b.$slideTrack.width()-f[0].offsetLeft-f.width()):0:f[0]?-1*f[0].offsetLeft:0,c+=(b.$list.width()-f.outerWidth())/2)),c},b.prototype.getOption=b.prototype.slickGetOption=function(a){var b=this;return b.options[a]},b.prototype.getNavigableIndexes=function(){var e,a=this,b=0,c=0,d=[];for(a.options.infinite===!1?e=a.slideCount:(b=-1*a.options.slidesToScroll,c=-1*a.options.slidesToScroll,e=2*a.slideCount);e>b;)d.push(b),b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;return d},b.prototype.getSlick=function(){return this},b.prototype.getSlideCount=function(){var c,d,e,b=this;return e=b.options.centerMode===!0?b.slideWidth*Math.floor(b.options.slidesToShow/2):0,b.options.swipeToSlide===!0?(b.$slideTrack.find(".slick-slide").each(function(c,f){return f.offsetLeft-e+a(f).outerWidth()/2>-1*b.swipeLeft?(d=f,!1):void 0}),c=Math.abs(a(d).attr("data-slick-index")-b.currentSlide)||1):b.options.slidesToScroll},b.prototype.goTo=b.prototype.slickGoTo=function(a,b){var c=this;c.changeSlide({data:{message:"index",index:parseInt(a)}},b)},b.prototype.init=function(b){var c=this;a(c.$slider).hasClass("slick-initialized")||(a(c.$slider).addClass("slick-initialized"),c.buildRows(),c.buildOut(),c.setProps(),c.startLoad(),c.loadSlider(),c.initializeEvents(),c.updateArrows(),c.updateDots(),c.checkResponsive(!0),c.focusHandler()),b&&c.$slider.trigger("init",[c]),c.options.accessibility===!0&&c.initADA(),c.options.autoplay&&(c.paused=!1,c.autoPlay())},b.prototype.initADA=function(){var b=this;b.$slides.add(b.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),b.$slideTrack.attr("role","listbox"),b.$slides.not(b.$slideTrack.find(".slick-cloned")).each(function(c){a(this).attr({role:"option","aria-describedby":"slick-slide"+b.instanceUid+c})}),null!==b.$dots&&b.$dots.attr("role","tablist").find("li").each(function(c){a(this).attr({role:"presentation","aria-selected":"false","aria-controls":"navigation"+b.instanceUid+c,id:"slick-slide"+b.instanceUid+c})}).first().attr("aria-selected","true").end().find("button").attr("role","button").end().closest("div").attr("role","toolbar"),b.activateADA()},b.prototype.initArrowEvents=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},a.changeSlide),a.$nextArrow.off("click.slick").on("click.slick",{message:"next"},a.changeSlide))},b.prototype.initDotEvents=function(){var b=this;b.options.dots===!0&&b.slideCount>b.options.slidesToShow&&a("li",b.$dots).on("click.slick",{message:"index"},b.changeSlide),b.options.dots===!0&&b.options.pauseOnDotsHover===!0&&a("li",b.$dots).on("mouseenter.slick",a.proxy(b.interrupt,b,!0)).on("mouseleave.slick",a.proxy(b.interrupt,b,!1))},b.prototype.initSlideEvents=function(){var b=this;b.options.pauseOnHover&&(b.$list.on("mouseenter.slick",a.proxy(b.interrupt,b,!0)),b.$list.on("mouseleave.slick",a.proxy(b.interrupt,b,!1)))},b.prototype.initializeEvents=function(){var b=this;b.initArrowEvents(),b.initDotEvents(),b.initSlideEvents(),b.$list.on("touchstart.slick mousedown.slick",{action:"start"},b.swipeHandler),b.$list.on("touchmove.slick mousemove.slick",{action:"move"},b.swipeHandler),b.$list.on("touchend.slick mouseup.slick",{action:"end"},b.swipeHandler),b.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},b.swipeHandler),b.$list.on("click.slick",b.clickHandler),a(document).on(b.visibilityChange,a.proxy(b.visibility,b)),b.options.accessibility===!0&&b.$list.on("keydown.slick",b.keyHandler),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().on("click.slick",b.selectHandler),a(window).on("orientationchange.slick.slick-"+b.instanceUid,a.proxy(b.orientationChange,b)),a(window).on("resize.slick.slick-"+b.instanceUid,a.proxy(b.resize,b)),a("[draggable!=true]",b.$slideTrack).on("dragstart",b.preventDefault),a(window).on("load.slick.slick-"+b.instanceUid,b.setPosition),a(document).on("ready.slick.slick-"+b.instanceUid,b.setPosition)},b.prototype.initUI=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.show(),a.$nextArrow.show()),a.options.dots===!0&&a.slideCount>a.options.slidesToShow&&a.$dots.show()},b.prototype.keyHandler=function(a){var b=this;a.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===a.keyCode&&b.options.accessibility===!0?b.changeSlide({data:{message:b.options.rtl===!0?"next":"previous"}}):39===a.keyCode&&b.options.accessibility===!0&&b.changeSlide({data:{message:b.options.rtl===!0?"previous":"next"}}))},b.prototype.lazyLoad=function(){function g(c){a("img[data-lazy]",c).each(function(){var c=a(this),d=a(this).attr("data-lazy"),e=document.createElement("img");e.onload=function(){c.animate({opacity:0},100,function(){c.attr("src",d).animate({opacity:1},200,function(){c.removeAttr("data-lazy").removeClass("slick-loading")}),b.$slider.trigger("lazyLoaded",[b,c,d])})},e.onerror=function(){c.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),b.$slider.trigger("lazyLoadError",[b,c,d])},e.src=d})}var c,d,e,f,b=this;b.options.centerMode===!0?b.options.infinite===!0?(e=b.currentSlide+(b.options.slidesToShow/2+1),f=e+b.options.slidesToShow+2):(e=Math.max(0,b.currentSlide-(b.options.slidesToShow/2+1)),f=2+(b.options.slidesToShow/2+1)+b.currentSlide):(e=b.options.infinite?b.options.slidesToShow+b.currentSlide:b.currentSlide,f=Math.ceil(e+b.options.slidesToShow),b.options.fade===!0&&(e>0&&e--,f<=b.slideCount&&f++)),c=b.$slider.find(".slick-slide").slice(e,f),g(c),b.slideCount<=b.options.slidesToShow?(d=b.$slider.find(".slick-slide"),g(d)):b.currentSlide>=b.slideCount-b.options.slidesToShow?(d=b.$slider.find(".slick-cloned").slice(0,b.options.slidesToShow),g(d)):0===b.currentSlide&&(d=b.$slider.find(".slick-cloned").slice(-1*b.options.slidesToShow),g(d))},b.prototype.loadSlider=function(){var a=this;a.setPosition(),a.$slideTrack.css({opacity:1}),a.$slider.removeClass("slick-loading"),a.initUI(),"progressive"===a.options.lazyLoad&&a.progressiveLazyLoad()},b.prototype.next=b.prototype.slickNext=function(){var a=this;a.changeSlide({data:{message:"next"}})},b.prototype.orientationChange=function(){var a=this;a.checkResponsive(),a.setPosition()},b.prototype.pause=b.prototype.slickPause=function(){var a=this;a.autoPlayClear(),a.paused=!0},b.prototype.play=b.prototype.slickPlay=function(){var a=this;a.autoPlay(),a.options.autoplay=!0,a.paused=!1,a.focussed=!1,a.interrupted=!1},b.prototype.postSlide=function(a){var b=this;b.unslicked||(b.$slider.trigger("afterChange",[b,a]),b.animating=!1,b.setPosition(),b.swipeLeft=null,b.options.autoplay&&b.autoPlay(),b.options.accessibility===!0&&b.initADA())},b.prototype.prev=b.prototype.slickPrev=function(){var a=this;a.changeSlide({data:{message:"previous"}})},b.prototype.preventDefault=function(a){a.preventDefault()},b.prototype.progressiveLazyLoad=function(b){b=b||1;var e,f,g,c=this,d=a("img[data-lazy]",c.$slider);d.length?(e=d.first(),f=e.attr("data-lazy"),g=document.createElement("img"),g.onload=function(){e.attr("src",f).removeAttr("data-lazy").removeClass("slick-loading"),c.options.adaptiveHeight===!0&&c.setPosition(),c.$slider.trigger("lazyLoaded",[c,e,f]),c.progressiveLazyLoad()},g.onerror=function(){3>b?setTimeout(function(){c.progressiveLazyLoad(b+1)},500):(e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),c.$slider.trigger("lazyLoadError",[c,e,f]),c.progressiveLazyLoad())},g.src=f):c.$slider.trigger("allImagesLoaded",[c])},b.prototype.refresh=function(b){var d,e,c=this;e=c.slideCount-c.options.slidesToShow,!c.options.infinite&&c.currentSlide>e&&(c.currentSlide=e),c.slideCount<=c.options.slidesToShow&&(c.currentSlide=0),d=c.currentSlide,c.destroy(!0),a.extend(c,c.initials,{currentSlide:d}),c.init(),b||c.changeSlide({data:{message:"index",index:d}},!1)},b.prototype.registerBreakpoints=function(){var c,d,e,b=this,f=b.options.responsive||null;if("array"===a.type(f)&&f.length){b.respondTo=b.options.respondTo||"window";for(c in f)if(e=b.breakpoints.length-1,d=f[c].breakpoint,f.hasOwnProperty(c)){for(;e>=0;)b.breakpoints[e]&&b.breakpoints[e]===d&&b.breakpoints.splice(e,1),e--;b.breakpoints.push(d),b.breakpointSettings[d]=f[c].settings}b.breakpoints.sort(function(a,c){return b.options.mobileFirst?a-c:c-a})}},b.prototype.reinit=function(){var b=this;b.$slides=b.$slideTrack.children(b.options.slide).addClass("slick-slide"),b.slideCount=b.$slides.length,b.currentSlide>=b.slideCount&&0!==b.currentSlide&&(b.currentSlide=b.currentSlide-b.options.slidesToScroll),b.slideCount<=b.options.slidesToShow&&(b.currentSlide=0),b.registerBreakpoints(),b.setProps(),b.setupInfinite(),b.buildArrows(),b.updateArrows(),b.initArrowEvents(),b.buildDots(),b.updateDots(),b.initDotEvents(),b.cleanUpSlideEvents(),b.initSlideEvents(),b.checkResponsive(!1,!0),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().on("click.slick",b.selectHandler),b.setSlideClasses("number"==typeof b.currentSlide?b.currentSlide:0),b.setPosition(),b.focusHandler(),b.paused=!b.options.autoplay,b.autoPlay(),b.$slider.trigger("reInit",[b])},b.prototype.resize=function(){var b=this;a(window).width()!==b.windowWidth&&(clearTimeout(b.windowDelay),b.windowDelay=window.setTimeout(function(){b.windowWidth=a(window).width(),b.checkResponsive(),b.unslicked||b.setPosition()},50))},b.prototype.removeSlide=b.prototype.slickRemove=function(a,b,c){var d=this;return"boolean"==typeof a?(b=a,a=b===!0?0:d.slideCount-1):a=b===!0?--a:a,d.slideCount<1||0>a||a>d.slideCount-1?!1:(d.unload(),c===!0?d.$slideTrack.children().remove():d.$slideTrack.children(this.options.slide).eq(a).remove(),d.$slides=d.$slideTrack.children(this.options.slide),d.$slideTrack.children(this.options.slide).detach(),d.$slideTrack.append(d.$slides),d.$slidesCache=d.$slides,void d.reinit())},b.prototype.setCSS=function(a){var d,e,b=this,c={};b.options.rtl===!0&&(a=-a),d="left"==b.positionProp?Math.ceil(a)+"px":"0px",e="top"==b.positionProp?Math.ceil(a)+"px":"0px",c[b.positionProp]=a,b.transformsEnabled===!1?b.$slideTrack.css(c):(c={},b.cssTransitions===!1?(c[b.animType]="translate("+d+", "+e+")",b.$slideTrack.css(c)):(c[b.animType]="translate3d("+d+", "+e+", 0px)",b.$slideTrack.css(c)))},b.prototype.setDimensions=function(){var a=this;a.options.vertical===!1?a.options.centerMode===!0&&a.$list.css({padding:"0px "+a.options.centerPadding}):(a.$list.height(a.$slides.first().outerHeight(!0)*a.options.slidesToShow),a.options.centerMode===!0&&a.$list.css({padding:a.options.centerPadding+" 0px"})),a.listWidth=a.$list.width(),a.listHeight=a.$list.height(),a.options.vertical===!1&&a.options.variableWidth===!1?(a.slideWidth=Math.ceil(a.listWidth/a.options.slidesToShow),a.$slideTrack.width(Math.ceil(a.slideWidth*a.$slideTrack.children(".slick-slide").length))):a.options.variableWidth===!0?a.$slideTrack.width(5e3*a.slideCount):(a.slideWidth=Math.ceil(a.listWidth),a.$slideTrack.height(Math.ceil(a.$slides.first().outerHeight(!0)*a.$slideTrack.children(".slick-slide").length)));var b=a.$slides.first().outerWidth(!0)-a.$slides.first().width();a.options.variableWidth===!1&&a.$slideTrack.children(".slick-slide").width(a.slideWidth-b)},b.prototype.setFade=function(){var c,b=this;b.$slides.each(function(d,e){c=b.slideWidth*d*-1,b.options.rtl===!0?a(e).css({position:"relative",right:c,top:0,zIndex:b.options.zIndex-2,opacity:0}):a(e).css({position:"relative",left:c,top:0,zIndex:b.options.zIndex-2,opacity:0})}),b.$slides.eq(b.currentSlide).css({zIndex:b.options.zIndex-1,opacity:1})},b.prototype.setHeight=function(){var a=this;if(1===a.options.slidesToShow&&a.options.adaptiveHeight===!0&&a.options.vertical===!1){var b=a.$slides.eq(a.currentSlide).outerHeight(!0);a.$list.css("height",b)}},b.prototype.setOption=b.prototype.slickSetOption=function(){var c,d,e,f,h,b=this,g=!1;if("object"===a.type(arguments[0])?(e=arguments[0],g=arguments[1],h="multiple"):"string"===a.type(arguments[0])&&(e=arguments[0],f=arguments[1],g=arguments[2],"responsive"===arguments[0]&&"array"===a.type(arguments[1])?h="responsive":"undefined"!=typeof arguments[1]&&(h="single")),"single"===h)b.options[e]=f;else if("multiple"===h)a.each(e,function(a,c){b.options[a]=c});else if("responsive"===h)for(d in f)if("array"!==a.type(b.options.responsive))b.options.responsive=[f[d]];else{for(c=b.options.responsive.length-1;c>=0;)b.options.responsive[c].breakpoint===f[d].breakpoint&&b.options.responsive.splice(c,1),c--;b.options.responsive.push(f[d])}g&&(b.unload(),b.reinit())},b.prototype.setPosition=function(){var a=this;a.setDimensions(),a.setHeight(),a.options.fade===!1?a.setCSS(a.getLeft(a.currentSlide)):a.setFade(),a.$slider.trigger("setPosition",[a])},b.prototype.setProps=function(){var a=this,b=document.body.style;a.positionProp=a.options.vertical===!0?"top":"left","top"===a.positionProp?a.$slider.addClass("slick-vertical"):a.$slider.removeClass("slick-vertical"),(void 0!==b.WebkitTransition||void 0!==b.MozTransition||void 0!==b.msTransition)&&a.options.useCSS===!0&&(a.cssTransitions=!0),a.options.fade&&("number"==typeof a.options.zIndex?a.options.zIndex<3&&(a.options.zIndex=3):a.options.zIndex=a.defaults.zIndex),void 0!==b.OTransform&&(a.animType="OTransform",a.transformType="-o-transform",a.transitionType="OTransition",void 0===b.perspectiveProperty&&void 0===b.webkitPerspective&&(a.animType=!1)),void 0!==b.MozTransform&&(a.animType="MozTransform",a.transformType="-moz-transform",a.transitionType="MozTransition",void 0===b.perspectiveProperty&&void 0===b.MozPerspective&&(a.animType=!1)),void 0!==b.webkitTransform&&(a.animType="webkitTransform",a.transformType="-webkit-transform",a.transitionType="webkitTransition",void 0===b.perspectiveProperty&&void 0===b.webkitPerspective&&(a.animType=!1)),void 0!==b.msTransform&&(a.animType="msTransform",a.transformType="-ms-transform",a.transitionType="msTransition",void 0===b.msTransform&&(a.animType=!1)),void 0!==b.transform&&a.animType!==!1&&(a.animType="transform",a.transformType="transform",a.transitionType="transition"),a.transformsEnabled=a.options.useTransform&&null!==a.animType&&a.animType!==!1},b.prototype.setSlideClasses=function(a){var c,d,e,f,b=this;d=b.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),b.$slides.eq(a).addClass("slick-current"),b.options.centerMode===!0?(c=Math.floor(b.options.slidesToShow/2),b.options.infinite===!0&&(a>=c&&a<=b.slideCount-1-c?b.$slides.slice(a-c,a+c+1).addClass("slick-active").attr("aria-hidden","false"):(e=b.options.slidesToShow+a,
d.slice(e-c+1,e+c+2).addClass("slick-active").attr("aria-hidden","false")),0===a?d.eq(d.length-1-b.options.slidesToShow).addClass("slick-center"):a===b.slideCount-1&&d.eq(b.options.slidesToShow).addClass("slick-center")),b.$slides.eq(a).addClass("slick-center")):a>=0&&a<=b.slideCount-b.options.slidesToShow?b.$slides.slice(a,a+b.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):d.length<=b.options.slidesToShow?d.addClass("slick-active").attr("aria-hidden","false"):(f=b.slideCount%b.options.slidesToShow,e=b.options.infinite===!0?b.options.slidesToShow+a:a,b.options.slidesToShow==b.options.slidesToScroll&&b.slideCount-a<b.options.slidesToShow?d.slice(e-(b.options.slidesToShow-f),e+f).addClass("slick-active").attr("aria-hidden","false"):d.slice(e,e+b.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false")),"ondemand"===b.options.lazyLoad&&b.lazyLoad()},b.prototype.setupInfinite=function(){var c,d,e,b=this;if(b.options.fade===!0&&(b.options.centerMode=!1),b.options.infinite===!0&&b.options.fade===!1&&(d=null,b.slideCount>b.options.slidesToShow)){for(e=b.options.centerMode===!0?b.options.slidesToShow+1:b.options.slidesToShow,c=b.slideCount;c>b.slideCount-e;c-=1)d=c-1,a(b.$slides[d]).clone(!0).attr("id","").attr("data-slick-index",d-b.slideCount).prependTo(b.$slideTrack).addClass("slick-cloned");for(c=0;e>c;c+=1)d=c,a(b.$slides[d]).clone(!0).attr("id","").attr("data-slick-index",d+b.slideCount).appendTo(b.$slideTrack).addClass("slick-cloned");b.$slideTrack.find(".slick-cloned").find("[id]").each(function(){a(this).attr("id","")})}},b.prototype.interrupt=function(a){var b=this;a||b.autoPlay(),b.interrupted=a},b.prototype.selectHandler=function(b){var c=this,d=a(b.target).is(".slick-slide")?a(b.target):a(b.target).parents(".slick-slide"),e=parseInt(d.attr("data-slick-index"));return e||(e=0),c.slideCount<=c.options.slidesToShow?(c.setSlideClasses(e),void c.asNavFor(e)):void c.slideHandler(e)},b.prototype.slideHandler=function(a,b,c){var d,e,f,g,j,h=null,i=this;return b=b||!1,i.animating===!0&&i.options.waitForAnimate===!0||i.options.fade===!0&&i.currentSlide===a||i.slideCount<=i.options.slidesToShow?void 0:(b===!1&&i.asNavFor(a),d=a,h=i.getLeft(d),g=i.getLeft(i.currentSlide),i.currentLeft=null===i.swipeLeft?g:i.swipeLeft,i.options.infinite===!1&&i.options.centerMode===!1&&(0>a||a>i.getDotCount()*i.options.slidesToScroll)?void(i.options.fade===!1&&(d=i.currentSlide,c!==!0?i.animateSlide(g,function(){i.postSlide(d)}):i.postSlide(d))):i.options.infinite===!1&&i.options.centerMode===!0&&(0>a||a>i.slideCount-i.options.slidesToScroll)?void(i.options.fade===!1&&(d=i.currentSlide,c!==!0?i.animateSlide(g,function(){i.postSlide(d)}):i.postSlide(d))):(i.options.autoplay&&clearInterval(i.autoPlayTimer),e=0>d?i.slideCount%i.options.slidesToScroll!==0?i.slideCount-i.slideCount%i.options.slidesToScroll:i.slideCount+d:d>=i.slideCount?i.slideCount%i.options.slidesToScroll!==0?0:d-i.slideCount:d,i.animating=!0,i.$slider.trigger("beforeChange",[i,i.currentSlide,e]),f=i.currentSlide,i.currentSlide=e,i.setSlideClasses(i.currentSlide),i.options.asNavFor&&(j=i.getNavTarget(),j=j.slick("getSlick"),j.slideCount<=j.options.slidesToShow&&j.setSlideClasses(i.currentSlide)),i.updateDots(),i.updateArrows(),i.options.fade===!0?(c!==!0?(i.fadeSlideOut(f),i.fadeSlide(e,function(){i.postSlide(e)})):i.postSlide(e),void i.animateHeight()):void(c!==!0?i.animateSlide(h,function(){i.postSlide(e)}):i.postSlide(e))))},b.prototype.startLoad=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.hide(),a.$nextArrow.hide()),a.options.dots===!0&&a.slideCount>a.options.slidesToShow&&a.$dots.hide(),a.$slider.addClass("slick-loading")},b.prototype.swipeDirection=function(){var a,b,c,d,e=this;return a=e.touchObject.startX-e.touchObject.curX,b=e.touchObject.startY-e.touchObject.curY,c=Math.atan2(b,a),d=Math.round(180*c/Math.PI),0>d&&(d=360-Math.abs(d)),45>=d&&d>=0?e.options.rtl===!1?"left":"right":360>=d&&d>=315?e.options.rtl===!1?"left":"right":d>=135&&225>=d?e.options.rtl===!1?"right":"left":e.options.verticalSwiping===!0?d>=35&&135>=d?"down":"up":"vertical"},b.prototype.swipeEnd=function(a){var c,d,b=this;if(b.dragging=!1,b.interrupted=!1,b.shouldClick=b.touchObject.swipeLength>10?!1:!0,void 0===b.touchObject.curX)return!1;if(b.touchObject.edgeHit===!0&&b.$slider.trigger("edge",[b,b.swipeDirection()]),b.touchObject.swipeLength>=b.touchObject.minSwipe){switch(d=b.swipeDirection()){case"left":case"down":c=b.options.swipeToSlide?b.checkNavigable(b.currentSlide+b.getSlideCount()):b.currentSlide+b.getSlideCount(),b.currentDirection=0;break;case"right":case"up":c=b.options.swipeToSlide?b.checkNavigable(b.currentSlide-b.getSlideCount()):b.currentSlide-b.getSlideCount(),b.currentDirection=1}"vertical"!=d&&(b.slideHandler(c),b.touchObject={},b.$slider.trigger("swipe",[b,d]))}else b.touchObject.startX!==b.touchObject.curX&&(b.slideHandler(b.currentSlide),b.touchObject={})},b.prototype.swipeHandler=function(a){var b=this;if(!(b.options.swipe===!1||"ontouchend"in document&&b.options.swipe===!1||b.options.draggable===!1&&-1!==a.type.indexOf("mouse")))switch(b.touchObject.fingerCount=a.originalEvent&&void 0!==a.originalEvent.touches?a.originalEvent.touches.length:1,b.touchObject.minSwipe=b.listWidth/b.options.touchThreshold,b.options.verticalSwiping===!0&&(b.touchObject.minSwipe=b.listHeight/b.options.touchThreshold),a.data.action){case"start":b.swipeStart(a);break;case"move":b.swipeMove(a);break;case"end":b.swipeEnd(a)}},b.prototype.swipeMove=function(a){var d,e,f,g,h,b=this;return h=void 0!==a.originalEvent?a.originalEvent.touches:null,!b.dragging||h&&1!==h.length?!1:(d=b.getLeft(b.currentSlide),b.touchObject.curX=void 0!==h?h[0].pageX:a.clientX,b.touchObject.curY=void 0!==h?h[0].pageY:a.clientY,b.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(b.touchObject.curX-b.touchObject.startX,2))),b.options.verticalSwiping===!0&&(b.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(b.touchObject.curY-b.touchObject.startY,2)))),e=b.swipeDirection(),"vertical"!==e?(void 0!==a.originalEvent&&b.touchObject.swipeLength>4&&a.preventDefault(),g=(b.options.rtl===!1?1:-1)*(b.touchObject.curX>b.touchObject.startX?1:-1),b.options.verticalSwiping===!0&&(g=b.touchObject.curY>b.touchObject.startY?1:-1),f=b.touchObject.swipeLength,b.touchObject.edgeHit=!1,b.options.infinite===!1&&(0===b.currentSlide&&"right"===e||b.currentSlide>=b.getDotCount()&&"left"===e)&&(f=b.touchObject.swipeLength*b.options.edgeFriction,b.touchObject.edgeHit=!0),b.options.vertical===!1?b.swipeLeft=d+f*g:b.swipeLeft=d+f*(b.$list.height()/b.listWidth)*g,b.options.verticalSwiping===!0&&(b.swipeLeft=d+f*g),b.options.fade===!0||b.options.touchMove===!1?!1:b.animating===!0?(b.swipeLeft=null,!1):void b.setCSS(b.swipeLeft)):void 0)},b.prototype.swipeStart=function(a){var c,b=this;return b.interrupted=!0,1!==b.touchObject.fingerCount||b.slideCount<=b.options.slidesToShow?(b.touchObject={},!1):(void 0!==a.originalEvent&&void 0!==a.originalEvent.touches&&(c=a.originalEvent.touches[0]),b.touchObject.startX=b.touchObject.curX=void 0!==c?c.pageX:a.clientX,b.touchObject.startY=b.touchObject.curY=void 0!==c?c.pageY:a.clientY,void(b.dragging=!0))},b.prototype.unfilterSlides=b.prototype.slickUnfilter=function(){var a=this;null!==a.$slidesCache&&(a.unload(),a.$slideTrack.children(this.options.slide).detach(),a.$slidesCache.appendTo(a.$slideTrack),a.reinit())},b.prototype.unload=function(){var b=this;a(".slick-cloned",b.$slider).remove(),b.$dots&&b.$dots.remove(),b.$prevArrow&&b.htmlExpr.test(b.options.prevArrow)&&b.$prevArrow.remove(),b.$nextArrow&&b.htmlExpr.test(b.options.nextArrow)&&b.$nextArrow.remove(),b.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},b.prototype.unslick=function(a){var b=this;b.$slider.trigger("unslick",[b,a]),b.destroy()},b.prototype.updateArrows=function(){var b,a=this;b=Math.floor(a.options.slidesToShow/2),a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&!a.options.infinite&&(a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===a.currentSlide?(a.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):a.currentSlide>=a.slideCount-a.options.slidesToShow&&a.options.centerMode===!1?(a.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):a.currentSlide>=a.slideCount-1&&a.options.centerMode===!0&&(a.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},b.prototype.updateDots=function(){var a=this;null!==a.$dots&&(a.$dots.find("li").removeClass("slick-active").attr("aria-hidden","true"),a.$dots.find("li").eq(Math.floor(a.currentSlide/a.options.slidesToScroll)).addClass("slick-active").attr("aria-hidden","false"))},b.prototype.visibility=function(){var a=this;a.options.autoplay&&(document[a.hidden]?a.interrupted=!0:a.interrupted=!1)},a.fn.slick=function(){var f,g,a=this,c=arguments[0],d=Array.prototype.slice.call(arguments,1),e=a.length;for(f=0;e>f;f++)if("object"==typeof c||"undefined"==typeof c?a[f].slick=new b(a[f],c):g=a[f].slick[c].apply(a[f].slick,d),"undefined"!=typeof g)return g;return a}});
/*! Social Likes v3.1.2 by Artem Sapegin - http://sapegin.github.com/social-likes - Licensed MIT */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a(jQuery)}(function(a,b){"use strict";function c(a,b){this.container=a,this.options=b,this.init()}function d(b,c){this.widget=b,this.options=a.extend({},c),this.detectService(),this.service&&this.init()}function e(a){function b(a,b){return b.toUpper()}var c={},d=a.data();for(var e in d){var f=d[e];"yes"===f?f=!0:"no"===f&&(f=!1),c[e.replace(/-(\w)/g,b)]=f}return c}function f(a,b){return g(a,b,encodeURIComponent)}function g(a,b,c){return a.replace(/\{([^}]+)\}/g,function(a,d){return d in b?c?c(b[d]):b[d]:a})}function h(a,b){var c=l+a;return c+" "+c+"_"+b}function i(b,c){function d(g){"keydown"===g.type&&27!==g.which||a(g.target).closest(b).length||(b.removeClass(m),e.off(f,d),a.isFunction(c)&&c())}var e=a(document),f="click touchstart keydown";e.on(f,d)}function j(a){var b=10;if(document.documentElement.getBoundingClientRect){var c=parseInt(a.css("left"),10),d=parseInt(a.css("top"),10),e=a[0].getBoundingClientRect();e.left<b?a.css("left",b-e.left+c):e.right>window.innerWidth-b&&a.css("left",window.innerWidth-e.right-b+c),e.top<b?a.css("top",b-e.top+d):e.bottom>window.innerHeight-b&&a.css("top",window.innerHeight-e.bottom-b+d)}a.addClass(m)}var k="social-likes",l=k+"__",m=k+"_opened",n="https:"===location.protocol?"https:":"http:",o={facebook:{counterUrl:"https://graph.facebook.com/?id={url}",convertNumber:function(a){return a.share.share_count},popupUrl:"https://www.facebook.com/sharer/sharer.php?u={url}",popupWidth:600,popupHeight:359},twitter:{counters:!1,popupUrl:"https://twitter.com/intent/tweet?url={url}&text={title}",popupWidth:600,popupHeight:250,click:function(){return/[.?:\-–—]\s*$/.test(this.options.title)||(this.options.title+=":"),!0}},mailru:{counterUrl:n+"//connect.mail.ru/share_count?url_list={url}&callback=1&func=?",convertNumber:function(a){for(var b in a)if(a.hasOwnProperty(b))return a[b].shares},popupUrl:"https://connect.mail.ru/share?share_url={url}&title={title}",popupWidth:492,popupHeight:500},vkontakte:{counterUrl:"https://vk.com/share.php?act=count&url={url}&index={index}",counter:function(b,c){var d=o.vkontakte;d._||(d._=[],window.VK||(window.VK={}),window.VK.Share={count:function(a,b){d._[a].resolve(b)}});var e=d._.length;d._.push(c),a.getScript(f(b,{index:e})).fail(c.reject)},popupUrl:"https://vk.com/share.php?url={url}&title={title}",popupWidth:655,popupHeight:450},odnoklassniki:{counterUrl:n+"//connect.ok.ru/dk?st.cmd=extLike&ref={url}&uid={index}",counter:function(b,c){var d=o.odnoklassniki;d._||(d._=[],window.ODKL||(window.ODKL={}),window.ODKL.updateCount=function(a,b){d._[a].resolve(b)});var e=d._.length;d._.push(c),a.getScript(f(b,{index:e})).fail(c.reject)},popupUrl:"https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&service=odnoklassniki&st.shareUrl={url}",popupWidth:580,popupHeight:336},plusone:{counterUrl:n+"//share.yandex.ru/gpp.xml?url={url}&callback=?",convertNumber:function(a){return parseInt(a.replace(/\D/g,""),10)},popupUrl:"https://plus.google.com/share?url={url}",popupWidth:500,popupHeight:550},pinterest:{counterUrl:n+"//api.pinterest.com/v1/urls/count.json?url={url}&callback=?",convertNumber:function(a){return a.count},popupUrl:"https://pinterest.com/pin/create/button/?url={url}&description={title}",popupWidth:740,popupHeight:550}},p={promises:{},fetch:function(b,c,d){p.promises[b]||(p.promises[b]={});var e=p.promises[b];if(!d.forceUpdate&&e[c])return e[c];var g=a.extend({},o[b],d),h=a.Deferred(),i=g.counterUrl&&f(g.counterUrl,{url:c});return i&&a.isFunction(g.counter)?g.counter(i,h):g.counterUrl?a.getJSON(i).done(function(b){try{var c=b;a.isFunction(g.convertNumber)&&(c=g.convertNumber(b)),h.resolve(c)}catch(a){h.reject()}}).fail(h.reject):h.reject(),e[c]=h.promise(),e[c]}};a.fn.socialLikes=function(b){return this.each(function(){var d=a(this),f=d.data(k);f?a.isPlainObject(b)&&f.update(b):(f=new c(d,a.extend({},a.fn.socialLikes.defaults,b,e(d))),d.data(k,f))})},a.fn.socialLikes.defaults={url:window.location.href.replace(window.location.hash,""),title:document.title,counters:!0,zeroes:!1,wait:500,timeout:1e4,popupCheckInterval:500,singleTitle:"Share"},c.prototype={init:function(){this.container.addClass(k),this.single=this.container.hasClass(k+"_single"),this.initUserButtons(),this.countersLeft=0,this.number=0,this.container.on("counter."+k,a.proxy(this.updateCounter,this));var b=this.container.children();this.makeSingleButton(),this.buttons=[],b.each(a.proxy(function(b,c){var e=new d(a(c),this.options);this.buttons.push(e),e.options.counterUrl&&this.countersLeft++},this)),this.options.counters?(this.timer=setTimeout(a.proxy(this.appear,this),this.options.wait),this.timeout=setTimeout(a.proxy(this.ready,this,!0),this.options.timeout)):this.appear()},initUserButtons:function(){!this.userButtonInited&&window.socialLikesButtons&&a.extend(!0,o,socialLikesButtons),this.userButtonInited=!0},makeSingleButton:function(){if(this.single){var b=this.container;b.addClass(k+"_vertical"),b.wrap(a("<div>",{class:k+"_single-w"})),b.wrapInner(a("<div>",{class:k+"__single-container"}));var c=b.parent(),d=a("<div>",{class:h("widget","single")}),e=a(g('<div class="{buttonCls}"><span class="{iconCls}"></span>{title}</div>',{buttonCls:h("button","single"),iconCls:h("icon","single"),title:this.options.singleTitle}));d.append(e),c.append(d),d.on("click",function(){var a=k+"__widget_active";return d.toggleClass(a),d.hasClass(a)?(b.css({left:-(b.width()-d.width())/2,top:-b.height()}),j(b),i(b,function(){d.removeClass(a)})):b.removeClass(m),!1}),this.widget=d}},update:function(b){if(b.forceUpdate||b.url!==this.options.url){this.number=0,this.countersLeft=this.buttons.length,this.widget&&this.widget.find("."+k+"__counter").remove(),a.extend(this.options,b);for(var c=0;c<this.buttons.length;c++)this.buttons[c].update(b)}},updateCounter:function(a,b,c){c=c||0,(c||this.options.zeroes)&&(this.number+=c,this.single&&this.getCounterElem().text(this.number)),this.countersLeft--,0===this.countersLeft&&(this.appear(),this.ready())},appear:function(){this.container.addClass(k+"_visible")},ready:function(a){this.timeout&&clearTimeout(this.timeout),this.container.addClass(k+"_ready"),a||this.container.trigger("ready."+k,this.number)},getCounterElem:function(){var b=this.widget.find("."+l+"counter_single");return b.length||(b=a("<span>",{class:h("counter","single")}),this.widget.append(b)),b}},d.prototype={init:function(){this.detectParams(),this.initHtml(),setTimeout(a.proxy(this.initCounter,this),0)},update:function(b){a.extend(this.options,{forceUpdate:!1},b),this.widget.find("."+k+"__counter").remove(),this.initCounter()},detectService:function(){var b=this.widget.data("service");if(!b){for(var c=this.widget[0],d=c.classList||c.className.split(" "),e=0;e<d.length;e++){var f=d[e];if(o[f]){b=f;break}}if(!b)return}this.service=b,a.extend(this.options,o[b])},detectParams:function(){var a=this.widget.data();if(a.counter){var b=parseInt(a.counter,10);isNaN(b)?this.options.counterUrl=a.counter:this.options.counterNumber=b}a.title&&(this.options.title=a.title),a.url&&(this.options.url=a.url)},initHtml:function(){var b=this.options,c=this.widget,d=c.find("a");d.length&&this.cloneDataAttrs(d,c);var e=a("<span>",{class:this.getElementClassNames("button"),html:c.html()});if(b.clickUrl){var g=f(b.clickUrl,{url:b.url,title:b.title}),h=a("<a>",{href:g});this.cloneDataAttrs(c,h),c.replaceWith(h),this.widget=c=h}else c.on("click",a.proxy(this.click,this));c.removeClass(this.service),c.addClass(this.getElementClassNames("widget")),e.prepend(a("<span>",{class:this.getElementClassNames("icon")})),c.empty().append(e),this.button=e},initCounter:function(){if(this.options.counters)if(this.options.counterNumber)this.updateCounter(this.options.counterNumber);else{var b={counterUrl:this.options.counterUrl,forceUpdate:this.options.forceUpdate};p.fetch(this.service,this.options.url,b).always(a.proxy(this.updateCounter,this))}},cloneDataAttrs:function(a,b){var c=a.data();for(var d in c)c.hasOwnProperty(d)&&b.data(d,c[d])},getElementClassNames:function(a){return h(a,this.service)},updateCounter:function(b){b=parseInt(b,10)||0;var c={class:this.getElementClassNames("counter"),text:b};b||this.options.zeroes||(c.class+=" "+k+"__counter_empty",c.text="");var d=a("<span>",c);this.widget.append(d),this.widget.trigger("counter."+k,[this.service,b])},click:function(b){var c=this.options,d=!0;if(a.isFunction(c.click)&&(d=c.click.call(this,b)),d){var e=f(c.popupUrl,{url:c.url,title:c.title});e=this.addAdditionalParamsToUrl(e),this.openPopup(e,{width:c.popupWidth,height:c.popupHeight})}return!1},addAdditionalParamsToUrl:function(b){var c=a.param(a.extend(this.widget.data(),this.options.data));if(a.isEmptyObject(c))return b;var d=b.indexOf("?")===-1?"?":"&";return b+d+c},openPopup:function(c,d){var e=window.screenLeft!==b?window.screenLeft:screen.left,f=window.screenTop!==b?window.screenTop:screen.top,g=window.innerWidth?window.innerWidth:document.documentElement.clientWidth?document.documentElement.clientWidth:screen.width,h=window.innerHeight?window.innerHeight:document.documentElement.clientHeight?document.documentElement.clientHeight:screen.height,i=Math.round(g/2-d.width/2)+e,j=0;h>d.height&&(j=Math.round(h/3-d.height/2)+f);var l=window.open(c,"sl_"+this.service,"left="+i+",top="+j+",width="+d.width+",height="+d.height+",personalbar=0,toolbar=0,scrollbars=1,resizable=1");if(l){l.focus(),this.widget.trigger("popup_opened."+k,[this.service,l]);var m=setInterval(a.proxy(function(){l.closed&&(clearInterval(m),this.widget.trigger("popup_closed."+k,this.service))},this),this.options.popupCheckInterval)}else location.href=c}},a(function(){a("."+k).socialLikes()})});
// Generated by CoffeeScript 1.9.2
/**
@license Sticky-kit v1.1.2 | WTFPL | Leaf Corcoran 2015 | http://leafo.net
 */
(function() {
  var $, win;
  $ = this.jQuery || window.jQuery;
  win = $(window);
  $.fn.stick_in_parent = function(opts) {
    var doc, elm, enable_bottoming, fn, i, inner_scrolling, len, manual_spacer, offset_top, parent_selector, recalc_every, sticky_class;
    if (opts == null) {
      opts = {};
    }
    sticky_class = opts.sticky_class, inner_scrolling = opts.inner_scrolling, recalc_every = opts.recalc_every, parent_selector = opts.parent, offset_top = opts.offset_top, manual_spacer = opts.spacer, enable_bottoming = opts.bottoming;
    if (offset_top == null) {
      offset_top = 0;
    }
    if (parent_selector == null) {
      parent_selector = void 0;
    }
    if (inner_scrolling == null) {
      inner_scrolling = true;
    }
    if (sticky_class == null) {
      sticky_class = "is_stuck";
    }
    doc = $(document);
    if (enable_bottoming == null) {
      enable_bottoming = true;
    }
    fn = function(elm, padding_bottom, parent_top, parent_height, top, height, el_float, detached) {
      var bottomed, detach, fixed, last_pos, last_scroll_height, offset, parent, recalc, recalc_and_tick, recalc_counter, spacer, tick;
      if (elm.data("sticky_kit")) {
        return;
      }
      elm.data("sticky_kit", true);
      last_scroll_height = doc.height();
      parent = elm.parent();
      if (parent_selector != null) {
        parent = parent.closest(parent_selector);
      }
      if (!parent.length) {
        throw "failed to find stick parent";
      }
      fixed = false;
      bottomed = false;
      spacer = manual_spacer != null ? manual_spacer && elm.closest(manual_spacer) : $("<div />");
      if (spacer) {
        spacer.css('position', elm.css('position'));
      }
      recalc = function() {
        var border_top, padding_top, restore;
        if (detached) {
          return;
        }
        last_scroll_height = doc.height();
        border_top = parseInt(parent.css("border-top-width"), 10);
        padding_top = parseInt(parent.css("padding-top"), 10);
        padding_bottom = parseInt(parent.css("padding-bottom"), 10);
        parent_top = parent.offset().top + border_top + padding_top;
        parent_height = parent.height();
        if (fixed) {
          fixed = false;
          bottomed = false;
          if (manual_spacer == null) {
            elm.insertAfter(spacer);
            spacer.detach();
          }
          elm.css({
            position: "",
            top: "",
            width: "",
            bottom: ""
          }).removeClass(sticky_class);
          restore = true;
        }
        top = elm.offset().top - (parseInt(elm.css("margin-top"), 10) || 0) - offset_top;
        height = elm.outerHeight(true);
        el_float = elm.css("float");
        if (spacer) {
          spacer.css({
            width: elm.outerWidth(true),
            height: height,
            display: elm.css("display"),
            "vertical-align": elm.css("vertical-align"),
            "float": el_float
          });
        }
        if (restore) {
          return tick();
        }
      };
      recalc();
      if (height === parent_height) {
        return;
      }
      last_pos = void 0;
      offset = offset_top;
      recalc_counter = recalc_every;
      tick = function() {
        var css, delta, recalced, scroll, will_bottom, win_height;
        if (detached) {
          return;
        }
        recalced = false;
        if (recalc_counter != null) {
          recalc_counter -= 1;
          if (recalc_counter <= 0) {
            recalc_counter = recalc_every;
            recalc();
            recalced = true;
          }
        }
        if (!recalced && doc.height() !== last_scroll_height) {
          recalc();
          recalced = true;
        }
        scroll = win.scrollTop();
        if (last_pos != null) {
          delta = scroll - last_pos;
        }
        last_pos = scroll;
        if (fixed) {
          if (enable_bottoming) {
            will_bottom = scroll + height + offset > parent_height + parent_top;
            if (bottomed && !will_bottom) {
              bottomed = false;
              elm.css({
                position: "fixed",
                bottom: "",
                top: offset
              }).trigger("sticky_kit:unbottom");
            }
          }
          if (scroll < top) {
            fixed = false;
            offset = offset_top;
            if (manual_spacer == null) {
              if (el_float === "left" || el_float === "right") {
                elm.insertAfter(spacer);
              }
              spacer.detach();
            }
            css = {
              position: "",
              width: "",
              top: ""
            };
            elm.css(css).removeClass(sticky_class).trigger("sticky_kit:unstick");
          }
          if (inner_scrolling) {
            win_height = win.height();
            if (height + offset_top > win_height) {
              if (!bottomed) {
                offset -= delta;
                offset = Math.max(win_height - height, offset);
                offset = Math.min(offset_top, offset);
                if (fixed) {
                  elm.css({
                    top: offset + "px"
                  });
                }
              }
            }
          }
        } else {
          if (scroll > top) {
            fixed = true;
            css = {
              position: "fixed",
              top: offset
            };
            css.width = elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px";
            elm.css(css).addClass(sticky_class);
            if (manual_spacer == null) {
              elm.after(spacer);
              if (el_float === "left" || el_float === "right") {
                spacer.append(elm);
              }
            }
            elm.trigger("sticky_kit:stick");
          }
        }
        if (fixed && enable_bottoming) {
          if (will_bottom == null) {
            will_bottom = scroll + height + offset > parent_height + parent_top;
          }
          if (!bottomed && will_bottom) {
            bottomed = true;
            if (parent.css("position") === "static") {
              parent.css({
                position: "relative"
              });
            }
            return elm.css({
              position: "absolute",
              bottom: padding_bottom,
              top: "auto"
            }).trigger("sticky_kit:bottom");
          }
        }
      };
      recalc_and_tick = function() {
        recalc();
        return tick();
      };
      detach = function() {
        detached = true;
        win.off("touchmove", tick);
        win.off("scroll", tick);
        win.off("resize", recalc_and_tick);
        $(document.body).off("sticky_kit:recalc", recalc_and_tick);
        elm.off("sticky_kit:detach", detach);
        elm.removeData("sticky_kit");
        elm.css({
          position: "",
          bottom: "",
          top: "",
          width: ""
        });
        parent.position("position", "");
        if (fixed) {
          if (manual_spacer == null) {
            if (el_float === "left" || el_float === "right") {
              elm.insertAfter(spacer);
            }
            spacer.remove();
          }
          return elm.removeClass(sticky_class);
        }
      };
      win.on("touchmove", tick);
      win.on("scroll", tick);
      win.on("resize", recalc_and_tick);
      $(document.body).on("sticky_kit:recalc", recalc_and_tick);
      elm.on("sticky_kit:detach", detach);
      return setTimeout(tick, 0);
    };
    for (i = 0, len = this.length; i < len; i++) {
      elm = this[i];
      fn($(elm));
    }
    return this;
  };
}).call(this);