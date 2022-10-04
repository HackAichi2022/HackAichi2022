var projectname = "pj1"
    var workname = "work1"

    function OnButtonClick(){
        // alert("test");
        let fileInput = document.getElementById('send');
        let fileReader = new FileReader();
        
        for(let i=0; i<fileInput.files.length; i++){
            
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
                alert("次のファイルをアップロードしました\n" + file.name);
            }).catch((error) =>{
                console.error(error)
            });

        }
    }