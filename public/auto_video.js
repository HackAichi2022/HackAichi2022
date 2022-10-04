function judgementVideo(fileName) {
    // fileName = fileName.substring(fileName.lastIndexOf('.'))
    if (fileName.toUpperCase().match(/\.(mp4)$/i)) { return true }
    if (fileName.toUpperCase().match(/\.(avi)$/i)) { return true }
    if (fileName.toUpperCase().match(/\.(fiv)$/i)) { return true }
    if (fileName.toUpperCase().match(/\.(mov)$/i)) { return true }
    if (fileName.toUpperCase().match(/\.(wmv)$/i)) { return true }
    return false
}

function createVideo(path, i) {
    const storage = firebase.storage();
    const ref = storage.ref(path);

    ref.getDownloadURL().then((url) => {
        var video = document.createElement("video");
        video.src = url; // 動的に生成した動画のURL
        video.setAttribute("id", "video" + i);
        video.setAttribute("class", "video" + i);
        video.setAttribute("controls", "");
        console.log(video.id)
        document.body.appendChild(video);
        document.body.appendChild(document.createElement("br"));
        scroll(video.id);
    });
}

var projectname = "pj1"
var workname = "work1"

window.addEventListener('load', function(){  

    const storage = firebase.storage();
    var ref_path = projectname + "/" + workname
    console.log(ref_path)
    const storageRef = storage.ref();
    var listRef = storageRef.child(ref_path);
    var i = 1;

    listRef.listAll().then((res) => {
        res.prefixes.forEach((folderRef) => {
        });
        res.items.forEach((itemRef) => {
            console.log(itemRef)
            console.log(itemRef.fullPath)
            if (judgementVideo(itemRef.fullPath) == true) {
                console.log('true')
                createVideo(itemRef.fullPath, i);
                i += 1;
            }
            else { console.log('false') }
        });
    }).catch((error) => {
        console.error(error);
    });
});
