import Vue from 'vue';
import { APIScope } from '@/api/common';
import { InstanceAPI } from '@/api/internal';
import { PanelConfig } from '@/store/modules/panel';
import { GridStore, GridConfig, GridState } from '../store';
import { Get, Sync, Call } from 'vuex-pathify';

export class GridAPI extends APIScope {
    constructor(iApi: InstanceAPI, panel: PanelConfig) {
        super(iApi);
        this.$iApi.grid = this;

        this.panel = panel;
    }

    /**
     * Open the grid for the layer with the given uid.
     *
     * @param {string} id
     * @memberof GridAPI
     */
    open(id: string): void {
        this.$iApi.panel.open(this.panel);
    }
}

export interface GridAPI {
    panel: PanelConfig;
}
