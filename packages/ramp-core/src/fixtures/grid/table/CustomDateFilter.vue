<template>
    <div>
        <div style="float: left; display: inline; width: 49%; z-index: 10;">
            <input class="rv-input" style="width: 100%;" type="date" placeholder="date min" v-model="minVal" @change="minValChanged()" />
        </div>
        <div style="float: left; display: inline; width: 49%;">
            <input class="rv-input" style="width: 100%;" type="date" placeholder="date max" v-model="maxVal" @change="maxValChanged()" />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Watch, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class CustomNumberFilter extends Vue {
    minVal: any = null;
    maxVal: any = null;
    colDef: any;

    beforeMount() {
        this.colDef = this.params.column.colDef;
        this.minVal = this.params.minValDefault;
        this.maxVal = this.params.maxValDefault;
        this.minValChanged();
        this.maxValChanged();
    }

    minValChanged() {
        let that = this;
        this.params.parentFilterInstance(function(instance: any) {
            that.setFilterModel(instance);
            that.params.stateManager.setColumnFilter(that.colDef.field + ' min', that.minVal);
        });
    }

    maxValChanged() {
        let that = this;
        this.params.parentFilterInstance(function(instance: any) {
            that.setFilterModel(instance);
            that.params.stateManager.setColumnFilter(that.colDef.field + ' max', that.maxVal);
        });
    }

    setFilterModel(instance: any) {
        let that = this;
        console.log(that.minVal, that.maxVal);
        if (that.maxVal !== '' && that.minVal !== '') {
            console.log('yeah we\'re here')
            instance.setModel({
                type: 'inRange',
                dateFrom: that.minVal,
                dateTo: that.maxVal
            });
        } else if (that.minVal === '') {
            console.log('here1')
            instance.setModel({
                type: 'lessThanOrEqual',
                dateFrom: that.maxVal
            });
        } else if (that.maxVal === '') {
            console.log('here2');
            instance.setModel({
                type: 'greaterThanOrEqual',
                dateFrom: that.minVal
            });
            // otherwise clear filters
        } else {
            instance.setModel(null);
        }
        this.params.api.onFilterChanged();
    }

    onParentModelChanged(parentModel: any) {}

    setModel() {
        console.log('yo')
        return {
            filterType: 'date',
            type: 'inRange',
            filter: this.minVal,
            filterTo: this.maxVal
        };
    }
}

export default interface CustomNumberFilter {
    minVal: any;
    maxVal: any;
    colDef: any;
    params: any;
}
</script>

<style lang="scss" scoped>
.ag-floating-filter-full-body input,
.ag-floating-filter-full-body select,
.rv-global-search {
    @apply bg-transparent text-black-75 h-24 pb-8 border-0 border-b-2;
}
.rv-input {
    @apply m-0 py-1;
}
</style>
