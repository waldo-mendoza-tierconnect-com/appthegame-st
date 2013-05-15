Ext.define('ATG.model.Challenge', {
    extend: 'Ext.data.Model',
    requires: ['ATG.model.Player'],

    config: {
        fields: [
            { name: 'PositionNames', type: 'auto' },
            { name: 'League1Name', type: 'string' },
            { name: 'AvailableFantasyPoints', type: 'integer' }
        ],

        hasMany: [
            { name: 'positionOnePlayers', associationKey: 'PositionOneAvailablePlayerList', model: 'ATG.model.Player' },
            { name: 'positionTwoPlayers', associationKey: 'PositionTwoAvailablePlayerList', model: 'ATG.model.Player' },
            { name: 'positionThreePlayers', associationKey: 'PositionThreeAvailablePlayerList', model: 'ATG.model.Player' },

            { name: 'games', associationKey: 'Games', model: 'ATG.model.Game'}
        ],

        proxy: {
            type: 'rest',
            url: './data/getchallenge.json',

            reader: {
                type: 'json',
                rootProperty: 'FantasyChallenge'
            }
        }
    },

    getPlayersForPosition: function (position) {
        var me = this,
            mapping = {
                F: 'positionOnePlayers',
                G: 'positionTwoPlayers',
                C: 'positionThreePlayers'
            },
            fn = mapping[position];

        if (Ext.isFunction(me[fn])) {
            return me[fn]();
        } else {
            return Ext.create('Ext.data.Store', {
                model: 'ATG.model.Player',
                data: []
            });
        }
    },

    handleSelection: function (player, position) {
        var me = this,
            selection = me.getSelectionFor(position);

        if (selection) {
            if (selection.get('Name') === player.get('Name')) {
                me.unSelectPlayer(player);
                me.selections[position] = null;
                return false;
            } else {
                me.unSelectPlayer(selection);
                if (me.selectPlayer(player)) {
                    me.selections[position] = player;
                    return true;
                }
            }
        } else {
            if (me.selectPlayer(player)) {
                me.selections[position] = player;
                return true;
            }
        }

        return false;
    },

    selectPlayer: function (player) {
        var me = this,
            remaining = me.get('AvailableFantasyPoints') - player.get('FantasyCost');

        if (remaining > 0) {
            me.set('AvailableFantasyPoints', remaining);
            return true;
        } else {
            return false;
        }
    },

    unSelectPlayer: function (player) {
        var me = this,
            total = me.get('AvailableFantasyPoints') + player.get('FantasyCost');

        me.set('AvailableFantasyPoints', total);
    },

    getSelectionFor: function (position) {
        var me = this;

        if (!me.selections) {
            //TODO: use position names
            me.selections = {
                F: null,
                G: null,
                C: null
            };
        }

        return me.selections[position];
    },

    isDraftComplete: function () {
        var me = this,
            i, n,
            keys = Ext.Object.getKeys(me.selections);

        for (i = 0, n = keys.length ; i < n; i++) {
            if (Ext.isEmpty(me.selections[keys[i]])) {
                return false;
            }
        }

        return true;
    }
});