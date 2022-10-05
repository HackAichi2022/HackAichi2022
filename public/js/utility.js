function getQueryParam(paramName) {
  const searchParams = new URLSearchParams(location.search)

  if (searchParams.has(paramName)) {
    return searchParams.get(paramName)
  } else {
    console.error('Parameter does not exist.')
    return null
  }
}

function queryElements(elem, query) {
  let elems = null
  if (elem) {
    elems = elem.querySelectorAll(query)
  }

  return elems
}

function isEmpty(obj) {
  // nullにtypeofを使うと'object'が返されるので除外しておく
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).length === 0
  } else {
    console.error('"obj" is not object.')
    return false
  }
}