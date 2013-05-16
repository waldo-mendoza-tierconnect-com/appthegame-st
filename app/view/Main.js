Ext.define('ATG.view.Main', {
    extend: 'Ext.Container',
    requires: [
        'ATG.view.PositionsBar',
        'ATG.view.ListColumns',
        'Ext.Anim'
    ],
    xtype: 'main',

    config: {
        layout: {
            type: 'vbox'
        },

        items: [{
            xtype: 'titlebar',
            cls: 'app-title',
            docked: 'top',
            title: 'Draft Team',

            items: [{
                xtype: 'component',
                html: '<',
                align: 'left'
            }, {
                xtype: 'component',
                html: '$30',
                align: 'right'
            }]
        }, {
            xtype: 'positionsbar',
            selectedIndex: 0
        }, {
            itemId: 'pointsBank',
            xtype: 'container',
            cls: 'points-bar',
            tpl: '<div>Points Bank: {AvailableFantasyPoints}pts</div>',
            height: 70
        }, {
            xtype: 'listcolumns',
            selectedColumn: 0
        }, {
            xtype: 'list',
            cls: 'pl-list',
            model: 'ATG.model.Player',
            allowDeselect: true,
            itemTpl: new Ext.XTemplate(
                '<ul>',
                    '<li class=""><img src="./resources/icons/player.png" width="50" height="50"/></li>',
                    '<li class="pl-infoContent">',
                        '<div class="pl-name">{Name}</div>',
                        '<div class="pl-teamCode">{[this.getGameName(values)]}</div>',
                    '</li>',
                    '<li class="cnt-time">{[this.getGameTime(values)]}</li>',
                    '<li class="cnt-cost">{FantasyCost} pts</li>',
                    '<li class="cnt-status"><img src="./resources/icons/images/info-paternity@2x.png" width="50" height="50"/></li>',
                '</ul>', {
                    getGameName: function (values) {
                        var ch = ATG.app.challenge,
                            game = ch ? ch.getTeamGame(values.TeamID) : null;

                        return game ? game.get('NamesWithCodes') : 'NONE';
                    },

                    getGameTime: function (values) {
                        var ch = ATG.app.challenge,
                            game = ch ? ch.getTeamGame(values.TeamID) : null;

                        return game ? game.get('GameDate') : 'NONE';
                    }
                }),
            flex: 1
        }]
    },

    initialize: function () {
        var me = this,
            pointsBank = me.down('#pointsBank');

        me.callParent();

        pointsBank.on('painted', function () {
            var box = pointsBank.element.getBox();

            Ext.Viewport.add({
                xtype: 'container',
                top: box.top + 18,
                left: box.width - 70,
                cls: 'panel-games',
                width: 290,
                height: 50,
                layout: 'hbox',
                items: [{
                    xtype: 'button',
                    text: 'Games',
                    iconCls: 'icon',
                    iconAlign: 'bottom',
                    data: 'show',
                    cls: 'atg-games-collapsed',
                    listeners: {
                        tap: me.onGamesButtonTapped,
                        scope: me
                    }
                }, {
                    xtype: 'dataview',
                    flex: 1,
                    scrollable: 'horizontal',
                    allowDeselect: true,
                    inline: {
                        wrap: false
                    },
                    itemTpl: '<div class="nameCode">{NamesWithCodes}</div><div class="time">{GameTime}</div>',
                    store: ATG.app.challenge.games(),
                    listeners: {
                        selectionchange: me.onSelectionChange,
                        scope: me
                    }
                }]
            });


        });
    },

    onGamesButtonTapped: function (button) {

        var me = this,
            parent = button.up('container'),
            actionCfg = {
                "show": {
                    toLeft: parent.element.getBox().left - 230,
                    data: "hide",
                    removeCls: 'atg-games-collapsed',
                    addCls: 'atg-games-expanded',
                    fromFont: '22px',
                    toFont: '15px'
                },
                "hide": {
                    toLeft: parent.element.getBox().left + 230,
                    data: "show",
                    removeCls: 'atg-games-expanded',
                    addCls: 'atg-games-collapsed',
                    fromFont: '15px',
                    toFont: '22px'
                }
            },
            config = actionCfg[button.getData()],
            animation = new Ext.fx.Animation({
                element: parent.element,
                duration: 800,
                preserveEndState: true,

                to: {
                    left: config.toLeft
                }
            });

        animation.on('animationend', function () {
            button.setData(config.data);
            button.removeCls(config.removeCls)
            button.addCls(config.addCls);
        });

        Ext.Animator.run(animation);

        Ext.Animator.run({
            element: me.down('#pointsBank').element,
            duration: 500,
            preserveEndState: true,
            from: {
                'font-size': config.fromFont
            },
            to: {
                'font-size': config.toFont
            }
        });
    },

    onSelectionChange: function (list, records, eOpts) {
        this.fireEvent('gameSelected', list, records);
    }
});