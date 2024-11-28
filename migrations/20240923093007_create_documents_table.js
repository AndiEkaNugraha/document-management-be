exports.up = function(knex) {
   return knex.schema.createTable('document', function(table) {
     table.increments('id').primary();
     table.string('document_title', 255).notNullable();
     table.string('document_type', 100);
     table.string('department', 100);
     table.text('information');
     table.text('created_by');
     table.text('updated_by');
     table.timestamp('created_at').defaultTo(knex.fn.now());
     table.timestamp('updated_at').defaultTo(knex.fn.now());
   });
 };
 
 exports.down = function(knex) {
   return knex.schema.dropTable('document');
 };
 