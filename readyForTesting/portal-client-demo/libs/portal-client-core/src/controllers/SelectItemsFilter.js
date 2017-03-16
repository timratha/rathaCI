define([
    'dijit/Menu',
    'dijit/CheckedMenuItem',
    'dijit/MenuSeparator',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/dom-class',
    'dojo/string',
    'dojo/on',
    './ClearTextMixin',
    'dojo/dom-construct',
    'dijit/form/TextBox',
    'dojo/_base/declare',
    "dojo/i18n!./nls/SelectItemsFilter",
    'xstyle/css!./css/SelectItemsFilter.css'
],function(Menu, CheckedMenuItem, MenuSeparator, lang, array, domClass, string, on, ClearTextMixin, domConstruct, TextBox, declare, nls){

// summary: mixin can use for filter CheckedMultiSelect popup list items
//    this mixin just filter the items already showed in list, not support case like lazying-load.

    return declare(null,{

        // queryExpr: String
        //		This specifies what query is sent to the data store,
        //		based on what the user has typed.  Changing this expression will modify
        //		whether the results are only exact matches, a "starting with" match,
        //		etc.
        //		`${0}` will be substituted for the user text.
        //		`*` is used for wildcards.
        //		`${0}*` means "starts with", `*${0}*` means "contains", `${0}` means "is"
        queryExpr: "*${0}*",

        // ignoreCase: Boolean
        //		Set true if the query should ignore case when matching possible items
        ignoreCase: true,
        nls:nls,

        postCreate:function(){
            this.inherited(arguments);
            if(this.dropDown){
                this.addSelectAllOption();
                this._createFilterBox();
            }
        },
        addSelectAllOption:function(){
            if(this.dropDown && this.multiple){
                var _t = this;
                this.selectAllItem = new CheckedMenuItem({
                    label:this.nls.selectAll,
                    checked:true,
                    onChange:function(checked){
                        array.forEach(_t._getChildren(), function(item){
                            item.option.selected = checked;
                        });
                        _t.onChange();
                    }
                });
                this.selectAllItemWrapperMenu = new Menu({
                    style:"width: 100%; border: none;"
                });
                this.selectAllItemWrapperMenu.addChild(this.selectAllItem);
                var tr = domConstruct.place('<tr></tr>',this.dropDownMenu.containerNode,'first');
                var td = domConstruct.place('<td colspan="3"></td>',tr);
                this.selectAllItemWrapperMenu.placeAt(td);

                this.optionSeparator = new MenuSeparator();
                this.optionSeparator.placeAt(this.dropDownMenu.containerNode);
            }
        },
        _getChildren: function(){
            var _t=this;
            //skip filter node.
            return this.inherited(arguments).filter(function(item){
                return item != _t.filterTextBox  && item != _t.selectAllItemWrapperMenu && item != _t.optionSeparator;//avoid remove filter
            });
        },
        _createFilterBox:function(){
            var _t=this;
            var tr = domConstruct.place('<tr></tr>',this.dropDownMenu.containerNode,'first');
            var td = domConstruct.place('<td colspan="3"></td>',tr)
            this.filterTextBox=new declare([TextBox,ClearTextMixin])({
                intermediateChanges:true
            });
            this.filterTextBox.placeAt(td);
            on(this.filterTextBox,'Change',function(val){//TODO update
                _t._doFilter(val);
            })
        },
        _doFilter:function(text){
            var qs = string.substitute(this.queryExpr, [text.replace(/([\\\*\?])/g, "\\$1")]);
            var regex = this._patternToRegExp(qs);
            this._showAllItems();
            this._hideFilteredItems(regex);
        },
        _hideFilteredItems:function(regex){
            this._getChildren().forEach(function(item){
                if(item.option && !regex.test(item.option.label)){
                    domClass.add(item.domNode,'filtered-item');
                }
            })
        },
        _showAllItems:function(){
            this._getChildren().forEach(function(item){
                domClass.remove(item.domNode,'filtered-item');
            })
        },
        _patternToRegExp: function(pattern){
            // summary:
            //		Helper function to convert a simple pattern to a regular expression for matching.
            // description:
            //		Returns a regular expression object that conforms to the defined conversion rules.
            //		For example:
            //
            //		- ca*   -> /^ca.*$/
            //		- *ca*  -> /^.*ca.*$/
            //		- *c\*a*  -> /^.*c\*a.*$/
            //		- *c\*a?*  -> /^.*c\*a..*$/
            //
            //		and so on.
            // pattern: string
            //		A simple matching pattern to convert that follows basic rules:
            //
            //		- * Means match anything, so ca* means match anything starting with ca
            //		- ? Means match single character.  So, b?b will match to bob and bab, and so on.
            //		- \ is an escape character.  So for example, \* means do not treat * as a match, but literal character *.
            //
            //		To use a \ as a character in the string, it must be escaped.  So in the pattern it should be
            //		represented by \\ to be treated as an ordinary \ character instead of an escape.

            return new RegExp("^" + pattern.replace(/(\\.)|(\*)|(\?)|\W/g, function(str, literal, star, question){
                    return star ? ".*" : question ? "." : literal ? literal : "\\" + str;
                }) + "$", this.ignoreCase ? "mi" : "m");
        },
        _updateSelection:function(){
            this.inherited(arguments);
            var _t = this;
            if(this.dropDown && this.dropDownButton && this.multiple){
                var i = 0, label = "";
                array.forEach(this.options, function(option){
                    if(option.selected){
                        i++;
                        label = option.label;
                    }
                });
                if(i == 1){
                    this.dropDownButton.set("label", label);
                }else{
                    label = (this.options.length == this.value.length ? this.nls.allSelected :  lang.replace(this.nls.multiSelectLabelText, {num: i}));
                    this.dropDownButton.set("label",label);
                }
                _t._updateSelectAll();
            }
        },
        _updateSelectAll:function(){
            var selectedAll = !array.some(this.options, function(option){
                return !option.selected
            });
            this.selectAllItem.set('checked',selectedAll);
        }
    })
})