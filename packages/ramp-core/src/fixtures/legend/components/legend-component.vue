<template>
    <component :is="templates[legendItem.type]" :legendItem="legendItem"></component>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Get, Sync, Call } from 'vuex-pathify';

import { LegendStore } from '../store';
import { LegendItem } from '../store/legend-defs';

// TODO: implement visibility group
// TODO: implement regular group
// TODO: implement regular layer

import LayerEntry from './legend-entry.vue';
import LegendGroup from './legend-group.vue';
import LegendVisibilitySet from './legend-visibility-set.vue';

@Component
export default class LegendComponent extends Vue {
    @Prop() legendItem!: LegendItem;

    // Binds each type to its respective Vue component.
    templates = {
        VisibilitySet: LegendVisibilitySet,
        LegendGroup: LegendGroup,
        LegendEntry: LayerEntry
    };
}
</script>

<style lang="scss" scoped></style>
