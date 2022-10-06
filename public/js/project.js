document.addEventListener('DOMContentLoaded', async () => {
  // プロジェクト名はクエリパラメータ経由で受け取る
  const projectName = getQueryParam('projectName')
  if (projectName) {
    // ヘッダー部分はプロジェクト名に合わせる
    const projectTitleElem = document.getElementById('project-title')
    projectTitleElem.textContent = projectName

    getChildData(`${projectName}`).then((project) => {
      if (exists(project)) {
        document.getElementById('Pname').value = projectName
        document.getElementById('Summary').value = project.Summary_inp
        document.getElementById('Participant').value = project.Participant_inp
        document.getElementById('Client_Customer').value = project.ClCu_inp

        // 作業一覧のリンクを作成
        const workList = project.workList
        const workListElem = document.getElementById('work-list')
        let workListContent = ''
        // 作業一覧はオブジェクトなので存在しているか判定
        if (exists(workList)) {
          for (const [workName, workInfo] of Object.entries(workList)) {
            workListContent +=
              `<a href="http://${location.host}/work.html?projectName=${projectName}&workName=${workName}" id="${workName}" data-tag="${workInfo.tag}">${workName}</a>`
          }
        } else {
          workListContent +=
            `<a href="#">登録されている作業はありません</a>`
        }
        workListElem.insertAdjacentHTML('beforeend', workListContent)

      } else {
        console.error('Project does not exists')
      }
    })

    // タグ一覧を表示
    // const tagListElem = document.getElementById('tag-list')
    // let tagListContent = ''
    getChildData(`${projectName}/tag`).then((data) => {
      if (typeof (data) === Array) {
        data.forEach((tag) => {
          tagListContent += `${tag},`
        })
        tagListElem.textContent = tagListContent
      }
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
  queryElements(document.getElementById('work-list'), `a:not([data-tag*=${tag}])`).forEach((elem) => {
    elem.style.display = 'none'
  })
  queryElements(document.getElementById('work-list'), `a[data-tag*=${tag}]`).forEach((elem) => {
    elem.style.display = ''
  })
})