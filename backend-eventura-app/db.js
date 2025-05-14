const oracledb = require("oracledb");
require('dotenv').config();

oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_PATH });

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=tcps)(HOST=${process.env.DB_HOST})(PORT=${process.env.DB_PORT}))(CONNECT_DATA=(SERVICE_NAME=${process.env.DB_SERVICE_NAME}))(SECURITY=(MY_WALLET_DIRECTORY=${process.env.WALLET_PATH})))`,
};

async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

module.exports = { getConnection };