import AppbarV from './appbar.vue';
import { AppbarAPI } from './api/appbar';
import { appbar, AppbarItemInstance } from './store';
import { GlobalEvents, PanelInstance } from '@/api';
import messages from './lang/lang.csv';

// "It's a trap!" -- Admiral Appbar

class AppbarFixture extends AppbarAPI {
    eventHandlers: string[] = [];
    async added() {
        console.log(`[fixture] ${this.id} added`);

        // TODO: registering a fixture store module seems like a common action almost every fixture needs; check if this can be automated somehow
        this.$vApp.$store.registerModule('appbar', appbar());

        // merge in translations since this has no panel
        Object.entries(messages).forEach(value =>
            this.$vApp.$i18n.mergeLocaleMessage(...value)
        );

        const appbarInstance = this.extend(AppbarV, {
            store: this.$vApp.$store,
            i18n: this.$vApp.$i18n
        });

        // TODO: the `innerShell` reference will probably get used more than once; consider creating a dedicated ref on `$iApi`;
        const innerShell = this.$vApp.$el.getElementsByClassName(
            'inner-shell'
        )[0];
        innerShell.insertBefore(appbarInstance.$el, innerShell.children[0]);

        this._parseConfig(this.config);
        this.$vApp.$watch(
            () => this.config,
            value => this._parseConfig(value)
        );

        // Add and remove temp appbar buttons when panels are opened and close
        this.eventHandlers.push(
            this.$iApi.event.on(
                GlobalEvents.PANEL_OPENED,
                (panel: PanelInstance) => {
                    this.$vApp.$store.dispatch(
                        'appbar/addTempButton',
                        panel.id
                    );
                }
            )
        );

        this.eventHandlers.push(
            this.$iApi.event.on(
                GlobalEvents.PANEL_CLOSED,
                (panel: PanelInstance) => {
                    this.$vApp.$store.dispatch(
                        'appbar/removeTempButton',
                        panel.id
                    );
                }
            )
        );

        // since components used in appbar can be registered after this point, listen to the global component registration event and re-validate items
        // TODO revisit. this seems to be self-contained to the appbar fixture, so ideally can stay as is and not worry about events api.
        this.eventHandlers.push(
            this.$iApi.event.on(
                GlobalEvents.COMPONENT,
                this._validateItems.bind(this)
            )
        );
    }

    removed() {
        this.$vApp.$store.unregisterModule('appbar');

        this.eventHandlers.forEach(eventHandler =>
            this.$iApi.event.off(eventHandler)
        );
    }
}

export default AppbarFixture;
