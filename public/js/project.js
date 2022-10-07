let projectName = '';

document.addEventListener('DOMContentLoaded', async () => {
  // プロジェクト名はクエリパラメータ経由で受け取る
  projectName = getQueryParam('projectName')
  if (projectName) {
    // ヘッダー部分はプロジェクト名に合わせる
    setHTMLElementValue('project-title', projectName)

    getChildData(`${projectName}`).then((project) => {
      if (exists(project)) {
        setHTMLElementValue('Pname', projectName)
        setHTMLElementValue('Summary', project.Summary_inp)
        setHTMLElementValue('Participant', project.Participant_inp)
        setHTMLElementValue('Client_Customer', project.ClCu_inp)

        // タグは配列で取得する
        const projectTags = project.tag
        if (Array.isArray(projectTags)) {
          projectTags.forEach((tag) => {
            setChildElement('project-tag-list', createHTMLElement({ tagName: 'span', className: 'badge-item', innerText: tag }))
          })
        }

        // 作業一覧のリンクを作成
        const workList = project.workList
        // 作業一覧はオブジェクトなので存在しているか判定
        if (exists(workList)) {
          for (const [workName, workInfo] of Object.entries(workList)) {

            const tagBadgeList = createHTMLElement({ tagName: 'div', className: 'badge-container' })
            const workTags = workInfo.tag
            if (Array.isArray(workTags)) {
              workTags.forEach((tag) => {
                tagBadgeList.appendChild(createHTMLElement({ tagName: 'span', className: 'badge-item', innerText: tag }))
              })
            }

            let question_num = 0
            for (const [key, value] of Object.entries(workInfo)) {
              if (exists(value) && !Array.isArray(value) && Object.hasOwn(value, 'qaData') && Object.hasOwn(value.qaData, 'flag')) {
                question_num += value.qaData.flag
              }
            }
            const questionNum = createHTMLElement({ tagName: 'font', innerText: question_num, size: 4, style: 'margin-top: 8px; margin-left: 8px;' })

            setChildElement('work-list', createHTMLElement({ tagName: 'a', id: workName, href: `work.html?projectName=${projectName}&workName=${workName}`, innerText: workName, dataset: new DOMStringMap({ tag: worktags }), child: [tagBadgeList, questionNum] }))
          }
        } else {
          setChildElement('work-list', createHTMLElement({
            tagName: 'a', innerText: '作業はありません'
          }))
        }
      }
    })
  } else {
    setHTMLElementValue('project-title', projectName)
    console.error('Project does not exists')
  }
})

document.getElementById('add-work-button').addEventListener('click', () => {
  const workName = getHTMLElementValue('work-name')

  // 空のデータは追加できないのでなにかしらのデータを入れておく必要がある
  const data = {
    [workName]: {
      tag: [projectName],
      flag_qa: 0
    },
  }

  if (projectName) {
    updateData(`${projectName}/workList`, data)
  }
})

document.getElementById('search-work-button').addEventListener('click', () => {
  const tag = getHTMLElementValue('search-tag')

  // 作業名を表示している<a>を表示・非表示にして検索機能を実現
  const workListElem = document.getElementById('work-list')
  workListElem.querySelectorAll(`a:not([data-tag*="${tag}"])`).forEach((elem) => {
    elem.style.display = 'none'
  })
  workListElem.querySelectorAll(`a[data-tag*="${tag}"]`).forEach((elem) => {
    elem.style.display = ''
  })
})