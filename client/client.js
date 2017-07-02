const { ipcRenderer } = require('electron');

jQuery(document).ready(() => {
  // $('button.run').click(function() {
  //   let $this = $(this);
  //   let $thisTab = $this.parent().parent('.tab-content');
  //   let queryValue = $thisTab.find('textarea.editor').val();
  //   let username = $thisTab.find('input.username-input').val();
  //   let password = $thisTab.find('input.password-input').val();
  //   let servername = $thisTab.find('input.server-input').val();
  //   let database = $thisTab.find('input.database-input').val();

  //   ipcRenderer.once('runQuery-reply', (event, result) => {
  //     //TODO: Do stuff with the result here.
  //     console.dir(result);
  //     renderResult($thisTab, result);
  //   });

  //   ipcRenderer.send('runQuery', {
  //     query: queryValue,
  //     config: {
  //       user: username,
  //       password: password,
  //       server: servername,
  //       database: database,
  //       port: false
  //     }
  //   });
  // });
});

function renderResult($tabContent, result) {
  let $table = $tabContent.find('.results-table');
  let $columns = $table.find('thead tr');
  let $values = $table.find('tbody');

  $columns.empty();
  $values.empty();

  Object.keys(result.columns).forEach((key) => {
    $columns.append(`<th>${ result.columns[key].name }</th>`);
  });

  result.recordset.forEach((record) => {
    let row = '<tr>'
    Object.keys(record).forEach((key) => {
      row += `<td>${ record[key] }</td>`
    });
    row += '</tr>'
    $values.append(row);
  });
}

let defaultTab = {
  name: 'Tab1',
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
    columns: {},
    recordset: []
  }
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
      //TODO: Do stuff with the result here.
      console.dir(result);
      // renderResult(tab, result);
      tab.results = result;
    });

    ipcRenderer.send('runQuery', {
      query: tab.query,
      config: tab.config
    });
  },
  newTab: function() {
    viewData.tabs.push(JSON.parse(JSON.stringify(defaultTab)));
    console.log('New Tab!');
  },
  focusTab: function(tab) {
    viewData.tabs.forEach((tab) => {
      tab.active = false;
    });
    tab.active = true;
  }
};

let app = new Vue({
  el: '#app',
  data: viewData,
  methods: viewMethods
});

function renderCodeEditors() {
  let editors = document.getElementsByClassName('editor');
  for (let i = 0; i < editors.length; i++) {
    let editor = editors[i];
    let thisEditor = CodeMirror.fromTextArea(editor, {
      lineNumbers: true
    });
    thisEditor.on('change', () => {
      // thisEditor.save();
      
    });
  }
}

renderCodeEditors();