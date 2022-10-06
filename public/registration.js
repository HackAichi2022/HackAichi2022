let projectname = getQueryParam('projectName')
let workname = getQueryParam('workName')

function OnButtonClick() {
    // alert("test");
    let fileInput = document.getElementById('send');
    let fileReader = new FileReader();

    for (let i = 0; i < fileInput.files.length; i++) {

        let file = fileInput.files[i];
        console.log(fileInput.files.length);
        console.log(file.name);
        console.log(file.size);
        console.log(file.type);
        var ref_path = projectname + "/" + workname + "/" + file.name
        var ref = firebase.storage().ref().child(ref_path);
        ref.put(file).then((snapshot) => {
            // ref.put(file.,metadata).then((snapshot) => {
            console.log('Uploaded a blob or file!');
            // alert("次のファイルをアップロードしました\n" + file.name);
            location.reload();
        }).catch((error) => {
            console.error(error)
        });

    }
}

document.getElementById('send').addEventListener('change', (event) => {
    const files = event.target.files;
    const fileName = document.getElementById('file-select-state');
    if (files.length === 0) {
        fileName.textContent = '選択されていません';
    } else if (files.length === 1) {
        fileName.textContent = files[0].name;
    } else {
        fileName.textContent = `${files.length}ファイル`;
    }
})
