const {clipboard} = require('electron');

Vue.component('results-grid', {
  template: `
    <table class="results-table">
      <input
        type="text"
        class="hidden-input"
        v-on:keydown="keypress" />
      <thead>
        <tr>
          <th class="col-index-header"></th>
          <template v-for="(column, index) in table.columns">
            <th
              v-bind:style="{ width: column.width + 'px' }"
              v-on:dblclick="selectColumn(index)">
              {{ column.name }}
              <!--<span class="resizer"></span>-->
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in table.rows">
          <td
            v-on:dblclick="selectRow(rowIndex)"
            class="col-index">
            {{ rowIndex }}
          </td>
          <td
            v-bind:class="{ active: column.active }"
            v-on:click="toggleActive(rowIndex, columnIndex)"
            v-for="(column, columnIndex) in row">
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
    Array
      .from(this.$el.getElementsByTagName('th'))
      .forEach((el) => {
        el.style.width = el.clientWidth + 'px';
      });
  },
  methods: {
    toggleActive: function(rowIndex, columIndex) {
      this.table.rows[rowIndex][columIndex].active =
        !(this.table.rows[rowIndex][columIndex].active);
      this.focusInput();
    },
    selectColumn: function(index) {
      this.table.rows.forEach(function(row) {
        row[index].active = true;
      });
      this.focusInput();
    },
    selectRow: function(rowIndex) {
      this.table.rows[rowIndex].forEach((column) => {
        column.active = true;
      });
    },
    focusInput: function() {
      let hiddenInput = Array.from(this.$el.children).filter((child) => {
        return (
          child.tagName.toLowerCase() == 'input' &&
          ~child.className.indexOf('hidden-input')
        );
      });
      if (hiddenInput.length > 0) {
        hiddenInput = hiddenInput[0];
      } else {
        return;
      }
      hiddenInput.focus();
    },
    keypress: function(e) {
      // console.log(e);
      if (e.key == 'Escape') {
        e.srcElement.blur();
        //De-select all
        this.table.rows.forEach((row) => {
          row.forEach((column) => {
            column.active = false;
          });
        });
      }
      if (e.key == 'c' && e.ctrlKey) {
        //Copy cells to clipboard here.
        console.log('Copying to clipboard');

        let selectedRows = [];
        this.table.rows.forEach((row, rowIndex) => {
          // let thisRowHasActiveCells = false;
          let thisRowSelected = [];
          row.forEach((column, columIndex) => {
            if (column.active) {
              // thisRowHasActiveCells = true;
              // copyString += `\t`
              thisRowSelected.push(column);
            }
          });
          if (thisRowSelected.length > 0) {
            selectedRows.push(thisRowSelected);
          }
        });
        let copyString = '';
        selectedRows.forEach((row) => {
          copyString += row.map((thisRow) => {
            return thisRow.value;
          }).join('\t') + '\n';
        });
        clipboard.writeText(copyString);
      }
      if (e.key == 'a' && e.ctrlKey) {
        //Select all
        this.table.rows.forEach((row) => {
          row.forEach((column) => {
            column.active = true;
          });
        });
      }
    },
  }
});