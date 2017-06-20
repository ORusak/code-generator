// @flow
/**
 * Created by Oleg Rusak on 09.06.2017.
 *
 * Run
 */

const handlebars = require('handlebars')

const helpers = require('../helpers')
const genosProvider = require('../../../lib/genos')

Object.keys(helpers).forEach((key) => {
  const helper = helpers[key]

  handlebars.registerHelper(helper.name, helper)
})

const genos = genosProvider({
  handlebars,
  dirTemplate: 'example/templates/controller/',
  output: 'example/build/'
})

const listController = [
  'create',
  'getOne',
  'update'
]

Promise.all(listController.map(name => {
  return genos
      .run({
        author: 'Oleg Rusak',
        date: new Date().toISOString(),
        type_entity: 'notification_of_inspection',
        type_controller: name
      })
}))
