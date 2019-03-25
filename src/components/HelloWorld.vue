<template>
  <div class="hello">
    <grid-table :columns="gridColumns" :data="[]" :filterKey="''"/>123
  </div>
</template>

<script>
import  GridTable from './GridTable/GridTable.vue';
export default {
  name: 'HelloWorld',
  components: {
    'grid-table': GridTable
  },
  data() {
    return {
      gridColumns: [
        {
          column: 'test 1', index: 'test_1', type:'raw',
        },
        {
          column: 'test 2', index: 'test_2', type:'raw',
        },
      ]
    };
  },
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
