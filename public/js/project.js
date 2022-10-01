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
    getChildKeys(`${projectName}/workList`).then((keys) => {
      if (keys.length === 0) {
        workListContent +=
          `<li class="mdc-list-item">
            <button class=mdc-button>
              <span class="mdc-button__ripple"></span>
              <span class="mdc-button__text">登録されている作業はありません</span>
            </button>
          </li>`
      } else {
        keys.forEach((key) => {
          workListContent +=
            `<li class="mdc-list-item">
              <button class=mdc-button onclick="location.href='http://localhost:50000/work.html?projectName=${projectName}&workName=${key}'">
                <span class="mdc-button__ripple"></span>
                <span class="mdc-button__text">${key}</span>
              </button>
            </li>`
        })
      }
      workListElem.insertAdjacentHTML(
        'beforeend',
        workListContent
      )
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