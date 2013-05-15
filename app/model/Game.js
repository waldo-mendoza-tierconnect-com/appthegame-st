Ext.define('ATG.model.Game', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            { name: "PlaceName", type: "string" },
            { name: "League1", type: "string" },
            { name: "Name", type: "string" },
            { name: "HomeTeamID", type: "string" },
            { name: "AwayTeamID", type: "string" },
            { name: "UTCTime", type: "string"},
            { name: 'GameTime', convert: function (value, record) {
                try {
                    var str = record.get('UTCTime'),
                        str = str.substring(0, str.length - 1),
                        date = Ext.Date.parse(str, 'c');

                    return Ext.Date.format(date, "g:i a");
                } catch (e) {
                    return '';
                }
            }},
            { name: "NamesWithCodes", convert: function (value, game) {
                var fn = ATG.model.Game.getTeamCodeById;

                return fn(game.get("AwayTeamID")) + " @ " + fn(game.get("HomeTeamID"));
            }}
        ]
    },

    statics: {
        getTeamCodeById: function (id) {
            var map = {
                "4fd03d4e1c73bc0a74b81f00": "CHI",
                "4fd03d4e1c73bc0a74b81f11": "MIA",
                "4fd03d4e1c73bc0a74b81f07": "GSW",
                "4fd03d4e1c73bc0a74b81f24": "SAN"
            };

            return map[id];
        }
    }
});