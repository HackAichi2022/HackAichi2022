let dataVtask= []  //送信するデータを格納
let Vtask_ID = 0;

window.addEventListener('load', function(){
    getDatabaseVC();
 });

function v_addWorkBtnFunc(){
    document.getElementById('input-work-field').style.zIndex  = 1000;
    var videoTimeEle = document.getElementById("video1");
    var videoTime = videoTimeEle.currentTime;
    let v_time = document.getElementById('v-time');
    v_time.value = videoTime.toPrecision(3);
}

function v_registerBtnFunc(){
    // const field = document.getElementById('input-work-field');
    // field.scroll(0, field.scrollHeight - field.clientHeight);
    field.style.zIndex  = -1000;

    let v_name = document.getElementById('v-name');
    let v_time = document.getElementById('v-time');
    let v_content = document.getElementById('v-content');
    var videoTimeEle = document.getElementById("video1");
    var videoTime = videoTimeEle.currentTime;

    //入力文字がなかったら反映しない
    if (!v_name.value) return false;    //作業名
    if (!v_time.value) {                //動画時間
        v_time.value = videoTime.toPrecision(3)
    }
    // else{
    // /* 例外処理　入力形式が間違っていた場合の処理*/
    // }

    console.log(v_time.value)
    if (!v_content.value) {
        dataVtask[Vtask_ID] = {id:Vtask_ID, titol:v_name.value, time:v_time.value, content:null, state:"add"}
    }else{
        dataVtask[Vtask_ID] = {id:Vtask_ID, titol:v_name.value, time:v_time.value, content: v_content.value, state:"add"}
    }

    roadVC(dataVtask[Vtask_ID]);
    let v_deletet = document.getElementById("v-work-delete");
    v_addSelect(Vtask_ID,v_deletet);    //削除の選択肢を追加
    Vtask_ID+=1;
    setDatabaseVC(); //保存
}

function v_cancelBtnFunc(){
    document.getElementById('input-work-field').style.zIndex  = -1000;
}

function v_clsBtnFunc(){
    let v_name = document.getElementById('v-name');
    let v_content = document.getElementById('v-content');

    //入力ボックスの入力文字削除 
    setTimeout( ()=> {
        v_name.value = '';
        v_content.value = '';
    }, 1);
}

//テキスト部分をクリックすると，テキスト送信時の動画時間に変更される
$(function(){
$('#v-work-ul').on('click', 'li', function () {
    var text = $(this)
    var v = document.getElementById("video1");
    console.log(text[0].id)
    v.currentTime = text[0].id;
});
});


function v_deleteBtnFunc(){
    let v_deletet = document.getElementById("v-work-delete");
    let v_work_deletet  = v_deletet.value;                  //削除する作業ID取得
    let li = document.querySelectorAll("#v-work-ul li");    //全てのテキストについての要素取得

    //削除確認
    if (window.confirm('作業内容を削除しますか？')) {
        $('#v-work-delete').children('option[value='+ v_work_deletet +']').remove(); //削除部分の選択肢

        //テキストを削除
        Array.from(li).forEach( elm =>{
            if(elm.value == v_work_deletet) elm.remove();
        });

        dataVtask[v_work_deletet].state ="delete"   //データ格納先の状態を変更
        setDatabaseVC();                            //保存
    }
}






function setDatabaseVC() {
    const projectname = getQueryParam('projectName');
    const workname = getQueryParam('workName');
    const videoid = getQueryParam('videoID');
    firebase.database().ref(projectname+"/workList/"+workname+"/"+videoid+"/videoData").set({
        vc: dataVtask
    });
}

/*呼出部分の処理*/
function getDatabaseVC() {
    const projectname = getQueryParam('projectName');
    const workname = getQueryParam('workName');
    const videoid = getQueryParam('videoID');
    firebase.database().ref(projectname+"/workList/"+workname+"/"+videoid+"/videoData").get().then((snapshot) => {
        if (snapshot.exists()) {
            let data = snapshot.val()
            if(data.vc != null){
                let v_deletet = document.getElementById("v-work-delete");
                dataVtask = data.vc
                Vtask_ID = dataVtask.length

                for(var i = 0; i < dataVtask.length; i++){
                    if(dataVtask[i].state != "delete"){
                        roadVC(dataVtask[i]);
                        v_addSelect(i,v_deletet);
                    }
                }
            }
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

function roadVC(roadVC){
    const field = document.getElementById('input-work-field');
    field.scroll(0, field.scrollHeight - field.clientHeight);
    const li = document.createElement('li');    //<li>の作成
    li.style="display:list-item block;"
    li.id =  roadVC.time;
    li.value = roadVC.id;
    let ul = document.getElementById('v-work-ul');  
    ul.appendChild(li);
    const div = document.createElement('div');
    div.innerHTML = "<strong>[ 作業" + roadVC.id + " ]" + roadVC.titol + "</strong> _動画時間: " + roadVC.time ;
    if (roadVC.content != null) div.innerHTML = div.innerHTML + "_内容: " + roadVC.content;
    li.appendChild(div);   
}

//削除の選択肢の追加処理
function v_addSelect(id,ele){
    const option = document.createElement('option');
    option.id = "V" + id;
    option.value = id;
    option.textContent = "作業" + id;
    ele.appendChild(option);
}