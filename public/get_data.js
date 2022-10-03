
let s_name = [];
const path = "/";
var num_tag = 1 ;
/*
async function get_project_name(){
  const ref = firebase.database().ref(path)
  const snapshot = await ref.get()
  if (snapshot.exists()) {
    s_name = Object.keys(snapshot.val())
  }
  return 0
}

async function call_project_name(){
  await get_project_name();
  console.log(s_name);
}


window.onload = () => {
call_project_name();
console.log(s_name);
}
*/

/*DBを参照してボタンを製作*/
async function getChildKeys(path) {
  let keys = []
  const ref = firebase.database().ref(path)

  const snapshot = await ref.get()
  if (snapshot.exists()) {
    keys = Object.keys(snapshot.val())
  }
  console.log(keys)
  /*
  for (var i = 0; i < keys.length; i++) { 
    var pro = document.createElement('li'); 
    pro.textContent = keys[i];
    document.getElementById('list').appendChild(pro); 
  }*/

  const workListElem = document.getElementById('make_pro');

  keys.forEach((key) => {
    workListElem.insertAdjacentHTML(
      'beforeend',
      `<a href="#" id="${key}" onclick="location.href='http://localhost:50000/project.html?projectName=${key}'">${key}<br></a>
      <p><br></p>`
    )
  })

  console.log(keys.length)

  return keys.length
}

window.onload = () => {
  let key_l = getChildKeys(path);
}

/*プロジェクトの作成*/
document.getElementById("make_project_button").onclick = async function() {
  const ref = firebase.database().ref(path);
  const snapshot = await ref.get()
  if (snapshot.exists()) {
    keys = Object.keys(snapshot.val())
  }

  const textbox = document.getElementById("Pname");
  const Project_name = textbox.value;

  if (keys.includes(Project_name)){
    alert('this project name is existing!')
  }else{
    //let data = { [Project_name]:{tag:[Project_name]} }
    let tag_list = []
    tag_list.push(Project_name)
    for (var i = 0; i < num_tag ; i++) { 
      tag_input = 'inputform_' + i
      let tag_id = document.getElementById(tag_input);
      let tag_name = tag_id.value;
      tag_list.push(tag_name)
    }
    //let tag_arr = {}
    //tag_arr.tag = tag_list;
    const data = { [Project_name]:{tag:tag_list} }
    ref.update(data);
    window.location.reload();
  }
}


function addForm() {
  var input_data = document.createElement('input');
  input_data.type = 'text';
  input_data.id = 'inputform_' + num_tag;
  input_data.placeholder = '#';
  var parent = document.getElementById('form_area');
  parent.appendChild(input_data);
  num_tag++ ;
}