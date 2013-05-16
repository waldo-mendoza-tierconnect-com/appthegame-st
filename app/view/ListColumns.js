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
            data: {
                field: 'Name',
                type: 'DESC'
            }
        }, {
            xtype: 'component',
            html: 'Team',
            flex: 0.2,
            data: {
                field: 'TeamName',
                type: 'DESC'
            }
        }, {
            xtype: 'component',
            html: 'Time',
            flex: 0.2,
            data: null
        }, {
            xtype: 'component',
            html: 'Points',
            flex: 0.2,
            data: {
                field: 'FantasyCost',
                type: 'DESC'
            }
        }, {
            xtype: 'component',
            html: 'Status',
            flex: 0.2,
            data: null
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

        me.refreshColumns(0);
    },

    onColumnTap: function (event) {
        var me = this,
            item, i, n,
            newIndex = -1;

        for (i = 0, n = me.items.getCount(); i < n; i++) {
            item = me.items.getAt(i);
            if (item.element.dom.firstChild == event.target) {
                newIndex = i;
                break;
            }
        }
        me.refreshColumns(newIndex);

        me.setSelectedColumn(newIndex);
    },

    refreshColumns: function (newIndex) {
        var me = this,
            column = me.items.getAt(newIndex),
            oldIndex = me.getSelectedColumn();

        if (oldIndex > - 1) {
            me.items.getAt(oldIndex).setCls('atg-column-normal');
        }
        column.setCls('atg-column-selected');

        if (newIndex === oldIndex) {
            var data = column.getData();
            data.type = (data.type == 'DESC' ? 'ASC' : 'DESC');
            column.setData(data);
        }

        me.fireEvent('columnChanged', {index: newIndex, data: column.getData()});
    }
});
