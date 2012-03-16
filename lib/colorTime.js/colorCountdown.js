/*!
 * jquery.colorCountdown.js - Colorful Countdown Plugin
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

    var pluginName = 'colorCountdown',
        defaults = {
            colorCircle: {
                backgroundFillStyle: '#666666',
                fillStyle: '#019ad2',
                strokeStyle: '#019ad2',
                lineWidth: 4,
                fill: true,
                stroke : false
            },
            value : null
        };

    function Plugin( element, options ) {
        this.element = $(element);
        this.settings = $.extend(true, {}, defaults, options) ;
        this.endDate = null;
        this.duration = null;
        this.display = null;
        this.colorCircle = null;
        this.interval = null;
        this.init();
    }

    Plugin.prototype.init = function () {
        this.display = $('<div>').attr('class', 'display')
            .attr('style', 'position:absolute;width:100%;color: #F5F5F5;text-align:center;text-shadow:4px 4px 5px #333333;');
        this.colorCircle = $('<div>').attr('class', 'colorCircle').attr('style', 'width:100%; height:100%;');
        this.element.attr('style', 'position:relative; display: block; overflow:hidden; float:left;')
            .append(this.display, this.colorCircle);
        this.colorCircle.colorCircle(this.settings.colorCircle);
        this.setValue(this.settings.value);
        return this;
    };

    Plugin.prototype.setValue = function(value) {
        if(jQuery.type(value) === "date") {
            this.endDate = value;
            var now = new Date();
            this.duration = (this.endDate.getTime()-now.getTime())/1000;
        } else if(jQuery.type(value) === "number") {
            this.duration = value;
            this.endDate = new Date();
            this.endDate.setTime(this.endDate.getTime()+this.duration*1000);
        } else {
            return;
        }
        this.reset();
        return this;
    };

    Plugin.prototype.start = function() {
        var base = this;
        if(!this.interval) {
            this.interval = setInterval(function(){
                base.refresh();
            },1000);
        }
        return this;
    };

    Plugin.prototype.stop = function() {
        if(this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        return this;
    };

    Plugin.prototype.restart = function() {
        this.stop();
        this.start();
        return this;
    };

    Plugin.prototype.reset = function() {
        this.colorCircle.colorCircle().setValue(0);
        this.colorCircle.colorCircle().settings.fillStyle = this.settings.colorCircle.fillStyle;
        this.display.html('');
        return this;
    };

    Plugin.prototype.refresh = function() {
        var base = this,
            currentTime = new Date();
        if(this.endDate) {
            var diff = parseInt((this.endDate.getTime() - currentTime.getTime()) /1000),
                negative = diff < 0;
            diff = Math.abs(diff);
            var h = parseInt((diff/3600)%24),
                m = parseInt((diff/60)%60),
                s = parseInt(diff%60),
                label = jQuery.map([h, m ,s], function(val, index){
                    // filtre les heures
                    if(val == 0 && index == 0 && base.duration <= 3600)
                        return null;
                    return val <10 ? '0'+val : val;
                }).join(':');
            if(negative) {
                this.colorCircle.colorCircle().settings.fillStyle = '#BC3603';
            }
            // Calculating the current angle:
            var angle = (360/this.duration)*(diff);
            this.colorCircle.colorCircle().setValue(angle);
            // Setting the text inside of the display element, inserting a leading zero if needed:
            this.display.html(label);
        }
        return this;
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