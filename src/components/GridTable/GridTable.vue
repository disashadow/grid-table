<template>
  <div>
    <div v-if="this.title" class="card mb-3">
      <div class="card-header" id="paddin-15">
        <i class="fas fa-table"></i>
        {{this.title}}
      </div>
      <div class="card-body">
        <grid-content
            :data="this.data"
            :columns="this.columns"
            :filter-key="this.filterKey"
            :sortable="this.sortable ? this.sortable : false"
            @emitMethod="emit"
            @sortData="sortData"
          >
          </grid-content>
      </div>
    </div>
    <div v-else>
      <grid-table-content
          :data="this.data"
          :columns="this.columns"
          :filterKey="this.filterKey"
          :sortable="this.sortable ? this.sortable : false"
          @emitMethod="emit"
          @sortData="sortData"
        />
    </div>
  </div>

</template>
<script>
import gridContent from './GridContentTable.vue';
// register the grid component
export default {
  name: 'grid-table',
  components: {
    'grid-table-content': gridContent,
  },
  props: {
    data: Array,
    columns: Array,
    filterKey: String,
    title: String,
    selectOptions: Array,
    sortable: Boolean,
  },
  methods: {
    emit(param) {
      this.$emit(param[0], param[1]);
    },
    sortData(sortData) {
      this.$emit('sortData', sortData);
    },
  },
  mounted() {

  },

};
</script>
