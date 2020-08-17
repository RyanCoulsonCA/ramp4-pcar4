<template>
    <div>
        <div class="legend-group-header" @click="toggleGroup">
            <span class="flex-1">{{ legendItem.name }}</span>

            <!-- visibility -->
            <div @click="legendItem.toggleVisibility(); isOpen = !isOpen">
                <svg v-if="legendItem.visibility" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path
                        d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                    />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="20px" height="20px">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                </svg>
            </div>
        </div>
        <div class="legend-group" v-if="isOpen">
            <legend-component v-for="(item, idx) in legendItem.children" :legendItem="item" :key="idx"></legend-component>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Get, Sync, Call } from 'vuex-pathify';

import { LegendStore } from '../store';
import { LegendItem } from '../store/legend-defs';

@Component({
    components: {
        LegendComponent: () => import('./legend-component.vue')
    }
})
export default class LegendGroup extends Vue {
    @Prop() legendItem!: LegendItem;
    @Prop() open!: boolean;

    isOpen: boolean = this.open ? this.open : true;

    // Expands the group to display the layers that belong to it.
    toggleGroup() {
        this.isOpen = !this.isOpen;
    }
}
</script>

<style lang="scss" scoped>
.legend-group {
    @apply px-5 py-10 pr-0;
}
.legend-group-header {
    @apply flex items-center px-5 py-10 pr-0;
}
.legend-group-header:hover {
    @apply bg-gray-200;
}
.legend-item {
    @apply px-5 py-10 pr-0;
}
</style>
