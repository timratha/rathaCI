define([], function () {
    var module='demo';
    return {
        //
        permissions:[
            {
                "key":module+'.widget.ContentRotator.arrow',
                "module":module,
                "description":"enable to select arrow to navigate the contents"

            },
            {
                "key":module+'.widget.ContentRotator.pager',
                "module":module,
                "description":"enable pager"
            }
        ],
        //pre-defined permission groups
        permissionGroups:[
            {
                "key": module+'.widget.all',
                "description": '',
                "functionalPermissions": [
                    {
                        "key": module+'.widget.ContentRotator.arrow',
                        "level":1 //means true
                    },
                    {
                        "key": module+'.widget.ContentRotator.pager',
                        "level": 1
                    }
                ]
            }
        ]
    }
});