<template>
  <table class="table" id="dataTable" width="100%" cellspacing="0">
        <thead>
          <tr>
            <th
              v-for="key in columns"
              @click="sortBy(key.index)"
              :class="{ active: sortKey == key }"
              :key="key.index"
            >
              {{ key.column | capitalize }}
              <span class="arrow" :class="sortOrders[key.index] > 0 ? 'asc' : 'dsc'">
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
        <tr v-for="(entry, pos) in filteredData" :key="pos">
          <td
            class="no-border-td break-word"
            v-for="(key, index) in columns"
            v-bind:class="{'align-center':key.align_center}"
            :key="index"
          >
              <span v-if="key.type =='raw'"  >{{entry[key.index]}}</span>
              <button
                v-on:click="emitMethod(key.eventName, entry)"
                v-if="key.type =='button' && entry[key.index]!= 'N/A'"
                class="btn btn-info">
                  {{entry[key.index]}}
              </button>
              <span
                v-if="key.type =='button' && entry[key.index] == 'N/A'"
              >
                {{entry[key.index]}}
              </span>
              <router-link v-if="key.type =='link'" v-bind:to="calculateLinkPath(entry, key)" >
                {{entry[key.index]}}
              </router-link>
              <span
                v-if="key.type == 'icon' && !Array.isArray(key.icon_class) &&
                  key.hasOwnProperty('title')"
                v-bind:class="key.icon_class"
                style="text-align:center"
                v-bind:title="entry[key['title']]"
                v-bind:data-action-uuid="entry[key['title']]"
                v-on:click="emitMethod(key.eventName, entry)"
              ></span>
              <span
                v-if="key.type == 'icon' && Array.isArray(key.icon_class)"
                v-bind:class="calculateClass(entry, key.icon_class)"
                style="text-align:center"
                v-bind:title="entry[key['title']]"
                v-bind:data-action-uuid="entry[key['title']]"
                v-on:click="emitMethod(key.eventName, entry)"
              ></span>
              <span
                v-if="key.type === 'icon' &&
                  !Array.isArray(key.icon_class) &&
                  !key.hasOwnProperty('title')"

                v-bind:class="key.icon_class"
                style="text-align:center"
                v-on:click="emitMethod(key.eventName, entry)"
              ></span>
              <span
                v-if="key.type == 'float'"
              >
                {{ parseFloat(Math.round(entry[key.index] * 100) / 100).toFixed(2) }}
              </span>
              <select
                v-if="key.type == 'select'"
                :disabled="entry[key.index].length == 0"
                @change="onChangeEmitMethod(key.eventName,entry, $event)"
                class="form-control"
              >
                <option
                  v-bind:value="option.value"
                  v-bind:selected="option.selected"
                  v-for="option in entry[key.index]"
                  :key="option.value">{{option.value}}
                </option>
              </select>

              <select
                v-if="key.type == 'dropdown'"
                :disabled="entry[key.index].length == 0"
                @change="onChangeEmitMethod(key.eventName,entry, $event)"
                class="form-control"
              >
                <option >Select an option</option>
                <option
                  v-bind:value="option"
                  v-for="option in entry[key.index]"
                  :key="option">{{option}}
                </option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
</template>
<script>
export default {
  name: 'grid-table-content',
  props: {
    data: Array,
    columns: Array,
    filterKey: String,
    title: String,
    selectOptions: Array,
    sortable: Boolean,
  },
  data() {
    const sortOrders = {};
    this.columns.forEach((key) => {
      sortOrders[key.index] = 1;
    });
    return {
      sortKey: '',
      sortOrders,
    };
  },

  computed: {
    filteredData() {
      const sortKey1 = this.sortKey;
      const filterKey = this.filterKey && this.filterKey.toLowerCase();
      const order = this.sortOrders[sortKey1] || 1;
      let data1 = this.data;
      if (filterKey) {
        data1 = data1.filter(row => Object.keys(row).some(key => String(row[key])
          .toLowerCase().indexOf(filterKey) > -1));
      }
      if (sortKey1 && !this.sortable) {
        data1 = data1.slice().sort((a, b) => {
          const akey1 = a[sortKey1];
          const bkey1 = b[sortKey1];
          let value = 0;
          if (akey1 === bkey1) {
            value = 0;
          } else if (akey1 > bkey1) {
            value = 1;
          } else {
            value = -1;
          }
          return value * order;
          // return (a === b ? 0 : a > b ? 1 : -1) * order;
        });
      }
      return data1;
    },
  },
  filters: {
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
  },
  methods: {
    sortBy(key) {
      let lastKey = '';
      if (this.sortKey !== '') {
        lastKey = this.sortKey;
      }
      this.sortKey = key;
      console.log(this.sortOrders);
      console.log(this.sortOrders[key] * -1);
      this.sortOrders[key] = this.sortOrders[key] * -1;
      console.log(this.sortOrders);
      const direction = this.sortOrders[key];
      if (this.sortable) {
        if (lastKey !== '' && lastKey !== key) {
          this.sortOrders[lastKey] = this.sortOrders[lastKey] * -1;
        }
        this.$emit('sortData', { key, direction });
      }
    },
    calculateLinkPath(entry, key) {
      let link = '';
      const parts = key.path.split('/');
      for (let x = 0; x < parts.length; x++) {
        if (parts[x] !== '') {
          link += '/';
          if (parts[x].indexOf(':') >= 0) {
            const index = parts[x].substr(1, parts[x].length);
            link += entry[index];
          } else {
            link += parts[x];
          }
        }
      }
      return link;
    },
    emitMethod(eventName, param) {
      this.$emit('emitMethod', [eventName, param]);
    },
    onChangeEmitMethod(eventName, param, event) {
      console.log(param);
      this.$emit('emitMethod', [eventName, [param, event.target.selectedOptions[0].value]]);
    },
    calculateClass(row, classObject) {
      for (let x = 0; x < classObject.length; x += 1) {
        /* eslint no-eval: 0 */
        if (eval(`${row[classObject[x].index]}  ${classObject[x].operator} ${classObject[x].val}`)) {
          return classObject[x].class;
        }
      }
      return '';
    },
  },
};
</script>
