// @flow
/**
 * Created by Oleg Rusak on 09.06.2017.
 *
 * Run
 */

module.exports = function (options) {
  const { genos, params, data, handlebars } = options
  const { controller } = params
  const listController = controller.split(/\s/g)

  return Promise.all(listController.map(name => {
    return genos
      .run({
        author: 'Oleg Rusak',
        date: new Date().toISOString(),
        type_entity: 'notification_of_inspection',
        type_controller: name
      })
  }))
}
