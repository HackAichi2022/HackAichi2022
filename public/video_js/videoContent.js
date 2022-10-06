let dataVtask= []   //送信するデータを格納
let Vtask_ID = 0;   //作業数

 /*データベースに対する処理 ---------------------------------------------------------------------------------------*/
//データベースからデータ読み込み
window.addEventListener('load', function(){
    getDatabaseVC();
 });

//データベース　保存部分の処理
function setDatabaseVC() {
    const projectname = getQueryParam('projectName');
    const workname = getQueryParam('workName');
    const videoid = getQueryParam('videoID');
    firebase.database().ref(projectname+"/workList/"+workname+"/"+videoid+"/videoData").set({
        vc: dataVtask
    });
}

//データベース　呼出部分の処理
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
            v_sort();
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

/*----------------------------------------------------------------------------------------------------------------*/

/*作業登録：ダイアログ(作業名,作業内容）等の処理---------------------------------------------------------------------*/
//ダイアログを開く
var updateButton = document.getElementById('add-video-work-button');
var favDialog = document.getElementById('favDialog');
updateButton.addEventListener('click', function onOpen() {
  if (typeof favDialog.showModal === "function") {
    favDialog.showModal();   //ダイアログを開く
  } else {
    alert("The <dialog> API is not supported by this browser");
  }
});


//ダイアログ（作業名,作業内容）の終了ボタンを押したときの処理
function v_finishBtnFunc(){
    favDialog.close();  //ダイアログを閉じる

    //入力ボックスの入力文字削除 
    let v_name = document.getElementById('v-name1');
    let v_content = document.getElementById('v-content1');    
    setTimeout( ()=> {
        v_name.value = '';
        v_content.value = '';
    }, 1);
}

//ダイアログ（作業名,作業内容）の登録ボタンを押したときの処理
function v_registerBtnFunc(){
    let v_name = document.getElementById('v-name1');
    let v_content = document.getElementById('v-content1');
    var videoTimeEle = document.getElementById("video1");
    var videoTime = videoTimeEle.currentTime;

    //入力文字がなかったら反映しない(作業名)
    if (!v_name.value) {
        alert('作業名を記入してください　登録不可能')
        return false;    
    }else{
        v_finishBtnFunc();
    }

    if (!v_content.value) {
        dataVtask[Vtask_ID] = {id:Vtask_ID, title:v_name.value, time:videoTime, content:null, state:"add"}
    }else{
        dataVtask[Vtask_ID] = {id:Vtask_ID, title:v_name.value, time:videoTime, content: v_content.value, state:"add"}
    }

    v_sort() //ソート
    roadVC(dataVtask[Vtask_ID]);
    let v_deletet = document.getElementById("v-work-delete");
    v_addSelect(Vtask_ID,v_deletet);    //削除の選択肢を追加
    Vtask_ID+=1;
    setDatabaseVC(); //保存
    
}


/*-----------------------------------------------------------------------------------------------------*/
/* <div class="video-work-container">
<div class="v-work-controls controls-wrapper">
  <h1 id="v-work-title">動画作業一覧</h1>
  <input type="button" value="動画作業登録" id="add-video-work-button" class="button">
  <!--削除選択，削除ボタン-->
  <select name="v-work-delete" id="v-work-delete">
  </select>
  <input type="button" value="delete" id="v-work-delete-button" class="button" onclick="v_deleteBtnFunc()">
</div>
<dialog id="favDialog">
  <form method="dialog">
    <p><label>作業名:
        <input type="text" id="v-name1">
      </label></p>

    <p><label>動画内容 </label></p>

    <p><label>
      <textarea id="v-content1"  cols="40" rows="6" placeholder="こちらに作業内容を入力してください"></textarea>
    </label>

    <menu>
      <input type="button" class="button" id="favDialogBtn1" value="登録" onclick="v_registerBtnFunc()">
      <input type="button" class="button" id="favDialogBtn2" value="終了" onclick="v_finishBtnFunc()">
    </menu>
  </form>
</dialog>

<div id="v-work-field">
  <ul id="v-work-ul" style="display: flex;flex-direction: column"></ul>
</div>
</div> */

//表示部分の順番を動画時間順に
function v_sort(){
    let li = document.querySelectorAll("#v-work-ul li");    //li.id=videotime li.value=id

    //質問の数および内容を取得
    var order =[]
    for(var i = 0; i < li.length; i++) order.push({id:li[i].id,value:li[i].value});

    // チーム昇順にしてからスコア降順にしたい
    order.sort(function(a, b){
        if(a.id !== b.id){
            if(a.id > b.id) return 1
            if(a.id < b.id) return -1
        }
        if(a.value !== b.value){
            return (b.value - a.value) * -1
        }
        return 0
    });

    //動画時間順にソート       
    Array.from(li).forEach( elm =>{
        for(var i = 0; i < order.length; i++){
            if(order[i].value == elm.value){
                var time = parseFloat(order[i].id)
                time = time.toFixed(4)
                console.log(time)
                elm.style.order= time * 10000;
                break;
            }
        }
    });    
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



function roadVC(roadVC){
    const li = document.createElement('li');    //<li>の作成
    li.style="display:list-item block;"
    li.id =  roadVC.time;
    li.value = roadVC.id;
    let ul = document.getElementById('v-work-ul');  
    ul.appendChild(li);
    const div = document.createElement('div');
    var v_time = roadVC.time

    /*作業番号*/
    let workID =  roadVC.id;
    workID = workID.toString()
    if(workID.length == 1) workID = ("00" + workID).slice(-2);

    div.innerHTML = "<strong>[ID" + workID + "]" + roadVC.title + "</strong>&nbsp;&nbsp;&nbsp;動画時間: " + v_time;
    if (roadVC.content != null) div.innerHTML = div.innerHTML + "&nbsp;&nbsp;&nbsp;内容: " + roadVC.content;
    li.appendChild(div);   
}

//削除の選択肢の追加処理
function v_addSelect(id,ele){
    const option = document.createElement('option');
    option.id = "V" + id;
    option.value = id;
    id = id.toString()
    if(id.length == 1) id = ("00" + id).slice(-2);
    option.textContent = "ID" + id;
    ele.appendChild(option);
}