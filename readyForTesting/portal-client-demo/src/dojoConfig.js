var dojoConfig={
    async: true,
    parseOnLoad: false,
    isDebug: true,
    locale: 'en',
    aliases: [["text", "dojo/text"]],
    packages: [
    {
        name: "portal-client-demo",
        location: "../../src"
    }
    ,{
        name: "portal",
        location:"../portal-client-core/src"
    },
    {
        name: "kisters-web-portal-admin",
		location:"../portal-client-admin/src"
	},
        {
            name: "test",
            location:"../../tests"
        },
		 {
            name: "yeti",
            location:"../yeti"
        }
    ]

};