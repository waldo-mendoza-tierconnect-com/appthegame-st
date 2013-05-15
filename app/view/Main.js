Ext.define('ATG.view.Main', {
    extend: 'Ext.Container',
    requires: ['ATG.view.PositionsBar', 'Ext.Anim'],
    xtype: 'main',

    config: {
        layout: {
            type: 'vbox'
        },

        items: [{
            xtype: 'titlebar',
            cls: 'app-title',
            docked: 'top',
            height: 95,
            title: 'Draft Team'
        }, {
            xtype: 'positionsbar',
            selectedIndex: 0
        }, {
            itemId: 'pointsBank',
            xtype: 'container',
            cls: 'points-bar',
            tpl: '<div>Points Bank: {AvailableFantasyPoints}pts</div>',
            height: 80,
            style: {
                lineHeight: '70px',
                textAlign: 'center'
            }
        }, {
            xtype: 'list',
            cls: 'pl-list',
            model: 'ATG.model.Player',
            allowDeselect: true,
            itemTpl: [
                '<div>',
                    '<div style="display: inline-block;"><img src="./resources/icons/player.png" width="50" height="50"/></div>',
                    '<div class="pl-infoContent">',
                        '<div class="pl-name">{Name}</div>',
                        '<div class="pl-teamCode">{TeamCode}</div>',
                    '</div>',
                    '<div class="pl-cost">{FantasyCost} pts</div>',
                '</div>'
            ],
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
                top: box.top + 30,
                left: box.width - 80,
                width: 290,
                height: 50,
                layout: 'hbox',
                items: [{
                    xtype: 'button',
                    text: 'Games',
                    data: 'show',
                    listeners: {
                        tap: me.onGamesButtonTapped
                    }
                }, {
                    xtype: 'dataview',
                    flex: 1,
                    scrollable: 'horizontal',
                    inline: {
                        wrap: false
                    },
                    itemTpl: '<div style="padding: 5px;">{NamesWithCodes}</div><div>{GameTime}</div>',
                    store: ATG.app.challenge.games()
                }]
            });


        });
    },

    onGamesButtonTapped: function (button) {

        var parent = button.up('container'),
            actionCfg = {
                "show": {
                    toLeft: parent.element.getBox().left - 200,
                    data: "hide"
                },
                "hide": {
                    toLeft: parent.element.getBox().left + 200,
                    data: "show"
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
        });

        Ext.Animator.run(animation);
    }
});