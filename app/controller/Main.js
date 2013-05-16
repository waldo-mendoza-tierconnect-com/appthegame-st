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
            },

            listColumns: {
                columnChanged: function (info) {
                    var me = this,
                        playerList = me.getPlayerList();
                    if (info.data && playerList) {
                        playerList.getStore().sort(info.data.field, info.data.type);
                    }
                }
            },

            main: {
                gameSelected: 'onGameSelected'
            }
        },

        refs: {
            positionsBar: 'positionsbar',
            playerList: 'list',
            pointsBank: '#pointsBank',
            mainView: 'main',
            listColumns: 'listcolumns',
            main: 'main'
        }
    },

    onGameSelected: function (gameList, games) {
        var me = this,
            playerList = me.getPlayerList(),
            game = games[0];

        playerList.getStore().clearFilter(true);

        if (gameList.getSelectionCount() > 0) {
            playerList.getStore().filterBy(function (player) {
                var teamId = player.get('TeamID');

                return teamId == game.get('HomeTeamID') || teamId == game.get('AwayTeamID');
            });
        }
    },

    onPlayerListInitialize: function () {
        var me = this;

        me.onPositionChanged(ATG.app.challenge.get('PositionNames')[0]);
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

            me.draftSection = Ext.create('Ext.Container', {
                top: box.height - 100,
                left: box.left,
                width: box.width,
                height: 80,

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

            Ext.Viewport.add(me.draftSection);
        } else {
            if (me.draftSection) {
                Ext.Viewport.remove(me.draftSection);
            }
        }
    },

    updatePointBanks: function () {
        var me = this;

        me.getPointsBank().setData(ATG.app.challenge.getData());
    }
});