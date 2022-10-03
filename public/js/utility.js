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