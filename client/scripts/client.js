const { ipcRenderer } = require('electron');

let defaultTab = {
  name: 'SQLQuery',
  active: false,
  config: {
    user: '',
    password: '',
    server: '',
    database: '',
    port: false
  },
  query: '',
  results: {
    tables: [],
    rowsAffected: 0,
    error: null
  },
  resultViewTab: 'tables'
}

let viewData = {
  tabs: [
    JSON.parse(JSON.stringify(defaultTab))
  ]
};

//Setup first active tab
viewData.tabs[0].active = true;

let viewMethods = {
  runQuery: function(tab) {
    console.log('runQuery');
    console.log(tab);
    ipcRenderer.once('runQuery-reply', (event, result) => {
      console.dir(result);
      tab.results = result;
      if (result.error != null) {
        tab.resultViewTab = 'messages';
      } else {
        tab.resultViewTab = 'tables';
      }
    });

    ipcRenderer.send('runQuery', {
      query: tab.query,
      config: tab.config
    });
  },
  newTab: function() {
    let newTab = JSON.parse(JSON.stringify(defaultTab));
    newTab.name += viewData.tabs.length + 1;
    viewData.tabs.push(newTab);
    viewMethods.focusTab(newTab);
  },
  focusTab: function(tab) {
    viewData.tabs.forEach((tab) => {
      tab.active = false;
    });
    tab.active = true;
  },
  closeTab: function(tab) {
    for (let i = 0; i < viewData.tabs.length; i++) {
      let thisTab = viewData.tabs[i];
      if (thisTab === tab) {
        viewData.tabs.splice(i, 1);
        break;
      }
    }
  }
};

Vue.component('sql-editor', {
  data: function() {
    return {
      internalValue: ''
    }
  },
  template: '<div class="sql-editor"></div>',
  props: ['value'],
  watch: {
    internalValue: function() {
      this.$emit('input', this.internalValue);
    }
  },
  mounted: function() {
    let self = this;
    console.log('Created');
    console.log(this);
    setTimeout(() => {
      let editor = CodeMirror(this.$el, {
        mode: 'text/x-mssql',
        smartIndent: true,
        lineNumbers: true,
        matchBrackets : true,
        autofocus: true,
        extraKeys: {"Ctrl-Space": "autocomplete"},
        hintOptions: {tables: {
          users: {name: null, score: null, birthDate: null},
          countries: {name: null, population: null, size: null}
          }
        }
      });
      editor.on('change', function(cm) {
        self.content = cm.getValue();
        self.$emit('input', self.content);
      });
      editor.refresh();

      this.$el.addEventListener('keydown', (event) => {
        if (event.key == 'F5') {
          self.$emit('run');
        }
      });
    });
  },
  created: function() {
    this.internalValue = this.value;
  }
});

let app = new Vue({
  el: '#app',
  data: viewData,
  methods: viewMethods
});