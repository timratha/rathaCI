define([
    'portal/_base/store/PortalStore',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dojo/text!./templates/ContentRotator.html',
    "dojox/widget/AutoRotator",
    "dojox/widget/rotator/Fade",
    "dojox/widget/rotator/Pan",
    "dojox/widget/rotator/PanFade",
    "dojox/widget/rotator/Slide",
    "dojox/widget/rotator/Wipe",
    "dijit/layout/ContentPane",
    "dijit/form/ToggleButton",
    "dijit/form/Button",
    "dojo/topic",
    "dojo/mouse",
    "dijit/form/Form",
    'dijit/_Container',
    "dijit/form/Select",
    'xstyle/css!./css/ContentRotator.css'
], function (PortalStore,WidgetsInTemplateMixin, TemplatedMixin, WidgetBase, declare, template, AutoRotator, Fade, Pan, PanFade,
             Slide, Wipe, ContentPane, ToggleButton, Button, topic, mouse, Form, Container, Select) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        templateString: template,
        baseClass: "contentRotator",
        version: "0.0.1",

        // ANIMATION:
        // fade, crossFade
        // pan, panDown, panRight, panUp, panLeft
        // panFade, panFadeDown, panFadeRight, panFadeUp, panFadeLeft
        // slideDown, slideRight, slideUp, slideLeft
        // wipeDown, wipeRight, wipeUp, wipeLeft

        width: 960,
        height: 384,
        duration: 2000,
        animation: "crossFade",
        declaredClass: "",
        content: [
            "<div style='background: #ffff99;'><div style='padding:10px 20px;'><h1>Lorem ipsum</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent pretium eros vel faucibus imperdiet. Cras nec sodales felis. Praesent in viverra nibh, vel porta nisi. Sed tincidunt rutrum rhoncus. Nam ac tempus elit. Fusce ut consequat nibh, a imperdiet lectus. Fusce vel erat tempor ipsum pretium dapibus. Fusce ante tellus, laoreet non pellentesque et, auctor et turpis. Ut lobortis vulputate lobortis. Praesent elementum lectus ac nisi condimentum, sit amet placerat tellus pulvinar.</p></div></div>",
            "<div style='background: #ffcc99;'><div style='padding:10px 20px;'><h1>Praesent nec</h1><p>Praesent nec venenatis mi, sit amet fringilla ante. Phasellus commodo, lectus bibendum dictum varius, nisi neque condimentum lectus, nec ullamcorper nulla velit non tortor. Aliquam eu urna et nulla sollicitudin dictum ac efficitur dolor. Etiam feugiat dui dapibus sapien auctor rhoncus. Vivamus et mauris nisl. Suspendisse sed lacus id sapien congue cursus. Nullam quam quam, pellentesque commodo malesuada nec, molestie at sapien. Aenean non nulla id mauris luctus molestie. Morbi feugiat hendrerit mi, a rhoncus ipsum venenatis eget. Phasellus accumsan massa nec ante ornare, sed finibus dolor ornare. Morbi nec dignissim mauris, a dictum sapien. Nullam sit amet malesuada odio. Quisque iaculis ac est eu tempor. Fusce a varius magna. Aliquam ornare, eros vitae tristique maximus, nunc lacus vehicula urna, a viverra risus felis id lacus.</p></div></div>",
            "<div style='background: #ff9999;'><div style='padding:10px 20px;'><h1>Aliquam nibh</h1><p>Aliquam nibh lectus, dapibus id felis eget, facilisis malesuada arcu. Sed erat mauris, placerat id posuere in, mollis vel odio. Praesent sed neque eget est condimentum ultricies. Nunc sit amet consectetur diam. Praesent non velit vitae leo placerat pharetra. Donec quis lobortis quam. Duis nisi dolor, mattis id quam at, vehicula commodo nulla. Cras ut euismod nibh. Sed a efficitur libero, facilisis lacinia nisl. Proin eget risus volutpat, tristique diam at, consequat urna. Morbi at lorem non turpis varius sagittis. Proin venenatis neque eu nulla eleifend, eu volutpat ipsum tempus. Phasellus elementum semper metus, id tempor augue ornare eu. Aenean gravida libero sit amet lectus ornare, at finibus sem accumsan. Suspendisse congue enim sapien, sed pulvinar nunc tincidunt at. Nunc id quam lorem.</p></div></div>",
            "<div style='background: #99ffcc;'><div style='padding:10px 20px;'><h1>Sed finibus</h1><p>Sed finibus sodales tincidunt. Phasellus euismod molestie magna at ornare. In a condimentum risus. Morbi eget arcu nisl. Quisque nec nulla et ante fermentum mollis. Integer at efficitur leo. Sed malesuada ultricies semper.</p></div></div>",
            "<div style='background: #99ffff;'><div style='padding:10px 20px;'><h1>Fusce mauris</h1><p>Fusce mauris metus, vehicula eu pharetra quis, porttitor sed magna. In a mi non est euismod dapibus. In sed dolor at urna lacinia tempor et eu mauris. Ut sit amet ex sit amet risus fermentum luctus. Quisque auctor convallis varius. Duis a diam imperdiet, auctor libero sit amet, pulvinar velit. Curabitur nec sem sit amet lectus consequat aliquam. Sed finibus augue ac enim consectetur, eu finibus augue elementum. Ut ultrices eros sapien.</p></div></div>"
        ],

        _idx: 0,
        _manualChange: false,
        _autoRotator: null,

        postMixInProperties: function () {
            this.inherited(arguments);
        },

        buildRendering: function () {
            this.inherited(arguments);
        },

        postCreate: function () {
            if(typeof this.content=="string"){
                this.content = JSON.parse(this.content)
            }
            this.inherited(arguments);
            if(PortalStore.users.checkPermission('demo.widget.ContentRotator.arrow')){
                this._createArrowButtons();
            }
            if(PortalStore.users.checkPermission('demo.widget.ContentRotator.pager')){
                this._createPager();
            }
            this._createRotator();
            this._setMouseEvents();
        },

        startup: function () {
            this.inherited(arguments);
        },

        _createArrowButtons: function () {
            var _t = this;

            var prevButton = new Button({
                label: "<span class='icon-chevron-left'></span>"
            });
            prevButton.on("click", function () {
                _t.prevPage();
            });
            prevButton.placeAt(this.prevAttach);
            prevButton.startup();

            var nextButton = new Button({
                label: "<span class='icon-chevron-right'></span>"
            });
            nextButton.on("click", function () {
                _t.nextPage();
            });
            nextButton.placeAt(this.nextAttach);
            nextButton.startup();
        },

        _createPager: function () {
            var _t = this;

            this.pagerButtons = [];
            for (var i = 0; i < this.content.length; i++) {
                this.pagerButtons[i] = new ToggleButton({
                    value: i
                });
                this.pagerButtons[i].on("click", function () {
                    _t.goToPage(this.value);
                });
                this.pagerButtons[i].placeAt(this.buttonsAttach);
                this.pagerButtons[i].startup();
            }

            if (this.pagerButtons[0]) {
                this.pagerButtons[0].set("checked", true);
            }
        },

        _createRotator: function () {
            var _t = this;

            var panes = [];
            for (var i = 0; i < this.content.length; i++) {
                panes.push({
                    className: "pane",
                    innerHTML: this.content[i]
                });
            }

            this._autoRotator = new AutoRotator({
                duration: this.duration,
                transition: "dojox.widget.rotator." + this.animation,
                panes: panes
            }, this.rotatorAttach);

            this._autoRotator.resize(this.width, this.height);

            topic.subscribe(this._autoRotator.id + "/rotator/update", function (event) {
                if (event == "onBeforeTransition") {
                    _t._checkPagerButton();
                } else if (event == "onAfterTransition") {
                    _t._getCurrentPage();
                }
            });
        },

        _setMouseEvents: function () {
            var _t = this;

            this.on(mouse.enter, function (event) {
                _t.suspend();
            });

            this.on(mouse.leave, function (event) {
                _t.resume();
            });
        },

        _checkPagerButton: function () {
            if (this._manualChange) {
                this._manualChange = false;
            } else {
                this._idx = (this._idx + 1) % this.pagerButtons.length;
            }
            for (var i = 0; i < this.pagerButtons.length; i++) {
              if(this.pagerButtons[i]){this.pagerButtons[i].set("checked", false)};
            }
            if (this.pagerButtons[this._idx]) {
                if(this.pagerButtons[this._idx]){this.pagerButtons[this._idx].set("checked", true)};
            }
        },

        _getCurrentPage: function () {
            this._idx = this._autoRotator.idx;
        },

        prevPage: function () {
            this._idx = Math.abs((this._idx - 1 + this.pagerButtons.length) % this.pagerButtons.length);
            this._manualChange = true;
            this._autoRotator.prev();
        },

        nextPage: function () {
            this._idx = (this._idx + 1) % this.pagerButtons.length;
            this._manualChange = true;
            this._autoRotator.next();
        },

        goToPage: function (page) {
            this._idx = page;
            this._manualChange = true;
            this._autoRotator.go(page);
        },

        // AutoRotator._signals[0] modification
        suspend: function () {
            if (!this._autoRotator.wfe) {
                var t = this._autoRotator._endTime,
                    n = this._autoRotator._now();
                this._autoRotator._suspended = true;
                this._autoRotator._resetTimer();
                this._autoRotator._resumeDuration = t > n ? t - n : 0.01;
            }
        },

        // AutoRotator._signals[1] modification
        resume: function () {
            this._autoRotator._suspended = false;
            if (this._autoRotator.playing && !this._autoRotator.wfe) {
                this._autoRotator.play(true);
            }
        },

        getConfigSchema: function (){ return[
            {
                name: 'label',
                type: 'string',
                help: "Set the title for the widget",
                label: "title",
                defaultValue: this.label
            },
            {
                name: 'width',
                defaultValue: this.width,
                label: 'Rotator width',
                help: 'Width in pixels',
                type: 'number',
                constraints: {
                    min: 200,
                    max: 1500
                }
            },
            {
                name: 'height',
                defaultValue: this.height,
                label: 'Rotator height',
                help: 'Height in pixels',
                type: 'number',
                constraints: {
                    min: 100,
                    max: 750
                }
            },
            {
                name: 'duration',
                defaultValue: this.duration,
                label: 'Slides duration',
                help: 'Duration in milliseconds',
                type: 'number',
                constraints: {
                    min: 500,
                    max: 30000
                }
            },
            {
                name: 'animation',
                label: 'Transition animation',
                help: 'Choose an animation:' +
                '<br>fade, crossFade' +
                '<br>pan, panDown, panRight, panUp, panLeft' +
                '<br>panFade, panFadeDown, panFadeRight, panFadeUp, panFadeLeft' +
                '<br>slideDown, slideRight, slideUp, slideLeft' +
                '<br>wipeDown, wipeRight, wipeUp, wipeLeft',
                type: 'string',
                defaultValue: this.animation
            },
            {
                name: 'content',
                label: 'Slides contents',
                help: 'Html content in string array',
                type: 'json',
                defaultValue: this.content
            }
            ]

            /*,

             configForm: declare([Form, Container],{

             postCreate:function(){
             this.addChild(new Select({
             name: 'animation',
             options: [
             { label: "fade", value: "fade" },
             { label: "crossFade", value: "crossFade" },
             { label: "pan", value: "pan" },
             { label: "panDown", value: "panDown" },
             { label: "panRight", value: "panRight" },
             { label: "panUp", value: "panUp" },
             { label: "panLeft", value: "panLeft" },
             { label: "panFade", value: "panFade" },
             { label: "panFadeDown", value: "panFadeDown" },
             { label: "panFadeRight", value: "panFadeRight" },
             { label: "panFadeUp", value: "panFadeUp" },
             { label: "panFadeLeft", value: "panFadeLeft" },
             { label: "slideDown", value: "slideDown" },
             { label: "slideRight", value: "slideRight" },
             { label: "slideUp", value: "slideUp" },
             { label: "slideLeft", value: "slideLeft" },
             { label: "wipeDown", value: "wipeDown" },
             { label: "wipeRight", value: "wipeRight" },
             { label: "wipeUp", value: "wipeUp" },
             { label: "wipeLeft", value: "wipeLeft" }
             ]
             }));
             }
             })*/
        },
        resize: function (dim) {
            this.inherited(arguments);
            if(dim){
                this._autoRotator.resize(dim.w, dim.h);
            }
        }
    });
});
