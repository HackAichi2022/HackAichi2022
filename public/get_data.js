
let s_name = [];
const path = "/";
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
      `<button class="mdc-button" id="${key}" onclick="location.href='http://localhost:50000/project.html?projectName=${key}'">
        <span class="mdc-button__ripple"></span>
        <span class="mdc-button__label">${key}</span>
      </button>`
    )
  })

  console.log(keys.length)

  return keys.length
}

window.onload = () => {
  let key_l = getChildKeys(path);
}

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
    const data = { [Project_name]:{tag:[Project_name]} }
    ref.update(data);
  }
}
