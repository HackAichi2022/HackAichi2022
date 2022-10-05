const path = getQueryParam('pdfPath');
const filename = getQueryParam('pdfID') + '.pdf';
console.log(path)
console.log(filename)
const storage = firebase.storage();
const ref = storage.ref(path);

var state = {
    pdf: null,
    // 表示ページ
    currentPage: 1,
    // 倍率 1.0は1倍
    zoom: 1.0
}

// ボタンの有効・無効の状態
const button_pre = document.getElementById("go_previous");
const button_next = document.getElementById("go_next");
button_pre.disabled = true

// PDFをレンダリングするファンクション
function render() {
    if (state.pdf == null || 1 == state.pdf._pdfInfo.numPages) {
        button_pre.disabled = true
        button_next.disabled = true
    }
    else{
    if (state.pdf == null || state.currentPage == 1) {
        button_pre.disabled = true
        button_next.disabled = false
    }
    if (state.pdf == null || state.currentPage == state.pdf._pdfInfo.numPages) {
        button_next.disabled = true
        button_pre.disabled = false
    }
    }
    
    state.pdf.getPage(state.currentPage).then(function (page) {
        var canvas = document.getElementById("pdf_renderer");
        var ctx = canvas.getContext('2d');
        // 倍率を指定
        var viewport = page.getViewport({ scale: state.zoom });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        // レンダリング
        page.render({
            canvasContext: ctx,
            viewport: viewport
        });
    });
}

ref.getDownloadURL()
    .then((url) => {
        // PDF.js にアクセスするためのショートカット
        var pdfjsLib = window['pdfjs-dist/build/pdf'];
        // PDF.jsを使用するために「workerSrc」プロパティを指定する必要があるため指定
        pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
        
        
        // PDFの読み込み
        pdfjsLib.getDocument(url).promise.then((pdf) => {
            state.pdf = pdf;
            createSelectPage(state.pdf._pdfInfo.numPages);
            render();
        });
        
        // 前のPDFのページを表示
        document.getElementById("go_previous")
            .addEventListener('click', (e) => {
                console.log(state.currentPage);
                state.currentPage -= 1;
                render();
                button_next.disabled = false
            });
        // 次のPDFページを表示
        document.getElementById('go_next')
            .addEventListener('click', (e) => {
                console.log(state.currentPage);
                state.currentPage += 1;
                render();
                button_pre.disabled = false
            });
        // PDFのズームイン（拡大）
        document.getElementById('zoom_in').addEventListener('click', (e) => {
            if (state.pdf == null) return;
            // + 0.5倍
            state.zoom += 0.5;
            render();
        });
        // PDFのズームアウト（拡小）
        document.getElementById('zoom_out').addEventListener('click', (e) => {
            if (state.pdf == null) return;
            // - 0.5倍
            state.zoom -= 0.5;
            render();
        });
        // PDFのダウンロード
        // document.getElementById('download').addEventListener('click', (e) => {
        //     console.log('a');
        //     var tag = document.createElement('a');
        //     tag.setAttribute('href', url);
        //     tag.setAttribute('download', filename);
        //     tag.appendChild(document.createTextNode(name));
        //     // obj.appendChild(tag);
        //     document.body.appendChild(tag);
        // });
        let link = document.getElementById('download');
        console.log(url)
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
       
    });
document.body.appendChild(document.createElement("br"));