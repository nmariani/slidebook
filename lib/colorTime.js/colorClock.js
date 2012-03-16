/*!
 * jquery.colorClock.js - Colorful Clock Plugin
 *
 * Copyright (c) 2012 Nathanaël Mariani
 *
 * Licensed under MIT
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Launch  : March 2012
 * Version : 1.0
 * Released: Wednesday 14th March, 2012
 */
;(function ( $, window, document, undefined ) {

    var pluginName = 'colorClock',
        defaults = {
            colorCircle: {
                backgroundFillStyle: '#666666',
                fillStyle: '#019ad2',
                strokeStyle: '#019ad2',
                lineWidth: 4,
                fill: false,
                stroke : true
            },
            items : {
                hours:{},
                minutes:{},
                seconds:{}
            },
            fromDate : null
        };

    function Plugin( element, options ) {
        this.element = $(element);
        this.settings = $.extend(true, {}, defaults, options) ;
        this.settings.items.hours = $.extend({}, defaults.colorCircle, this.settings.items.hours);
        this.settings.items.minutes = $.extend({}, defaults.colorCircle, this.settings.items.minutes);
        this.settings.items.seconds = $.extend({}, defaults.colorCircle, this.settings.items.seconds );
        this.items = {};
        this.init();
    }

    Plugin.prototype.init = function () {
        var base = this;

        if(jQuery.type(this.settings.fromDate)!=='date')
            this.settings.fromDate = null;

        $.each(this.settings.items, function(item, settings) {
            switch(item) {
                case 'hours':
                case 'minutes':
                case 'seconds':
                    var display = $('<div>').attr('class', 'display')
                        .attr('style', 'position:absolute;width:100%;line-height:50px;color: #F5F5F5;text-align:center;text-shadow:4px 4px 5px #333333;');
                    var colorCircle = $('<div>').attr('class', 'colorCircle');
                    var container = $('<div>').attr('class', 'colorClock '+item)
                            .attr('style', 'position:relative; display: none; overflow:hidden; float:left;')
                            .append(display).append(colorCircle);
                    base.element.append(container);
                    colorCircle.colorCircle(settings);
                    base.items[item] = {
                        container :  container,
                        display :  display,
                        colorCircle :  colorCircle
                    };
                default:
                    break;
            }
        });

        this.refresh();
        if(!this.settings.fromDate) {
            $.each(this.items, function(index, item) {
                item.container.fadeIn();
            });
        }
    };

    Plugin.prototype.start = function() {
        var base = this;
        setInterval(function(){
            base.refresh();
        },1000);
    };

    Plugin.prototype.refresh = function() {
        var currentTime = new Date();
        if(this.settings.fromDate) {
            var diff = parseInt((currentTime.getTime() - this.settings.fromDate.getTime()) /1000);
            var h = parseInt((diff/3600)%24),
                m = parseInt((diff/60)%60),
                s = parseInt(diff%60);
        } else {
            var h = currentTime.getHours(),
            m = currentTime.getMinutes(),
            s = currentTime.getSeconds();
        }
        if(this.items.seconds)
            this.refreshItem(this.items.seconds, s, 60);
        if(this.items.minutes)
            this.refreshItem(this.items.minutes, m, 60);
        if(this.items.hours)
            this.refreshItem(this.items.hours, h, 24);
    };

    Plugin.prototype.refreshItem = function (item, current, total) {
        if(current>0){
            if(current==1 && !item.container.is(':visible'))
                item.container.fadeIn();
            // Calculating the current angle:
            var angle = (360/total)*(current);
            item.colorCircle.colorCircle().setValue(angle);
            // Setting the text inside of the display element, inserting a leading zero if needed:
            item.display.html(current<10?'0'+current:current);
        }
    };

    $.fn[pluginName] = function ( options ) {
        this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
            }
        });
        if(this.length==1)
            return this.data('plugin_' + pluginName);
        return this;
    }

})(jQuery, window, document);