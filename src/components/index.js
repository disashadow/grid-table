import Vue from "vue";
import GridTable from "./GridTable/GridTable.vue";

export default {
    install: function (Vue, options) {
        Vue.component('grid-table', GridTable);
    },
}

export { GridTable }
