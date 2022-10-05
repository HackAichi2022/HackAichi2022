window.addEventListener('load', function(){
    getVideo();
});


//firebaseのstrageから動画を取得する
function getVideo(){
    const videopath = getQueryParam('videoPath');
    const storage = firebase.storage();
    const ref = storage.ref(videopath); //読み込む動画名を設定

    ref.getDownloadURL().then((url) => {          
    var element = document.getElementById('video1');
    element.src = url;   //読み込む動画のURL取得
    });
}



var video=document.getElementById('video1');
video.addEventListener('timeupdate', function() {
    //console.log(video.currentTime)

    // QAのスクロール部分
    const field = document.getElementById('field');
    if(video.currentTime < 0.3)  field.scrollTo(0, 0);
    let count = null
    let li = document.querySelectorAll("#chat-ul li");
    Array.from(li).forEach( elm =>{
        if(elm.className == "left" && elm.state != "delete"){
            Array.from(li).forEach( elm2 =>{
                var rect = elm2.getBoundingClientRect();   
                if(count == null){
                    count = rect.top;
                }else if(count > rect.top){
                    count = rect.top;
                }
            });

            //elm.value/10000の「10000」は， qa.js の41行目（li.value = videoTime.toFixed(4) * 10000）の「10000」と統一する必要あり
            if(Math.abs(elm.value/10000 - video.currentTime) < 0.2){
                var rect = elm.getBoundingClientRect();
                field.scrollTo(0, rect.top - count);
            }
        }
    });


    //作業一覧のスクロール部分
    const v_field = document.getElementById('v-work-field');
    if(video.currentTime < 0.3)  v_field.scrollTo(0, 0);
    let v_count = 0
    let v_li = document.querySelectorAll("#v-work-ul li");
    Array.from(v_li).forEach( elm =>{
        if(elm.state != "delete"){
            if(v_count == 0){
                var rect = elm.getBoundingClientRect();
                v_count = rect.top;
            }
            if(Math.abs(elm.id - video.currentTime) < 0.15){
                var rect = elm.getBoundingClientRect();
                //console.log(rect.top)
                v_field.scrollTo(0, rect.top - v_count);
            }
        }
    });
});



