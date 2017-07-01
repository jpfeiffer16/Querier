const { ipcRenderer } = require('electron');

jQuery(document).ready(() => {
  $('button.run').click(function() {
    let $this = $(this);
    let $thisTab = $this.parent().parent('.tab-content');
    let queryValue = $thisTab.find('textarea.editor').val();
    let username = $thisTab.find('input.username-input').val();
    let password = $thisTab.find('input.password-input').val();
    let servername = $thisTab.find('input.server-input').val();
    let database = $thisTab.find('input.database-input').val();

    ipcRenderer.once('runQuery-reply', (event, result) => {
      //TODO: Do stuff with the result here.
      console.dir(result);
      renderResult($thisTab, result);
    });

    ipcRenderer.send('runQuery', {
      query: queryValue,
      config: {
        user: username,
        password: password,
        server: servername,
        database: database,
        port: false
      }
    });
  });
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