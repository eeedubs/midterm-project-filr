
exports.up = function(knex, Promise) {
    return knex.schema.createTable('category_resources', function (table) {
        table.increments('id');
        table.integer('category_id').references('categories.id');
        table.integer('resource_id').references('resources.id');
      })
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('category_resources');
  };
  