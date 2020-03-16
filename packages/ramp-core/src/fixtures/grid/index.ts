import Vue from 'vue';
import { FixtureConfigHelper } from '@/store/modules/fixture';
import { PanelConfig } from '@/store/modules/panel';
import { ConfigStore } from '@/store/modules/config';
import { LayerStore, layer } from '@/store/modules/layer';
import { grid } from './store/index';
import { Get, Sync, Call } from 'vuex-pathify';

import GridV from './grid.vue';
import { GridAPI } from './api/grid';

class GridFixture extends FixtureConfigHelper {
    async added() {
        const screens = [
            {
                id: 'grid-screen',
                component: GridV
            }
        ];

        const gridPanel: PanelConfig = {
            id: 'grid-panel',
            width: 900,
            screens: screens,
            route: {
                id: 'grid-screen'
            }
        };

        this.vApp.$store.registerModule('grid', grid());
        this.$iApi.emit('gridApi', new GridAPI(this.$iApi, gridPanel));

        const pApi3 = this.$iApi.panel.open(gridPanel);
        console.log(this.$iApi);
    }

    removed() {
        this.vApp.$store.unregisterModule('grid');
        this.$iApi.grid = undefined;
    }
}

export default new GridFixture('grid');
