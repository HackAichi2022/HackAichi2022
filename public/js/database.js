async function getChildKeys(path) {
  let keys = []
  const ref = firebase.database().ref(path)

  const snapshot = await ref.get()
  if (snapshot.exists()) {
    keys = Object.keys(snapshot.val())
  }

  return keys
}

async function updateData(path, data) {
  const keys = Object.keys(data)
  // 今のところkeysが複数になることは想定していない（forEachは1回しか実行されない想定）
  const exists = await existsData(path, keys[0])
  if (!exists) {
    const ref = firebase.database().ref(path)

    return ref.update(data)

  } else {
    alert('すでに存在しています')

    return undefined
  }
}

async function existsData(path, key) {
  console.log(path)
  const ref = firebase.database().ref(path)

  const result = await ref.get()
  if (result.child(key).exists()) {
    return true
  } else {
    return false
  }
}