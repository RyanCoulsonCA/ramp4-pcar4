<template>
    <panel-screen>
        <template #header>
            Legend
        </template>

        <template #controls>
            <pin @click="panel.pin()" :active="isPinned"></pin>
            <close @click="panel.close()"></close>
        </template>

        <template #content>
            <legend-header></legend-header>
            <legend-component v-for="(item, idx) in children" :legendItem="item" :key="idx"></legend-component>
            <!-- <ul class="" v-focus-list>
                <li class="pl-10" v-for="(item, idx) in children" v-bind:key="idx" focus-item>
                    {{ item.name }}
                </li>
            </ul> -->
        </template>
    </panel-screen>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Get, Sync, Call } from 'vuex-pathify';
import { PanelInstance } from '@/api';

import { LegendStore, LegendElement } from './store';
import LegendHeader from './legend-header.vue';
import LegendComponent from './components/legend-component.vue';

@Component({
    components: {
        LegendHeader,
        LegendComponent
    }
})
export default class LegendV extends Vue {
    @Prop() panel!: PanelInstance;
    // fetch store properties/data
    @Get(LegendStore.children) children!: Array<LegendElement>;

    mounted() {
        console.log(this.children);
    }

    get isPinned(): boolean {
        return this.panel.isPinned;
    }
}
</script>

<style lang="scss" scoped></style>
