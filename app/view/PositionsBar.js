Ext.define('ATG.view.PositionsBar', {
    extend: 'Ext.Container',
    xtype: 'positionsbar',
    cls: 'bar-menu',

    config: {
        layout: 'hbox',
        width: '100%',
        defaults: {
            flex: 1
        },
        selectedIndex: 0
    },

    initialize: function () {
        var me = this,
            positions = ATG.app.challenge.get('PositionNames'),
            button;

        Ext.each(positions, function (item, index) {
            me.add({
                xtype: 'button',
                text: item,
                ui: '',
//                height:96,
                iconCls: 'icon',
                iconAlign: 'bottom',
                cls: 'btn-menu ' + me.getItemCls(index),
                listeners : {
                    tap: me.onItemTap,
                    scope: me
                }
            });
        });

        me.callParent();
    },

    getPositionName: function () {
        var me = this,
            index = me.getSelectedIndex(),
            positions = ATG.app.challenge.get('PositionNames');

        return positions[index];
    },

    setButtonPoints: function (points) {
        var me = this,
            index = me.getSelectedIndex();

        me.items.getAt(index).setBadgeText(points);
    },

    onItemTap: function (button) {
        var me = this,
            newIdx = me.items.indexOf(button);

        me.setSelectedIndex(newIdx);
    },

    updateSelectedIndex: function (newIdx, oldIdx) {
        var me = this,
            button;

        if (me.items.getCount() == 0) {
            return;
        }

        if (oldIdx !== null && oldIdx !== undefined) {
            me.items.getAt(oldIdx).setCls(me.getItemCls(oldIdx));
        }
        if (newIdx !== null && newIdx !== undefined) {
            button = me.items.getAt(newIdx);
            button.setCls(me.getItemCls(newIdx));
        }

        me.fireEvent('positionChanged', button.getText());
    },

    isItemSelected: function (index) {
        return this.getSelectedIndex() === index;
    },

    getItemCls: function (index) {
        var me = this;

        return (me.isItemSelected(index) ? 'atg-positions-selected-item' : 'atg-positions-item');
    }



});
