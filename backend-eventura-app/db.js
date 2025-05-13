const oracledb = require("oracledb");

oracledb.initOracleClient({ libDir: "C:\\instantclient_23_8" }); // Cambiar la ruta si es necesario

const dbConfig = {
  user: "admin",
  password: "Eventura0705",
  connectString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=tcps)(HOST=adb.mx-queretaro-1.oraclecloud.com)(PORT=1522))(CONNECT_DATA=(SERVICE_NAME=g55dd3bf034ee56_huvisv79mtzld6f9_high.adb.oraclecloud.com))(SECURITY=(MY_WALLET_DIRECTORY=C:\\Users\\felip\\OneDrive\\Desktop\\eventura_app\\backend-eventura-app\\wallet)))"
};

async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

module.exports = { getConnection };