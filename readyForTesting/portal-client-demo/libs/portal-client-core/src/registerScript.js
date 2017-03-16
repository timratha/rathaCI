define([
    './_base/common/Register',
    './layouts/GridLayout',
    './layouts/FreeLayout',
    './layouts/RasterLayout'
], function (
    Register,
    GridLayout,
    FreeLayout,
    RasterLayout
) {

    Register.layout("portal/layout/GridLayout", GridLayout);
    Register.layout("portal/layout/FreeLayout", FreeLayout);
    Register.layout("portal/layout/RasterLayout", RasterLayout);
});
