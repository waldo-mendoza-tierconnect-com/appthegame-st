Ext.define('ATG.controller.Main', {
    extend: 'Ext.app.Controller',

    config: {

        control: {
            positionsBar: {
                positionChanged: 'onPositionChanged'
            },

            playerList: {
                itemtap: 'onPlayerSelected',
                initialize: 'onPlayerListInitialize'
            }
        },

        refs: {
            positionsBar: 'positionsbar',
            playerList: 'list',
            pointsBank: '#pointsBank',
            mainView: 'main'
        }
    },

    onPlayerListInitialize: function () {
        this.onPositionChanged(ATG.app.challenge.get('PositionNames')[0]);
    },

    onPositionChanged: function (position) {
        var me = this,
            challenge = ATG.app.challenge,
            players = challenge.getPlayersForPosition(position),
            selectedForPosition = challenge.getSelectionFor(position),
            playerList = me.getPlayerList();

        me.updatePointBanks();

        playerList.setStore(players);

        selectedForPosition && playerList.select(selectedForPosition);
    },

    onPlayerSelected: function (list, index, target, player) {
        var me = this,
            challenge = ATG.app.challenge;

        if (challenge.handleSelection(player, me.getPositionsBar().getPositionName())) {
            me.getPositionsBar().setButtonPoints(player.get('FantasyCost'));
        } else {
            me.getPositionsBar().setButtonPoints('');
        }

        me.updatePointBanks();

        if (challenge.isDraftComplete()) {

            var box = me.getMainView().element.getBox();

            me.gameList = Ext.create('Ext.Container', {
                top: box.height - 70,
                left: box.left,
                width: box.width,
                height: 70,

                items: {
                    xtype: 'button',
                    ui: '',
                    cls: 'btn-confirm',
                    height: 80,
                    margin: '10 24',
                    text: 'Confirm Draft',
                    flex: 1
                }
            });

            Ext.Viewport.add(me.gameList);
        } else {
            if (me.gameList) {
                Ext.Viewport.remove(me.gameList);
            }
        }
    },

    updatePointBanks: function () {
        var me = this;

        me.getPointsBank().setData(ATG.app.challenge.getData());
    }
});