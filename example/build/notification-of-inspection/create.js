/**
 * Created by Oleg Rusak on 2017-06-20T20:31:34.793Z.
 *
 * Controller create one: notification_of_inspection
 */

'use strict'

const ioc = require('electrolyte');
const _ = require('lodash');

const log = ioc.create('lib/log');
const srvDocuments = require('_/services/documents');
const createDocument = srvDocuments.caseAO.notificationOfInspection.crud.create;
const ControllerFormer = require('_/lib/controller')
const utils = require('./../utils')

const CODE_TYPE_DOCUMENT = 'notification_of_inspection'

const name = 'Document.notificationOfInspection.Create'

/**
 *
 * @param {object} ctx контекст
 * @param {object} params параметры запуска обработчика
 *
 * @return {object} сохраненный документ
 */
function main (ctx, params) {
  const { document } = params.parameters

  //  Создание документа
  return createDocument(ctx, document)
}

const controller = new ControllerFormer({
  log,
  name,
  //  переопределяемые методы
  main,
  postProcessing: utils.initPostProcessing(CODE_TYPE_DOCUMENT, name)
})

module.exports = controller
