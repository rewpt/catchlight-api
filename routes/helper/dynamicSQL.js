/**
 * Function accepts the req.body for PUT request, turns each key into example string format: ["key = $1", "key = $2"] which is SQL syntax
 * @param {object} reqBody
 * @returns Array with string values
 */

const createSetString = (reqBody) => {
  const setValues = [];

  for (const key in reqBody) {

    setValues.push(`${key} = $${setValues.length + 1}`)
  }
  return setValues
}

/**
 * Function accepts array (["key = $1", "key = $2"]) created by createSetString(reqBody) and adds additional columns to update
 * @param {string} additionalColumn 
 * @param {array} arrayToAddTo 
 * @returns 
 */

const addAdditionalSetOptions = (additionalColumn ,arrayToAddTo) => {
  const copyOfArray = arrayToAddTo

  copyOfArray.push(`${additionalColumn} = $${copyOfArray.length + 1}`)

  return copyOfArray
}

module.exports = {
  createSetString,
  addAdditionalSetOptions
}
