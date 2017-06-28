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