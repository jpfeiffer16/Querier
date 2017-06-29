const { fork, spawn, exec } = require('child_process');
const fs = require('fs');
const sql = require('mssql');

module.exports = (function() {
  let poolCollection = [];

  function query(config, query, cb) {

    let pool = getPool(config);
    if (pool == null) {
      createPool(config, (pool) => {
        runQuery(pool, query, cb);
      });
    } else {
      runQuery(pool, query, cb);
    }
  }

  function createPool(config, cb) {
    let pool = new sql.ConnectionPool(JSON.parse(JSON.stringify(config)));
    pool.connect((err) => {
      if (err) {
        console.error(err);
        return;
      }
      cb(pool);
    });
    poolCollection.push({
      config: config,
      pool: pool
    });
  }

  function getPool(config) {
    let pool = null;
    let results = poolCollection.filter((poolObj) => {
      return Object.keys(poolObj.config).filter((key) => {
        return poolObj.config[key] != config[key];
      }).length == 0;
    });
    if (results.length > 0) {
      pool = results[0].pool;
    }
    if (pool != null) {
      console.log('Found existing pool');
    } else {
      console.log('Could not find existing pool');
    }
    return pool;
  }

  function runQuery(pool, query, cb) {
    pool.request()
      .query(query)
      .then(cb)
      .catch((err) => {
        console.error(err);
      });
  }

  return {
    query
  }
})();