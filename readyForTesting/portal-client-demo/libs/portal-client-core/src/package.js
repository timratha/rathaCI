var copyOnlyRe = [
        /\/build/
    ]

var profile = {
    resourceTags: {
        amd: function(filename, mid){
            return /\.js$/.test(filename);
        }
    },
    miniExclude: function (filename, mid) {
        return mid in {
                './libs': 1
            };
    },
    copyOnly: function(filename, mid){
        for(var i = copyOnlyRe.length; i--;){
            if(copyOnlyRe[i].test(mid)){
                return true;
            }
        }
        return false;
    }
};
