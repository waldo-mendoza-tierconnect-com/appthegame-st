Ext.define('ATG.model.Player', {
    extend: 'Ext.data.Model',

    requires: [
        'ATG.model.Game'
//        'ATG.model.Challenge'
    ],

    config: {
        fields: [
            { name: "Name", type: "string" },
            { name: "Weight", type: "integer" },
            { name: "Age", type: "integer" },
            { name: "Number", type: "integer" },
            { name: "TeamName", type: "string" },
            { name: "Height", type: "string" },
            { name: "Position", type: "string" },
            { name: "FantasyCost", type: "integer" },
            { name: "TeamID", type: "string" },
            { name: "TeamCode", convert: function (value, record) {
                var fn = ATG.model.Game.getTeamCodeById,
                    code = fn(record.get("TeamID"));

                return code ? code : "NONE";
            }}
        ],

//        belongsTo: {model: 'ATG.model.Challenge', getterName: 'getChallenge', associationKey: 'FantasyChallenge', associatedName: 'Challenge'}
        hasOne: {model: 'ATG.model.Challenge', getterName: 'getChallenge', associationKey: 'FantasyChallenge'}
    }
});