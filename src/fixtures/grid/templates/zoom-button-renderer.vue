<template>
    <button
        type="button"
        class="flex items-center justify-center w-42 h-46"
        :content="
            t(`grid.cells.zoom${zoomStatus === 'none' ? '' : `.${zoomStatus}`}`)
        "
        v-tippy="{ placement: 'top' }"
        @click="zoomToFeature"
        tabindex="-1"
        ref="button"
    >
        <div
            v-if="zoomStatus === 'zooming'"
            class="m-auto animate-spin spinner h-20 w-20"
        ></div>
        <svg
            v-else-if="zoomStatus === 'zoomed'"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="green"
            class="w-20 h-20"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
            />
        </svg>
        <svg
            v-else-if="zoomStatus === 'error'"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="red"
            class="w-20 h-20"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
        <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            version="1.1"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xml:space="preserve"
        >
            <g transform="matrix(0.67 0 0 0.67 8 8)">
                <path
                    style="
                        stroke: none;
                        stroke-width: 1;
                        stroke-dasharray: none;
                        stroke-linecap: butt;
                        stroke-dashoffset: 0;
                        stroke-linejoin: miter;
                        stroke-miterlimit: 4;
                        fill: #979797;
                        fill-rule: nonzero;
                        opacity: 1;
                    "
                    transform=" translate(-12, -12)"
                    d="M 12 2 C 6.48 2 2 6.48 2 12 C 2 17.52 6.48 22 12 22 C 17.52 22 22 17.52 22 12 C 22 6.48 17.52 2 12 2 z M 11 19.93 C 7.05 19.44 4 16.08 4 12 C 4 11.38 4.08 10.79 4.21 10.21 L 9 15 L 9 16 C 9 17.1 9.9 18 11 18 L 11 19.93 z M 17.9 17.39 C 17.639999999999997 16.580000000000002 16.9 16 15.999999999999998 16 L 14.999999999999998 16 L 14.999999999999998 13 C 14.999999999999998 12.45 14.549999999999999 12 13.999999999999998 12 L 8 12 L 8 10 L 10 10 C 10.55 10 11 9.55 11 9 L 11 7 L 13 7 C 14.1 7 15 6.1 15 5 L 15 4.59 C 17.93 5.779999999999999 20 8.649999999999999 20 12 C 20 14.08 19.2 15.97 17.9 17.39 z"
                    stroke-linecap="round"
                />
            </g>
        </svg>
    </button>
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';

import type { InstanceAPI, LayerInstance } from '@/api/internal';
import { useI18n } from 'vue-i18n';
import { useLayerStore } from '@/stores/layer';
import type { AttributeMapPair } from '../store';
import { GeometryType, LayerType } from '@/geo/api';

const zoomStatus = ref<'zooming' | 'zoomed' | 'error' | 'none'>('none');
const props = defineProps(['params']);
const iApi = inject<InstanceAPI>('iApi')!;
const layerStore = useLayerStore();
const button = ref<HTMLElement>();
const { t } = useI18n();

const zoomToFeature = () => {
    if (zoomStatus.value !== 'none') {
        return;
    }
    zoomStatus.value = 'zooming';
    const layer: LayerInstance | undefined = layerStore.getLayerByUid(
        props.params.data.rvUid
    );

    if (layer === undefined || !layer.isLoaded) {
        updateZoomStatus('error');
        return;
    }

    // similar to the sql lookup, the details panel must use the original OID field to perform zoomies
    const oidPair = props.params.layerCols[layer.id].find(
        (pair: AttributeMapPair) => pair.origAttr === layer.oidField
    );
    const oid = props.params.data[oidPair.mappedAttr ?? oidPair.origAttr];

    const zoomUsingGraphic = () => {
        const opts = { getGeom: true };
        layer
            .getGraphic(oid, opts)
            .then(g => {
                if (g.geometry.invalid()) {
                    console.error(`Could not find graphic for objectid ${oid}`);
                    updateZoomStatus('error');
                } else {
                    iApi.geo.map.zoomMapTo(g.geometry);
                    updateZoomStatus('zoomed');
                    iApi.updateAlert(iApi.$i18n.t('grid.cells.alert.zoom'));

                    // if grid is teleported, scroll up to the map
                    if (props.params.isTeleport) {
                        iApi.$element._container?.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }
            })
            .catch(() => {
                updateZoomStatus('error');
            });
    };

    if (
        layer.layerType === LayerType.FEATURE &&
        layer.geomType !== GeometryType.POINT
    ) {
        layer
            .getGraphicExtent(oid)
            .then(e => {
                iApi.geo.map.zoomMapTo(e);
                updateZoomStatus('zoomed');
                iApi.updateAlert(iApi.$i18n.t('grid.cells.alert.zoom'));

                // if grid is teleported, scroll up to the map
                if (props.params.isTeleport) {
                    iApi.$element._container?.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            })
            .catch(() => {
                zoomUsingGraphic();
            });
    } else {
        zoomUsingGraphic();
    }
};

const updateZoomStatus = (value: 'zooming' | 'zoomed' | 'error' | 'none') => {
    if (value === 'zoomed' || value === 'error') {
        setTimeout(() => {
            zoomStatus.value = value;
            (button.value as any)?._tippy.show();
            setTimeout(() => {
                (button.value as any)?._tippy.hide();
                zoomStatus.value = 'none';
            }, 3000);
        }, 300);
    } else {
        zoomStatus.value = value;
    }
};

onMounted(() => {
    // need to hoist events to top level cell wrapper to be keyboard accessible
    props.params.eGridCell.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' && zoomStatus.value === 'none') {
            zoomToFeature();
        }
    });
    props.params.eGridCell.addEventListener('focus', () => {
        (button.value as any)?._tippy.show();
    });
    props.params.eGridCell.addEventListener('blur', () => {
        (button.value as any)?._tippy.hide();
    });
});

onBeforeUnmount(() => {
    props.params.eGridCell.removeEventListener(
        'keydown',
        (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                zoomToFeature();
            }
        }
    );
    props.params.eGridCell.removeEventListener('focus', () => {
        (button.value as any)?._tippy.show();
    });
    props.params.eGridCell.removeEventListener('blur', () => {
        (button.value as any)?._tippy.hide();
    });
});
</script>

<style lang="scss" scoped></style>
