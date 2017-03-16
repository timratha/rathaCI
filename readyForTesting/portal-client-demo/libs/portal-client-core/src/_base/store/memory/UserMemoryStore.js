define(['dojo/when',
    'dojo/Deferred',
    'dstore/Memory',
    'dojo/_base/lang',
    'dojo/request',
    'dojo/_base/declare',
    'dstore/Rest',
    'dstore/Trackable'],function(when, Deferred, Memory, lang, request, declare, Rest, Trackable){

    return declare([ Memory, Trackable],{
        _currentUser:null,
        data:[
        ],
        getCurrentUser: function () {
            var ready = new Deferred();
            if(this._currentUser){
                ready.resolve(this._currentUser);
            }else{
                ready.reject('no session')
            }
            return ready.promise;
        },
        getUsers: function () {
            return this.fetch();
        },
        auth:function(){
            return this.getCurrentUser();
        },
        login:function(user){
            return this.filter({userName:user.userName}).fetch().then(function(users){
                if(users[0]&& users[0].password == user.password){
                    this._currentUser=users[0];
                    return this._currentUser;
                }else{
                    throw 'login failed';
                }
            });
        },
        logout:function(){
            this._currentUser=null;
            return when(true);
        },
        resetPassword:function(data){
            var _t=this;
            return when(true).then(function(){
                if(data.oldPassword != _t._currentUser.password){
                    throw 'reset fail'
                }
            });
        },
        checkPermission:function(key,type){

            return this._currentUser && this._currentUser.functionalPermissions && this._currentUser.functionalPermissions[key];


        },
        startup:function(){
            //noop
        }
    })
})