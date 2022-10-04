

function judgementPdf(fileName) {
    // fileName = fileName.substring(fileName.lastIndexOf('.'))
    if (fileName.toUpperCase().match(/\.(pdf)$/i)) { return true }
    return false
}

function createPdf(path, name) {
    console.log(name);
    var id = name.slice(0, -4);
    // var obj = document.getElementById("link");
    var tag = document.createElement('a');
    tag.setAttribute('href', 'http://localhost:50000/pdf.html?projectName=' + projectname + '&workName=' + workname + '&videoPath=' + path + '&ID=' + id);
    tag.appendChild(document.createTextNode(name));
    // obj.appendChild(tag);
    const fileLinkList = document.getElementById('file-link-list');
    fileLinkList.appendChild(tag);

    // // var div = document.createElement('div');
    // // div.setAttribute('id',"canvas_container"+path);
    // var canvas = document.createElement('canvas');
    // canvas.setAttribute('id', path);
    // var element1 = document.createElement("button");
    // element1.innerText = "前のページ";
    // element1.setAttribute('id', "go_previous" + path);
    // var element2 = document.createElement("button");
    // element2.innerText = "次のページ";
    // element2.setAttribute('id', "go_next" + path);
    // var element3 = document.createElement("button");
    // element3.innerText = "拡大";
    // element3.setAttribute('id', "zoom_in" + path);
    // var element4 = document.createElement("button");
    // element4.innerText = "縮小";
    // element4.setAttribute('id', "zoom_out" + path);



    // document.body.appendChild(canvas);
    // document.body.appendChild(element1);
    // document.body.appendChild(element2);
    // document.body.appendChild(element3);
    // document.body.appendChild(element4);
    // const storage = firebase.storage();
    // const ref = storage.ref(path);

    // // var starsRef = storageRef.child('images/stars.jpg');

    // // Get the download URL
    // ref.getDownloadURL()
    //     .then((url) => {
    //         // PDF.js にアクセスするためのショートカット
    //         var pdfjsLib = window['pdfjs-dist/build/pdf'];
    //         // PDF.jsを使用するために「workerSrc」プロパティを指定する必要があるため指定
    //         pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
    //         var state = {
    //             pdf: null,
    //             // 表示ページ
    //             currentPage: 1,
    //             // 倍率 1.0は1倍
    //             zoom: 1.0
    //         }
    //         // ボタンの有効・無効の状態
    //         const button_pre = document.getElementById("go_previous" + path);
    //         const button_next = document.getElementById("go_next" + path);
    //         button_pre.disabled = true
    //         // PDFの読み込み
    //         pdfjsLib.getDocument(url).promise.then((pdf) => {
    //             state.pdf = pdf;
    //             render();
    //         });
    //         // PDFをレンダリングするファンクション
    //         function render(path) {
    //             state.pdf.getPage(state.currentPage).then(function (page) {
    //                 // var canvas = document.getElementById(path);
    //                 var ctx = canvas.getContext('2d');
    //                 // 倍率を指定
    //                 var viewport = page.getViewport({ scale: state.zoom });
    //                 canvas.width = viewport.width;
    //                 canvas.height = viewport.height;
    //                 // レンダリング
    //                 page.render({
    //                     canvasContext: ctx,
    //                     viewport: viewport
    //                 });
    //             });
    //         }

    //         // 前のPDFのページを表示
    //         document.getElementById("go_previous" + path)
    //             .addEventListener('click', (e) => {
    //                 console.log(state.currentPage);
    //                 state.currentPage -= 1;
    //                 if (state.pdf == null || state.currentPage == 1) {
    //                     button_pre.disabled = true
    //                 }
    //                 button_next.disabled = false
    //                 render();
    //             });
    //         // 次のPDFページを表示
    //         document.getElementById('go_next' + path)
    //             .addEventListener('click', (e) => {
    //                 console.log(state.currentPage);
    //                 state.currentPage += 1;
    //                 if (state.pdf == null || state.currentPage == state.pdf._pdfInfo.numPages) {
    //                     button_next.disabled = true
    //                 }
    //                 button_pre.disabled = false
    //                 render();
    //             });
    //         // PDFのズームイン（拡大）
    //         document.getElementById('zoom_in' + path).addEventListener('click', (e) => {
    //             if (state.pdf == null) return;
    //             // + 0.5倍
    //             state.zoom += 0.5;
    //             render();
    //         });
    //         // PDFのズームアウト（拡小）
    //         document.getElementById('zoom_out' + path).addEventListener('click', (e) => {
    //             if (state.pdf == null) return;
    //             // - 0.5倍
    //             state.zoom -= 0.5;
    //             render();
    //         });

    //     });
    // document.body.appendChild(document.createElement("br"));

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
            console.log(itemRef.fullPath)
            if (judgementPdf(itemRef.fullPath) == true) {
                console.log('true')
                createPdf(itemRef.fullPath, itemRef.name);
            }
            else { console.log('false') }
        });
    }).catch((error) => {
        console.error(error);
    });
});
