import TableStateManager from './table-state-manager';
import { PanelConfig } from '@/store/modules/panel';

export class GridState {
    /**
     * A list of all existing grid configuration files.
     *
     * @type {{ [uid: string]: GridConfig }}
     * @memberof GridState
     */
    grids: { [uid: string]: GridConfig } = {
        'd4f378ce-b557-42e2-80a3-aa767e84fc2c': {
            uid: 'd4f378ce-b557-42e2-80a3-aa767e84fc2c',
            state: <TableStateManager>{}
        }
    };

    /**
     * The grid panel.
     *
     * @type {PanelConfig | null}
     * @memberof GridState
     */
    panel: PanelConfig | null = null;
}

export interface GridConfig {
    /**
     * The uid for the layer that this grid represents.
     *
     * @type {String}
     * @memberof GridItemConfig
     */
    uid: String;

    /**
     * The state manager for this grid.
     *
     * @type {PanelStateManager}
     * @memberof GridItemConfig
     */
    state: TableStateManager;
}
