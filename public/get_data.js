
let s_name = [];
const path = "/";
var num_tag = 1;
const make_max_tag = 8
const max_tag = 3

/*DBを参照してボタンを製作*/
async function getChildKeys(path) {
  let keys = []
  const ref = firebase.database().ref(path)

  const snapshot = await ref.get()
  if (snapshot.exists()) {
    keys = Object.keys(snapshot.val())
  }
  console.log(keys)

  const workListElem = document.getElementById('make_pro');

  keys.forEach((key) => {
    const projectRef = firebase.database().ref(`${path}/${key}/tag`)
    projectRef.get().then((snapshot) => {
      tag_l = snapshot.val()

      let htmlText =
        `<a href="#" id="${key}" onclick="location.href='http://${location.host}/project.html?projectName=${key}'" data-tag="${snapshot.val()}">
          <font size="6" color="red">${key}</font>
          <br><br>
          <div class="badge-container">
        `

      if (Array.isArray(tag_l) && tag_l.length > 0) {
        for (let i = 0; i < tag_l.length; i++) {
          // 現状表示するタグは最大3つにしている
          if (i >= 3) {
            break;
          }
          htmlText +=
            `<span class="badge-item">
              <font size="2">${tag_l[i]}</font>
            </span>`
        }
      }

      // 閉じタグを追加する
      htmlText += `</div></a><p><br></p>`
      workListElem.insertAdjacentHTML(
        'beforeend',
        htmlText
      )
    })
  })

  console.log(keys.length)

  return keys.length
}

window.onload = () => {
  let key_l = getChildKeys(path);
}

/*プロジェクトの作成*/
document.getElementById("make_project_button").onclick = async function () {
  const ref = firebase.database().ref(path);
  const snapshot = await ref.get()
  let keys = []
  if (snapshot.exists()) {
    keys = Object.keys(snapshot.val())
  }

  const textbox = document.getElementById("Pname");
  const Project_name = textbox.value;

  if (Array.isArray(keys) && keys.includes(Project_name)) {
    alert('this project name is existing!')
  } else {
    //let data = { [Project_name]:{tag:[Project_name]} }
    let tag_list = []
    tag_list.push(Project_name)
    for (var i = 0; i < num_tag; i++) {
      tag_input = 'inputform_' + i
      let tag_id = document.getElementById(tag_input);
      let tag_name = tag_id.value;
      tag_list.push(tag_name)
    }
    let Sum = document.getElementById('Summary').value;
    let Par = document.getElementById('Participant').value;
    let ClCu = document.getElementById('Client_Customer').value;
    //let tag_arr = {}
    //tag_arr.tag = tag_list;
    const data = { [Project_name]: { tag: tag_list, Summary_inp: Sum, Participant_inp: Par, ClCu_inp: ClCu } }
    ref.update(data);
    window.location.reload();
  }
}


function addForm() {
  if (num_tag < make_max_tag) {
    var input_data = document.createElement('input');
    input_data.type = 'text';
    input_data.id = 'inputform_' + num_tag;
    input_data.placeholder = '#';
    input_data.classList.add('text');
    var parent = document.getElementById('form_area');
    parent.appendChild(input_data);
    num_tag++;
  } else {
    alert('this project name is existing!')
  }
}

document.getElementById('search-button').addEventListener('click', () => {
  const tag = document.getElementById('search-tag').value
  const projectList = document.getElementById('make_pro')
  projectList.querySelectorAll(`a:not([data-tag*=${tag}])`).forEach((elem) => {
    elem.style.display = 'none'
  })
  projectList.querySelectorAll(`a[data-tag*= ${tag}]`).forEach((elem) => {
    elem.style.display = ''
  })
})