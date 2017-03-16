//TODO
define([
    'dstore/Memory',
    'dojo/_base/declare',
    'dstore/Trackable'
], function(Memory, declare, Trackable) {
    return declare([Memory, Trackable],{
        data:[
            {
                layoutType:"portal/layouts/FreeLayout"
            },
            {
                layoutType:"portal/layouts/GridLayout"
            },
            {
                layoutType:"portal/layouts/RasterLayout"
            }
        ]
    })
});