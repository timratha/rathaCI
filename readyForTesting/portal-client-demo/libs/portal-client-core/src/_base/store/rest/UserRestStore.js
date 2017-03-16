define([
    'dstore/Cache',
    'dojo/io-query',
    'dojo/when',
    'dojo/_base/array',
    'dojo/promise/all',
    'dstore/RequestMemory',
    'dstore/Memory',
    'dojo/Deferred',
    'dojo/_base/lang',
    'dojo/request',
    'dojo/_base/declare',
    'dstore/Rest',
    './storeMixins/_filterGet',
    'dstore/Trackable'],function(Cache, ioQuery, when, array, all, RequestMemory, Memory, Deferred, lang, request, declare, Rest, _filterGet, Trackable){
    var basePath ="";
    return declare([ Rest, Trackable],{
        headers: { 'Content-Type': 'application/json' },

        permissionGroups:null,//pass by portalStore
        permissions:null,//pass by portalStore

        _usersCurrent : new declare([ Rest, Trackable])({
            headers: {'Content-Type': 'application/json'}
        }),
        userRoles:new declare([ Rest, Trackable, _filterGet])({
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            getPermissionGroups: function(id) {
                return request(this.target + id + "?includePermissionGroups=true", {headers:this.headers, handleAs:'json'});
            },
            setFuncPermission:function(id,permissions){
                return request.put(basePath+"/rest/userRoles/"+id+"/functionalPermissions/",{headers:this.headers,data:JSON.stringify(permissions)})
            },
            addFuncPermissionGroups:function(id,groups){
                return request.put(basePath+"/rest/userRoles/"+id+"/functionalPermissionsGroups/",{headers:this.headers,data:JSON.stringify(groups)})
            },
            addPortalObjectPermissionGroups:function(id,groups){
                return request.put(basePath+"/rest/userRoles/"+id+"/portalObjectPermissionsGroups/",{headers:this.headers,data:JSON.stringify(groups)})
            },
            addDataSourceObjectPermissionGroups:function(id,groups){
                return request.put(basePath+"/rest/userRoles/"+id+"/datasourceObjectPermissionsGroups/",{headers:this.headers,data:JSON.stringify(groups)})
            }
        }),
        myTimeSeries:new declare([ Rest, Trackable, Cache, _filterGet])({
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            addValues: function(id,data){
                return request.put(basePath+"/rest/myTimeSeries/"+id+"/data/",{headers:this.headers,data:JSON.stringify(data)});
            },
            getValues: function(id,options){
                var queryStr = ioQuery.objectToQuery(options);
                return request(basePath+"/rest/myTimeSeries/"+id+"/data/" + "?" + queryStr,{handleAs: "json", headers:this.headers}).then(function(result){
					return result;
				}, function(err){
					return {data: []};
				});
            }
        }),
        //tag: private
        //TODO name maybe change in future.
        _functionalPermissionsCheckMap:null,

        constructor:function(args){
            this.inherited(arguments);
            basePath = args.basepath;
            this._usersCurrent.target= basePath+"/rest/users/current/";
            this.userRoles.target= basePath+"/rest/userRoles/";
            this.myTimeSeries.target= basePath+"/rest/myTimeSeries/";
            this.target =   basePath+"/rest/users/";
        },
        put: function(object, options){
            if(('id' in object)) {
                var def = new Deferred();
                request.put(basePath+"/rest/users/" + object.id, {
                    headers: this.headers,
                    data: JSON.stringify(object)
                }).then(function (result) {
                    def.resolve(object);
                }, function (error) {
                    def.reject("ooops");
                });
                return def;
            }else{
                return this.inherited(arguments)
            }
        },
        getUsers: function () {
            ////console.log("get User.!")
            ////console.log(this.get("localhost/kisters/ci/readyForTesting/portal-client-demo/libs/portal-client-core/test/data/users.json"))
            //request(this.get("http://localhost/kisters/ci/readyForTesting/portal-client-demo/libs/portal-client-core/test/data/users.json", {headers:this.headers, handleAs:'json'})).then(function(result){
            //    console.log(result)
            //    console.log("get User.!")
            //});
            //
            //
            //return this.get("localhost/kisters/ci/readyForTesting/portal-client-demo/libs/portal-client-core/test/data/users.json");
        },
        getCurrentUser: function () {
            return this._usersCurrent.get("");
        },
        setUserRoles:function(id,roleArray){
            return request.put(basePath+"/rest/users/"+id+"/userRoles/",{headers:this.headers,data:JSON.stringify(roleArray)})
        },

        checkPermission:function(key,type){
            type = type || 'functional'
            if(type == 'functional'){
                return this._functionalPermissionsCheckMap && this._functionalPermissionsCheckMap[key] || this._functionalPermissionsCheckMap == '*';
            }else{
                throw 'not implement yet';
            }
        },



        auth:function(){
            return this._connect('/rest/users/current',{method:'GET'});
        },
        login:function(user){
            user.domain ="WISKI"   //TODO temp solution for wiksi authentification, will be ignored for other auths
            return this._connect('/rest/auth/login',{method:'POST',data:user});
        },
        logout:function(){
            return this._connect('/rest/auth/logout',{method:'POST'});
        },
        registerUser:function(user){
            return this._connect('/rest/users',{method:'POST',data:user});
        },
        resetTokens:function(user){
            return this._connect('/rest/users/resetTokens',{method:'POST',data:user});
        },
        resetPassword:function(data){
            return this._connect('/rest/users/'+ (data.userId || this._currentUserId) +'/password',{method:'PUT',data:{
                "oldPassword": data.oldPassword,
                "newPassword": data.newPassword
            }});
        },
        resetPasswordAdmin:function(data){
            return this._connect('/rest/users/'+ (data.userId) +'/password',{method:'PUT',data:{
                "newPassword": data.newPassword
            }});
        },
        resetPasswordByToken:function(token,user){
            return this._connect('/rest/users/resetTokens/'+token,{method:'PUT',data:user});
        },
        _connect:function(url,options,notCheckUser){
            var _t = this,
                defOptions = {handleAs: "json", headers:{
                    'Content-Type':'application/json'
                }};
            if(options.data){
                options.data=JSON.stringify(options.data);
            }
            return request(basePath+url, lang.mixin(defOptions,options));
        },
        installPermissions:function(permissionConfig){
            var _t=this;
            //TODO have risk when install failed

            //install permissions
            if(permissionConfig.permissions){
                all(array.map(permissionConfig.permissions,function(permission){
                    return _t.permissions.functional.add(permission);
                }));
            }

            //install permissionGroups
            if(permissionConfig.permissionGroups){
                all(array.map(permissionConfig.permissionGroups,function(pg){
                    return _t.permissionGroups.functionalGroup.add(pg).then(function(result){
                        _t.permissionGroups.functionalGroup.setFunctionalPermissions(result.id,pg.functionalPermissions)
                    });
                }));
            }
        },
        startup:function(){
            var _t=this;
            return all(
                [
                    this._connect("/rest/users/current?includeRoles=false&includeFunctionalPermissions=true",{method:'GET'}).then(function(user){
                        // consider use some structure, if always map with different type is ok
                        _t._functionalPermissionsCheckMap=user.functionalPermissions;
                        _t._currentUserId = user.id;//TODO

                        if(user.userName == 'PortalAdmin'){
                            _t._functionalPermissionsCheckMap='*';//special user case.
                        }
                    })
                ])

        }
    })
})