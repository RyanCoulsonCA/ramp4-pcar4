import { ActionContext, Action, Mutation } from 'vuex';
import { make } from 'vuex-pathify';

import { GridState, GridConfig } from './grid-state';
import { RootState } from '@/store/state';

type GridContext = ActionContext<GridState, RootState>;

const getters = {
    get: (state: GridState) => (id: string): GridConfig | null => {
        return state.grids[id];
    }
};

const actions = {};
const mutations = {};

export enum GridStore {
    grids = 'grid/grids'
}

export function grid() {
    const state = new GridState();

    return {
        namespaced: true,
        state,
        getters: { ...getters },
        actions: { ...actions },
        mutations: { ...mutations, ...make.mutations(['grids']) }
    };
}
