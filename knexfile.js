require('dotenv').config();
module.exports = {
   development: {
     client: 'mysql2',
     connection: {
       host: process.env.DB_HOST,
       user: process.env.USER,
       password: process.env.PASSWORD,
       database: process.env.DATABASE
     },
     migrations: {
       tableName: 'knex_migrations',
       directory: './migrations'
     },
     seeds: {
       directory: './seeds'
     }
   }
 };
 