/*!
 * jquery.colorCircle.js - Colorful Circle Plugin
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

    var pluginName = 'colorCircle',
        defaults = {
            backgroundFillStyle: '#666666',
            fillStyle: '#019ad2',
            strokeStyle: '#019ad2',
            lineWidth: 4,
            fill: true,
            stroke : true,
            value : 0
        };

    function Plugin( element, options ) {
        this.element = $(element);
        this.settings = $.extend( {}, defaults, options) ;
        this.init();
    }

    Plugin.prototype.init = function () {
        this.element.append(
            $('<canvas>')
                .attr('width', this.element.width() || 50)
                .attr('height', this.element.height() || 50)
        );
        this._canvas = this.element.find('canvas').get(0);
        this._context = this._canvas.getContext("2d");
        this._context.lineWidth = this.settings.lineWidth;
        this._context.fillStyle = this.settings.fillStyle;
        this._context.strokeStyle = this.settings.strokeStyle;
        this.setValue(this.settings.value);
    };
    Plugin.prototype.setValue = function (value) {
        if($.isNumeric(value)) {
            value = parseInt(value);
            switch(value){
                case 0:
                    value = 360;
                    break;
                case 360:
                    value = 0;
                    break;
                default:
                    break;
            }

            this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

            var centerX = this._canvas.width/2;
            var centerY = this._canvas.height/2;
            var radius = Math.min(centerX, centerY) - Math.ceil(this.settings.lineWidth/2);
            var startAngle = 0;
            var endAngle = Math.PI*2;
            var antiClockwise = false;

            this._context.fillStyle = this.settings.backgroundFillStyle;
            this._context.beginPath();
            this._context.arc(centerX, centerY, radius, startAngle, endAngle, antiClockwise);
            this._context.lineTo(radius, radius);
            this._context.closePath();
            this._context.fill();

            startAngle = Math.PI*1.5;
            endAngle = (value) * (Math.PI / 180) - Math.PI*0.5;
            this._context.fillStyle = this.settings.fillStyle;
            this._context.beginPath();
            this._context.arc(centerX, centerY, radius, startAngle, endAngle, antiClockwise);
            if(this.settings.fill) {
                this._context.lineTo(radius, radius);
                this._context.fill();
            }
            if(this.settings.stroke) {
                this._context.stroke();
            }
            this._context.closePath();
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