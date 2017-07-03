Vue.component('results-grid', {
  template: `
    <table class="results-table">
      <thead>
        <tr>
          <th v-for="column in table.columns">
            {{ column.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.rows">
          <td v-bind:class="{ active: column.active }" v-on:click="setActive(column)" v-for="column in row">
            {{ column.value }}
          </td>
        </tr>
      </tbody>
    </table>
    `,
  props: ['table'],
  mounted: function() {
    console.log('Results View is Mounted');
    console.log(this);
  },
  methods: {
    setActive: function(row) {
      console.log(row);
      row.active = true;
    }
  }
});