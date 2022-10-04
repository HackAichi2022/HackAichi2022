function deleteFileCheck(fileName) {
    var checkBox = document.createElement('input');
    checkBox.setAttribute('type', 'checkbox');
    checkBox.setAttribute('name', 'chk');
    checkBox.setAttribute('value', fileName);
    var label = document.createElement('label');
    label.appendChild(checkBox);
    var text_node = document.createTextNode(fileName);
    label.appendChild(text_node)

    document.getElementById('contentsList').appendChild(label);
    document.getElementById('contentsList').appendChild(document.createElement("br"));
}


window.addEventListener('load', function () {

    const storage = firebase.storage();
    var ref_path = projectname + "/" + workname
    console.log(ref_path)
    const storageRef = storage.ref();
    var listRef = storageRef.child(ref_path);

    listRef.listAll().then((res) => {
        res.prefixes.forEach((folderRef) => {
        });
        res.items.forEach((itemRef) => {
            console.log(itemRef)
            console.log(itemRef.name)
            deleteFileCheck(itemRef.name)
        });
    }).catch((error) => {
        console.error(error);
    });
});

function OnDeleteClick() {
    const storage = firebase.storage();
    var ref_path = projectname + "/" + workname
    const storageRef = storage.ref();

    const arr = [];
    let chklist = document.getElementById('contentsList').chk;

    console.log(chklist);
    if (chklist.length === undefined) {
        if (chklist.checked) {
            var deleteRef = storageRef.child(ref_path + '/' + chklist.value);
            console.log(deleteRef);
            deleteRef.delete().then(() => {
                console.log('Deleted a file!');
                alert("次のファイルを削除しました\n" + chklist.value);
            }).catch((error) => {
                console.error(error)
            });
        }
    }
    else {
        for (let i = 0; i < chklist.length; i++) {
            if (chklist[i].checked) {
                var deleteRef = storageRef.child(ref_path + '/' + chklist[i].value);
                console.log(deleteRef);
                deleteRef.delete().then(() => {
                    console.log('Deleted a file!');
                    alert("次のファイルを削除しました\n" + chklist[i].value);
                }).catch((error) => {
                    console.error(error)
                });
                // arr.push(chklist[i].value);
            }
        }
    }
    // console.log(arr);
}