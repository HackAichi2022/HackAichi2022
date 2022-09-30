async function getChildKeys(path) {
  let keys = []
  const ref = firebase.database().ref(path)

  const snapshot = await ref.get()
  if (snapshot.exists()) {
    keys = Object.keys(snapshot.val())
  }

  return keys
}

function updateData(path, data) {
  const ref = firebase.database().ref(path)

  return ref.update(data)
}