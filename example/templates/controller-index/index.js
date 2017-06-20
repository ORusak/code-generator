// @flow
/**
 * Created by Oleg Rusak on 09.06.2017.
 *
 * Run
 */

const handlebars = require('handlebars')

const helpers = require('../helpers')
const genos = require('../../../lib/genos')

Object.keys(helpers).forEach((key) => {
  const helper = helpers[key]

  handlebars.registerHelper(helper.name, helper)
})

genos({
  handlebars,
  dirTemplate: 'example/templates/controller-index/',
  output: 'example/build/'
})
  .run({
    author: 'Oleg Rusak',
    date: new Date().toDateString(),
    'controllers': [
      'get-one',
      'create',
      'update'
    ]
  })
