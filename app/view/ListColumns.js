Ext.define('ATG.view.ListColumns', {
    extend: 'Ext.Container',
    xtype: 'listcolumns',

    config: {
        layout: 'hbox',
        selectedColumn: 0,

        defaults: {
            cls: 'atg-column-normal'
        },
        items: [{
            xtype: 'component',
            html: 'Athlete',
            flex: 0.2,
            data: 'athlete'
        }, {
            xtype: 'component',
            html: 'Team',
            flex: 0.2,
            data: 'team'
        }, {
            xtype: 'component',
            html: 'Time',
            flex: 0.2,
            data: 'time'
        }, {
            xtype: 'component',
            html: 'Points',
            flex: 0.2,
            data: 'points'
        }, {
            xtype: 'component',
            html: 'Status',
            flex: 0.2,
            data: 'status'
        }]
    },

    initialize: function () {
        var me = this;

        me.items.each(function (item) {
            item.setListeners({
                tap: me.onColumnTap,
                element: 'element',
                scope: me
            })
        });
    },

    updateSelectedColumn: function (newIndex, oldIndex) {
        var me = this,
            column = me.items.getAt(newIndex);

        if (oldIndex > - 1) {
            me.items.getAt(oldIndex).setCls('atg-column-normal');
        }
        column.setCls('atg-column-selected');

        me.fireEvent('columnChanged', {index: newIndex, column: column.data});
    },

    onColumnTap: function (event) {
        var me = this,
            item, i, n,
            index = -1;

        for (i = 0, n = me.items.getCount(); i < n; i++) {
            item = me.items.getAt(i);
            if (item.element.dom.firstChild == event.target) {
                index = i;
                break;
            }
        }

        me.setSelectedColumn(index);
    }


});
