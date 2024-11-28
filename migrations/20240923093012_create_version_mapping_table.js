exports.up = function(knex) {
   return knex.schema.createTable('version_mapping', function(table) {
     table.increments('id').primary();
     table.integer('document_id').unsigned().references('id').inTable('document').onDelete('CASCADE');
     table.string('document_unique_name', 255).notNullable();
     table.string('version', 20).notNullable();
     table.text('information')
     table.text('created_by');
     table.timestamp('created_at').defaultTo(knex.fn.now());
   });
 };
 
 exports.down = function(knex) {
   return knex.schema.dropTable('version_mapping');
 };
 