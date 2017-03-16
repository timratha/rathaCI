define(["./highstock"], function(){
// encapsulated variables


    if(!!window.Highcharts){
        return;
    }

    (function (H) {
        H.wrap(H.Legend.prototype, 'positionCheckboxes', function (p, scrollOffset) {
            var alignAttr = this.group.alignAttr,
                translateY,
                clipHeight = this.clipHeight || this.legendHeight;

            if (alignAttr) {
                translateY = alignAttr.translateY;
                H.each(this.allItems, function (item) {
                    var checkbox = item.checkbox,
                        top;

                    if (checkbox) {
                        top = (translateY + checkbox.y + (scrollOffset || 0) + 3);
                        H.css(checkbox, {
                            left: (alignAttr.translateX + checkbox.x - 20) +  'px',
                            top: top + 'px',
                            display: top > translateY - 6 && top < translateY + clipHeight - 6 ? '' : 'none'
                        });
                    }
                });
            }
        });
    })(Highcharts);


});
