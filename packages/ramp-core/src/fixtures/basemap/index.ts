import BasemapScreenV from './screen.vue';
import { BasemapAPI } from './api/basemap';
import { basemap } from './store/index';
import BasemapAppbarButtonV from './appbar-button.vue';
import BasemapNavButtonV from './nav-button.vue';

import messages from './lang/lang.csv';

class BasemapFixture extends BasemapAPI {
    async added() {
        console.log(`[fixture] ${this.id} added`);

        this.$iApi.component('basemap-appbar-button', BasemapAppbarButtonV);
        this.$iApi.component('basemap-nav-button', BasemapNavButtonV);

        this.$vApp.$store.registerModule('basemap', basemap());

        this.$iApi.panel.register(
            {
                id: 'basemap-panel',
                config: {
                    screens: { 'basemap-component': BasemapScreenV }
                }
            },
            { i18n: { messages } }
        );
    }

    removed() {
        this.$vApp.$store.unregisterModule('basemap');
    }
}

export default BasemapFixture;
