const {Connection, Request} = require('tedious');
const {Sequelize} = require('sequelize');
require('dotenv').config();

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;


const config = {
    authentication: {
        options: {
            userName: dbUser,
            password: dbPassword
        },
        type:"default"
    },
    server: dbHost,
    options:{
        database: dbName,
        encrypt: false,
        trustServerCertificate: true
    }
};

const connx = new Connection(config);

connx.on("connect", err =>{
    if(err){
        console.error(err.message)
    }else{
        console.log("[!] Connection with Tedious OK.\n\tInitializating the Query Test.");
        testConnectionDatabase();

    }
})

connx.connect();


function testConnectionDatabase() { 
    const request = new Request(
      `select top 1 * from sys.objects;`,
      (err, rowCount) => {
        if (err) {
          console.error(err.message);
        } else {        
          console.log(`[!] Consulta de Teste retornou ${rowCount} linha(s). Conexão sucedida.\n`);
        }
      }
    );
    connx.execSql(request);
};

console.log("\n\n");

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    dialect: "mssql",
    host: dbHost,
})

sequelize
.authenticate()
.then(()=>{
    console.log("[!] Connection with Sequelize OK.")
    console.log("[!] ==========================================================\n")

})
    
.catch(err=>{
    console.error("[X] Error while connecting to Database using Sequelize: \n\n ",err);
});


/*
    Aqui jás todas os Models necessários.
*/
sequelize.models.UACModel = require('../database/models/UAC/UACModel')(sequelize);
    sequelize.models.UACModel.sync({
        logging: console.log,
        force: false,
        alter: false,
    }).then(()=>{
        console.log("[!] User Table synced with Database.\n");
    })
//sequelize.models.productsModel =  require('../database/models/ProductsModel')(sequelize);
//sequelize.models.stateModel =  require('../database/models/StateModel')(sequelize);

//sequelize.models.AccessControlModel = require('../database/models/UAC/AccessControlModel')(sequelize);
//sequelize.models.AccessGroupModel = require('../database/models/UAC/AccessGroupModel')(sequelize);


module.exports = sequelize.models;