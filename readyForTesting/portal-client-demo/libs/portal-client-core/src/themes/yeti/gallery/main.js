/*
    :copyright: Copyright 2012 Martin Pengelly-Phillips
    :license: See LICENSE.txt.
*/

define([
    'require'
],

function (require) {
    var app = {};

    require(['yeti', './Gallery', 'dojo/domReady!'],
        function (yeti, Gallery) {
            app = new Gallery();
            app.placeAt(document.body);
            app.startup();
        }
    );
});

