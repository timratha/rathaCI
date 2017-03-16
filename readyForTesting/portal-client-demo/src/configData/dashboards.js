define([], function () {

  return  [
    {
      "key": "myDashboard",
      "version": 1,
      "label": "My Dashboard",
      "iconClass": "fa fa-cog",
      "layout": {
        "type": "portal/layout/gridlayout",
        "config": {
          "nbZones": "4",
          "isAutoOrganized": false,
          "doLayout": false
        }
      },
      "widgets": [
        {
          "widgetType": "portal/widgets/Calendar",
          "config": {"content": "Calendar"},
          "iconClass": "fa fa-cloud",
          "key": "w012_11430935167511",
          "label": "Calendar",
          "version": "0.0.1",
          "layoutChildConfig": {}
        },
        {
          "widgetType": "portal-client-demo/widgets/exampleWidget",
          "config": {"content": "content from widget 2 in view 1"},
          "iconClass": "fa fa-cab",
          "key": "w011_11430935169625",
          "label": "Hello World from view1 widget 2",
          "version": "0.0.1",
          "layoutChildConfig": {}
        },
        {
          "widgetType": "portal/widgets/EditorWidget",
          "config": {"content": "Editor"},
          "iconClass": "",
          "key": "w013_11430935306757",
          "label": "Editor",
          "version": "0.0.1",
          "layoutChildConfig": {}
        }
      ]
    },
    {
      "key": "myFreeDashboard",
      "version": 1,
      "label": "My free Dashboard",
      "iconClass": "fa fa-cog",
      "layout": {
        "type": "portal/layout/freelayout",
        "config": {
          "nbZones": "4",
          "isAutoOrganized": false,
          "doLayout": false
        }
      },
      "widgets": [
        {
          "widgetType": "portal/widgets/Calendar",
          "config": {"content": "Calendar"},
          "iconClass": "fa fa-cloud",
          "key": "w012_21430935167511",
          "label": "Calendar",
          "version": "0.0.1",
          "layoutChildConfig": {}
        },
        {
          "widgetType": "portal-client-demo/widgets/exampleWidget",
          "config": {"content": "content from widget 2 in view 1"},
          "iconClass": "fa fa-cab",
          "key": "w021_11430935169625",
          "label": "Hello World from view1 widget 2",
          "version": "0.0.1",
          "layoutChildConfig": {}
        },
        {
          "widgetType": "portal/widgets/EditorWidget",
          "config": {"content": "Editor"},
          "iconClass": "",
          "key": "w012_11430935306757",
          "label": "Editor",
          "version": "0.0.1",
          "layoutChildConfig": {}
        }
      ]
    }
  ];
});
