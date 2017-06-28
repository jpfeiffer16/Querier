const { fork, spawn, exec } = require('child_process');
const fs = require('fs');

module.exports = {
  runQuery: function(queryInfo, cb) {
    fs.readFile('./template.sh', 'utf-8', (err, command) => {
      if (err) {
        console.error(err);
        return;
      }

      for (key in queryInfo) {
        command = command.replace(`{${ key }}`, queryInfo[key]);
      }

      let queryProc = exec(command, {
        shell: true
      });


      queryProc.stdout.pipe(fs.createWriteStream('./test.csv'));
      queryProc.stdout.on('data', (data) => {
        console.log(data);
      });
      queryProc.stderr.on('data', (data) => {
        console.err(data);
      });
    });


  },
  runQueryDriver: function(config, query, cb) {
    console.log('Running query');
    const sql = require('mssql');

    console.log('Before connect');
    let connectionPool = null;
    sql.connect(configTest).then((pool) => {
        // Query 
        connectionPool = pool;
        let queryResult = pool
          .request()
          .query(query);

        console.log('running query');
        return queryResult;
    }).then((result) => {
      console.log('Getting here');
      cb(result);
      sql.close(connectionPool);
    });
    
  }
};