document.addEventListener('DOMContentLoaded', async () => {
  // プロジェクト名はクエリパラメータ経由で受け取る
  const projectName = getQueryParam('projectName')
  if (projectName) {
    // ヘッダー部分はプロジェクト名に合わせる
    const projectNameElem = document.getElementById('project-name')
    projectNameElem.textContent = projectName

    // 作業一覧はリストとして表示
    const workListElem = document.getElementById('work-list')
    let workListContent = ''
    getChildData(`${projectName}/workList`).then((workList) => {
      if (workList.length === 0) {
        workListContent +=
          `<li class="mdc-list-item">
            <button class=mdc-button>
              <span class="mdc-button__ripple"></span>
              <span class="mdc-button__text">登録されている作業はありません</span>
            </button>
          </li>`
      } else {
        // keyとvalueを取得してforで回す
        for (const [workName, workInfo] of Object.entries(workList)) {
          workListContent +=
            `<li class="mdc-list-item" data-tag="${workInfo.tag}">
              <button id="${workName}" class=mdc-button onclick="location.href='http://localhost:50000/work.html?projectName=${projectName}&workName=${workName}'">
                <span class="mdc-button__ripple"></span>
                <span class="mdc-button__text">${workName}, ${workInfo.tag}</span>
              </button>
            </li>`

        }
      }
      workListElem.insertAdjacentHTML(
        'beforeend',
        workListContent
      )
    })

    // タグ一覧を表示
    const tagListElem = document.getElementById('tag-list')
    let tagListContent = ''
    getChildData(`${projectName}/tag`).then((data) => {
      data.forEach((tag) => {
        tagListContent += `${tag},`
      })
      tagListElem.textContent = tagListContent
    })
  }

})

document.getElementById('add-work-button').addEventListener('click', () => {
  const workName = document.getElementById('work-name').value
  const data = {
    [workName]: {
      material: '',
      movie: '',
    },
  }

  const projectName = getQueryParam('projectName')
  if (projectName) {
    updateData(`${projectName}/workList`, data)
  }
})

document.getElementById('search-work-button').addEventListener('click', () => {
  const tag = document.getElementById('search-tag').value
  queryElements(document.getElementById('work-list'), `li:not([data-tag*=${tag}])`).forEach((elem) => {
    elem.style.display = 'none'
  })
  queryElements(document.getElementById('work-list'), `li[data-tag*=${tag}]`).forEach((elem) => {
    elem.style.display = ''
  })
})