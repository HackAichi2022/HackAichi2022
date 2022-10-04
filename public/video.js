// window.addEventListener('load', function(){
//     getVideo();
// });


//firebaseのstrageから動画を取得する
function getVideo() {
    const storage = firebase.storage();
    const ref = storage.ref('./sample1.mp4'); //読み込む動画名を設定

    ref.getDownloadURL().then((url) => {
        var element = document.getElementById('video1');
        element.src = url;   //読み込む動画のURL取得
    });
}

function scroll(video) {
    console.log('video.js')
    const video1 = document.getElementById(video);
    video1.addEventListener('timeupdate', function () {

        // QAのスクロール部分
        const field = document.getElementById('field');
        console.log(video1.currentTime);
        if (video1.currentTime < 0.3) field.scrollTo(0, 0);
        let count = 0
        let li = document.querySelectorAll("#chat-ul li");
        Array.from(li).forEach(elm => {
            if (elm.className == "left" && elm.state != "delete") {
                if (count == 0) {
                    var rect = elm.getBoundingClientRect();
                    count = rect.top;
                }
                //elm.value/10000の「10000」は， qa.js の41行目（li.value = videoTime.toFixed(4) * 10000）の「10000」と統一する必要あり
                if (Math.abs(elm.value / 10000 - video1.currentTime) < 0.15) {
                    var rect = elm.getBoundingClientRect();
                    console.log(rect.top)
                    field.scrollTo(0, rect.top - count);
                }
            }
        });


        const v_field = document.getElementById('v-work-field');
        if (video1.currentTime < 0.3) v_field.scrollTo(0, 0);
        let v_count = 0
        let v_li = document.querySelectorAll("#v-work-ul li");
        Array.from(v_li).forEach(elm => {
            if (elm.state != "delete") {
                if (v_count == 0) {
                    var rect = elm.getBoundingClientRect();
                    v_count = rect.top;
                }
                if (Math.abs(elm.id - video1.currentTime) < 0.15) {
                    var rect = elm.getBoundingClientRect();
                    console.log(rect.top)
                    v_field.scrollTo(0, rect.top - v_count);
                }
            }
        });
    });
}
