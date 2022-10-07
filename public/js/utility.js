function getQueryParam(paramName) {
  const searchParams = new URLSearchParams(location.search)

  if (searchParams.has(paramName)) {
    return searchParams.get(paramName)
  } else {
    console.error(`Parameter '${paramName}' does not exist.`)
    return null
  }
}

function exists(obj) {
  // nullにtypeofを使うと'object'が返されるので除外しておく
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).length !== 0
  } else {
    console.error(`'${obj.name}' is not object.`)
    return false
  }
}

function setHTMLElementValue(id, value) {
  const elem = document.getElementById(id)
  if (elem) {
    // テキストを入力する要素の場場はvalue、そそれ以はinnerAdjacentHTMLを使う
    switch (elem.nodeName) {
      case 'INPUT':
      case 'TEXTAREA':
        elem.value = value
        break
      default:
        elem.insertAdjacentHTML('beforeend', value)
        break
    }

    return true
  } else {
    console.error(`Element '${id}' does not exist.`)

    return false
  }
}

function getHTMLElementValue(id) {
  const elem = document.getElementById(id)
  let value = null
  if (elem) {
    // テキストを入力する要素の場合はvalue、それ以外はinnerTextで書かれているテキストを取得する
    switch (elem.nodeName) {
      case 'INPUT':
      case 'TEXTAREA':
        value = elem.value
        break
      default:
        value = elem.innerText
        break
    }
  } else {
    console.error(`Element '${id}' does not exist.`)
  }

  return value
}

function createHTMLElement(attr) {
  if (!attr.tagName) {
    console.error('tagName is required.')
    return null
  }

  const elem = document.createElement(attr.tagName)
  if (attr.id) {
    elem.id = attr.id
  }
  if (attr.className) {
    elem.className = attr.className
  }
  if (attr.innerText) {
    elem.innerText = attr.innerText
  }
  if (attr.href) {
    elem.href = attr.href
  }
  if (attr.size) {
    elem.size = attr.size
  }
  if (attr.html) {
    elem.insertAdjacentHTML('beforeend', attr.html)
  }
  if (attr.event) {
    elem.addEventListener(attr.event.type, attr.event.func)
  }
  if (attr.child) {
    attr.child.forEach((child) => {
      elem.appendChild(child)
    })
  }
  if (attr.style) {
    elem.style = attr.style
  }
  if (attr.dataset) {
    for (const [key, value] of Object.entries(attr.dataset)) {
      elem.dataset[key] = value
    }
  }

  return elem
}

function setChildElement(parentId, children) {
  const parent = document.getElementById(parentId)
  if (parent) {
    if (Array.isArray(children)) {
      children.forEach((child) => {
        parent.appendChild(child)
      })

    } else {
      parent.appendChild(children)
    }
  } else {
    console.error(`Element '${parentId}' does not exist.`)
  }
}