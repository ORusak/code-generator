// @flow
/**
 * Created by Oleg Rusak on 09.06.2017.
 */

console.log(__dirname, process.cwd())

const fse = require('fs-extra')
const path = require('path')
const program = require('commander')
const pkg = require('../package.json')
const Handlerbars = require('handlebars')

const cwd = process.cwd()

program
  .version(pkg.version)
  .usage('[options] <params...>')
  .option('-t, --template [p]', 'Path to template', 'example/templates/controller-index/index.js')
  .option('-o, --output <p>', 'Path to output result')
  .parse(process.argv)

console.log(' args: %j', program.args)
console.log(' args: %j', program.template)
console.log(' args: %j', program.output)

runUtils()

async function runUtils () {
  await validateOptions(program)

  const templateConfig = await getTemplateConfigDir(program)
  const template = path.join(templateConfig, 'template/')

  const output = getOutputDir({
    templateConfig,
    output: program.output
  })
  const handlebars = await getInitHandlebars(templateConfig)
  const data = await getData(templateConfig, program.args)

  const genos = require('./genos')

  console.log(
    output,
    template,
    data
  )

  return genos({
    handlebars,
    output: output,
    dirTemplate: template
  }).run(data)
}

async function validateOptions (program) {
  const { template } = program

  if (!template) {
    console.error('Error execute. Expect option template(t)')

    process.exit(1)
  }

  if (!await fse.pathExists(template)) {
    console.error('Error execute. Expect template(t) path exist')

    process.exit(1)
  }
}

async function getTemplateConfigDir (program) {
  const { template } = program

  const templateStat = await fse.stat(template)

  if (templateStat.isDirectory()) {
    return template
  }

  return path.dirname(template)
}

function getOutputDir (params) {
  const { output } = params

  if (output) {
    return output
  }

  const { template } = params

  //  return name dir template
  return template.split(/[\\/]/).pop()
}

async function getInitHandlebars (template) {
  const helpersPath = path.join(cwd, template, 'helpers.js')
  const pathExist = await fse.pathExists(helpersPath)

  if (pathExist) {
    const helpers = require(helpersPath)

    Object.keys(helpers).forEach((key) => {
      const helper = helpers[key]

      Handlerbars.registerHelper(helper.name, helper)
    })
  }

  return Handlerbars
}

async function getData (template, listParam) {
  const dataPath = path.join(cwd, template, 'data.js')
  const pathExist = await fse.pathExists(dataPath)

  if (pathExist) {
    const data = require(dataPath)
    const dataParams = reduceListParam(listParam)

    return Object.assign(data, dataParams)
  }

  return null
}

function reduceListParam (listParam) {
  if (!Array.isArray(listParam)) {

    return {}
  }

  return listParam.reduce((data, param) => {
    const pair = param.match(/^([a-zA-Z]+[a-zA-Z0-9_]*)=(.+)$/)
    if (pair && pair.length === 3) {
      data[pair[1]] = pair[2]
    }

    return data
  }, {})
}
