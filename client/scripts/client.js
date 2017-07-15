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

let app = new Vue({
  el: '#app',
  data: viewData,
  methods: viewMethods
});