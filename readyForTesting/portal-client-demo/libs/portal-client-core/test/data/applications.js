define([], function () {
    return {
        "app1": {
            "key": 'testApp1',
            "defaultView": "ContentView1",
            "label": "Test Application1",
            "editTime": "2015-08-12 18:08:44.597",
            "creationTime": "2015-08-12 18:08:44.597",
            "version": "0.0.9",
            "applicationType": "Test Application",
            "iconClass": "fa fa-motorcycle",
            "config":{
                 "showFooter":false,
                "theme":"oceanblue",
                "footerContent":"bla bla bla"
            },
            "packageName": "test",
            "menu": {
                "position": "left",
                "menuSize": "responsive",
                "items": [
                    {
                        "key": "ContentView1",
                        "iconClass": "fa fa-flash",
                        "label": "ContentView1"
                    },
                    {
                        "key": "ContentView2",
                        "iconClass": "fa fa-laptop",
                        "label": "ContentView2",
                        "items": [
                            {
                                "key": "Layout",
                                "iconClass": "fa fa-paint-brush",
                                "label": "Layout"
                            }
                        ]
                    },
                    {
                        "iconClass": "fa fa-tint",
                        "label": "Water",
                        "items": [
                            {
                                "key": "SampleView",
                                "iconClass": "fa fa-sun-o",
                                "label": "Weather"
                            },
                            {
                                "key": "Generic",
                                "iconClass": "fa fa-star",
                                "label": "Generic"
                            }

                        ]
                    }

                ]
            },
            "views": [
                {
                    "key": "ContentView1",
                    "viewType": "test/views/ContentView",
                    "label": "test view",
                    "iconClass": "fa fa-users",
                    "config": {
                        "content": "content for ContentView1"
                    }
                },
                {
                    "key": "ContentView2",
                    "viewType": "test/views/ContentView",
                    "label": "test view",
                    "iconClass": "fa fa-users",
                    "config": {
                        "content": "content for ContentView2"
                    }
                },
                {
                    "key": "SampleView",
                    "viewType": "test/views/SampleView",
                    "label": "test view",
                    "iconClass": "fa fa-users",
                    "config": {
                        "content": "content for SampleView"
                    },
                    "widgets": [
                        {
                            "key": "leftPanel",
                            "widgetType": "test/widgets/ContentWidget",
                            "label": "${title}",
                            "iconClass": "fa fa-users",
                            "config": {
                                "content": "content of widget_001, and title is get from instance"
                            }
                        },
                        {
                            "key": "rightPanel",
                            "widgetType": "test/widgets/ContentWidget",
                            "label": "test widget",
                            "iconClass": "fa fa-users",
                            "config": {
                                "content": "content of widget_002"
                            }
                        }
                    ]
                }
            ]
        },
        "app2": {
            "key": 'testApp2',
            "defaultView": "ContentView2",
            "label": "Test Application2",
            "editTime": "2015-08-12 18:08:44.597",
            "creationTime": "2015-08-12 18:08:44.597",
            "version": "0.0.9",
            "applicationType": "Test Application",
            "iconClass": "fa fa-gavel",
            "packageName": "test",
            "config":{
                "theme":"rubyred"
            },
            "menu": {
                "position": "left",
                "menuSize": "responsive",
                "items": [
                    {
                        "key": "ContentView1",
                        "iconClass": "fa fa-flash",
                        "label": "ContentView1.2"
                    },
                    {
                        "key": "ContentView2",
                        "iconClass": "fa fa-laptop",
                        "label": "ContentView2.2"
                    },
                    {
                        "key": "SampleView",
                        "iconClass": "fa fa-sun-o",
                        "label": "Weather"
                    },
                    {
                        "key": "Generic",
                        "iconClass": "fa fa-star",
                        "label": "Generic"
                    },
                    {
                        "key": "Layout",
                        "iconClass": "fa fa-paint-brush",
                        "label": "Layout"
                    }

                ]
            },
            "views": [
                {
                    "key": "ContentView1",
                    "viewType": "test/views/ContentView",
                    "label": "test view",
                    "iconClass": "fa fa-users",
                    "config": {
                        "content": "content for ContentView1"
                    }
                },
                {
                    "key": "ContentView2",
                    "viewType": "test/views/ContentView",
                    "label": "test view",
                    "iconClass": "fa fa-users",
                    "config": {
                        "content": "content for ContentView2"
                    }
                },
                {
                    "key": "SampleView",
                    "viewType": "test/views/SampleView",
                    "label": "test view",
                    "iconClass": "fa fa-users",
                    "config": {
                        "content": "content for SampleView"
                    },
                    "widgets": [
                        {
                            "key": "leftPanel",
                            "widgetType": "test/widgets/ContentWidget",
                            "label": "test widget",
                            "iconClass": "fa fa-users",
                            "config": {
                                "content": "content of widget_001"
                            }
                        },
                        {
                            "key": "rightPanel",
                            "widgetType": "test/widgets/ContentWidget",
                            "label": "test widget",
                            "iconClass": "fa fa-users",
                            "config": {
                                "content": "content of widget_002"
                            }
                        }
                    ]
                }
            ]
        },
        "navApp": {
            "key": 'testApp1',
            "defaultView": "ContentView1",
            "label": "Test Application1",
            "editTime": "2015-08-12 18:08:44.597",
            "creationTime": "2015-08-12 18:08:44.597",
            "version": "0.0.9",
            "applicationType": "Test Application",
            "iconClass": "fa fa-smile-o",
            "packageName": "test",
            "menu": {
                "position": "left",
                "menuSize": "responsive",
                "items": [
                    {
                        "key": "ContentView1",
                        "iconClass": "fa fa-flash",
                        "label": "ContentView1"
                    },
                    {
                        "key": "ContentView2",
                        "iconClass": "fa fa-laptop",
                        "label": "ContentView2",
                        "items": [
                            {
                                "key": "Layout",
                                "iconClass": "fa fa-paint-brush",
                                "label": "Layout"
                            }
                        ]
                    },
                    {
                        "iconClass": "fa fa-tint",
                        "label": "Water",
                        "items": [
                            {
                                "key": "SampleView",
                                "iconClass": "fa fa-sun-o",
                                "label": "Weather"
                            },
                            {
                                "key": "Generic",
                                "iconClass": "fa fa-star",
                                "label": "Generic"
                            }
                        ]
                    }

                ]
            },
            "views": [
                {
                    "key": "ContentView1",
                    "viewType": "test/views/ContentView",
                    "label": "test view",
                    "iconClass": "fa fa-users",
                    "config": {
                        "content": "content for ContentView1"
                    }
                },
                {
                    "key": "ContentView2",
                    "viewType": "test/views/ContentView",
                    "label": "test view",
                    "iconClass": "fa fa-users",
                    "config": {
                        "content": "content for ContentView2"
                    }
                },
                {
                    "key": "SampleView",
                    "viewType": "test/views/SampleView",
                    "label": "test view",
                    "iconClass": "fa fa-users",
                    "config": {
                        "content": "content for SampleView"
                    },
                    "widgets": [
                        {
                            "key": "leftPanel",
                            "widgetType": "test/widgets/ContentWidget",
                            "label": "test widget",
                            "iconClass": "fa fa-users",
                            "config": {
                                "content": "content of widget_001"
                            }
                        },
                        {
                            "key": "rightPanel",
                            "widgetType": "test/widgets/ContentWidget",
                            "label": "test widget",
                            "iconClass": "fa fa-users",
                            "config": {
                                "content": "content of widget_002"
                            }
                        }
                    ]
                }
            ]
        },
        "menuPermissionApp": {
            "key": 'menuPermissionApp',
            "defaultView": "ContentView1",
            "label": "Menu permission App",
            "editTime": "2015-08-12 18:08:44.597",
            "creationTime": "2015-08-12 18:08:44.597",
            "version": "0.0.9",
            "applicationType": "Test Application",
            "iconClass": null,
            "packageName": "test",
            "menu": {
                "position": "left",
                "menuSize": "responsive",
                "items": [
                    {
                        "key": "ContentView1",
                        "iconClass": "fa fa-flash",
                        "label": "ContentView1"
                    },
                    {
                        "iconClass": "fa fa-laptop",
                        "label": "ContentView2",
                        "items": [
                            {
                                "key": "Layout",
                                "iconClass": "fa fa-paint-brush",
                                "label": "Layout",
                                "permissionKeys":['permission.can.see.Layout','permission.can.see.AllViews']
                            }
                        ]
                    },
                    {
                        "iconClass": "fa fa-tint",
                        "label": "Water",
                        "items": [
                            {
                                "key": "SampleView",
                                "iconClass": "fa fa-sun-o",
                                "label": "Weather"
                            },
                            {
                                "key": "Generic",
                                "iconClass": "fa fa-star",
                                "label": "Generic",
                                "permissionKeys":['permission.can.see.Generic','permission.can.see.AllViews']
                            }
                        ]
                    }

                ]
            },
            "views": [
                {
                    "key": "ContentView1",
                    "viewType": "test/views/ContentView",
                    "label": "test view",
                    "iconClass": "fa fa-users",
                    "config": {
                        "content": "content for ContentView1"
                    }
                },
                {
                    "key": "ContentView2",
                    "viewType": "test/views/ContentView",
                    "label": "test view",
                    "iconClass": "fa fa-users",
                    "config": {
                        "content": "content for ContentView2"
                    }
                },
                {
                    "key": "SampleView",
                    "viewType": "test/views/SampleView",
                    "label": "test view",
                    "iconClass": "fa fa-users",
                    "config": {
                        "content": "content for SampleView"
                    },
                    "widgets": [
                        {
                            "key": "leftPanel",
                            "widgetType": "test/widgets/ContentWidget",
                            "label": "test widget",
                            "iconClass": "fa fa-users",
                            "config": {
                                "content": "content of widget_001"
                            }
                        },
                        {
                            "key": "rightPanel",
                            "widgetType": "test/widgets/ContentWidget",
                            "label": "test widget",
                            "iconClass": "fa fa-users",
                            "config": {
                                "content": "content of widget_002"
                            }
                        }
                    ]
                }
            ]
        }
    }
})