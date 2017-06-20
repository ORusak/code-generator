/**
 * Created by Oleg Rusak on 14.06.2017.
 */

'use strict'

const glob = require('glob')

module.exports = function globPromise (path, options) {
  return new Promise(function (resolve, reject) {
    glob(path, options, function (error, files) {
      if (error) {
        reject(error)
      }

      resolve(files)
    })
  })
}
