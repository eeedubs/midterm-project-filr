
exports.up = function(knex, Promise) {
    return knex.schema.createTable('categories', function (table) {
        table.increments('id').primary();
        table.string('label');
        table.integer('user_id').references('users.id').onDelete('cascade');
      })
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('categories');
  };