// @flow
/**
 * Created by Oleg Rusak on 09.06.2017.
 */

const fse = require('fs-extra')
const path = require('path')

const glob = require('./glob-promise')

function genos (options) {
  const { handlebars, output, dirTemplate } = options
  const api = Object.freeze({
    run
  })

  async function run (data) {
    const templateStat = await fse.stat(dirTemplate)

    if (templateStat.isDirectory()) {

      return glob(`${dirTemplate}/*/*.gt`) /* ? */
        .then(listFile => {

          return Promise.all(listFile.map(pathFileTemplate => compileTemplate(pathFileTemplate, data)))
        })
    }

    return compileTemplate(dirTemplate)
  }

  async function compileTemplate (pathFileTemplate, data) {
    const codeTemplate = await fse.readFile(pathFileTemplate)

    const handlerTemplate = handlebars.compile(codeTemplate.toString())
    const fileCtx = handlerTemplate(data)

    const pathTemplateRelative = path.relative(dirTemplate, pathFileTemplate)
    const pathTemplateRelativeNormalize = pathTemplateRelative.replace(/\\/g, '\\\\')
    const pathTemplateRelativeInit = handlebars.compile(pathTemplateRelativeNormalize)(data)

    const pathOutput = path.join(output, pathTemplateRelativeInit)

    const pathOutputObject = path.parse(pathOutput)

    pathOutputObject.base = pathOutputObject.name

    return fse.outputFile(path.format(pathOutputObject), fileCtx) /* ? pathOutput */
  }

  return api
}

module.exports = genos
