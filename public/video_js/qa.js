let dataQA= []  //送信するQAデータを格納
let Q_num = 0;  //質問の数（番号）
let send_flag = 0

window.addEventListener('load', function(){
    getDatabaseQA();
 });


/* 画面への出力処理----------------------------------------------------------------------------------------*/
// 画面への出力(val:メッセージ内容，person:ユーザー）
function output(val, person, priority) {
    const field = document.getElementById('field');
    field.scroll(0, field.scrollHeight - field.clientHeight);

    var videoTimeEle = document.getElementById("video1");
    var videoTime = videoTimeEle.currentTime;
    var sendTime = nowTime();

    //テキストを表示
    if(person == "Q"){
        let li = viewQ(videoTime,sendTime,priority,val,"Q"+ Q_num);
        dataQA[Q_num]={Q:li.id, A:[],state:"add",videotime:videoTime,sendtime:sendTime,priority:priority,content:val,flag:1}
        dataQA[Q_num].A.push({ans:"回答内容",sendtime:"送信時間",priority:"状態"})
        Q_num+=1;
    } else{
        viewAns(person,sendTime,priority,val)
        dataQA[person.replace("Q","")].A.push({ans:val,sendtime:sendTime,priority:priority})
        dataQA[person.replace("Q","")].flag = 0;
    };
}

//質問の画面への出力部分
function viewQ(videoTime,sendTime,priority,val,id){
    const li = document.createElement('li');
    li.style="display:list-item block;"
    const div = document.createElement('div');
    let ul = document.getElementById('chat-ul');
    div.classList.add('chat-left');
    li.classList.add('left');
    li.id = id
    /*videoTimeについて動画時間が１分以上になったら60.0000のような値が帰ってくることを想定（動画時間を秒数で取得）*/
    li.value = videoTime.toFixed(4) * 10000
    li.style="display:list-item block;"
    ul.appendChild(li);
    div.innerHTML = "[" + id + "]    Send: "+ sendTime + "    "
                        + "動画:" + videoTime.toPrecision(3) + "秒 /" + priority + "<br>"
                        + "  " + val;
    li.appendChild(div);
    return li
    }

//回答の画面への出力部分
function viewAns(person,sendTime,priority,val){
    const li = document.createElement('li');
    li.style="display:list-item block;"
    const div = document.createElement('div');
    let ul = document.getElementById(person);
    div.classList.add('chat-right');
    li.classList.add('right');
    li.id = person
    ul.appendChild(li);
    div.innerHTML = "[" + person + " Ans]    Send:" + sendTime + " /" + priority + " <br>" + "  " + val;
    li.appendChild(div);
}

/* ---------------------------------------------------------------------------------------------------------*/

// 送信ボタンを押した時の処理
function sendBtnFunc() {
    let inputTag = document.getElementById('chat-tag');
    let inputPriority = document.getElementById('chat-priority');
    let inputText = document.getElementById('chat-input');
    let deletet = document.getElementById('chat-delete');
    if (!inputText.value) return false; //入力文字（質問等）がなかったら反映しない

    //質問の場合
    if (inputTag.value == "Q"){
        q_addSelect("Q" + Q_num,inputTag,deletet)   //選択肢を追加
    }

    output(inputText.value, inputTag.value, inputPriority.value);   //テキスト送信    
    setTimeout( ()=> {  inputText.value = ''; }, 1);                //入力ボックスの入力文字削除 
    setDatabaseQA();                                                //保存
}

//選択肢の追加処理
function q_addSelect(id,tag,del){
    function addoption(id,text,ele){
        const option = document.createElement('option');
        option.id = id;
        option.value = id;
        option.textContent = text;
        ele.appendChild(option);
    }
    addoption(id,id + "回答",tag);  //(送信の選択肢) 質問Qに対する回答の選択肢を追加
    addoption(id,id,del);           //(削除の選択肢) 削除する質問の選択肢を追加
}

//質問削除ボタンを押したときの処理
function deleteBtnFunc(){
    let deletet = document.getElementById('chat-delete');
    let Q = deletet.value;                              //削除する質問取得
    let li = document.querySelectorAll("#chat-ul li");  //全てのテキストについての要素取得

    if (window.confirm('質問＆回答を削除しますか？')) { //削除確認
        $('#chat-delete').children('option[value='+ Q +']').remove(); //削除部分の選択肢
        $('#chat-tag').children('option[value='+ Q +']').remove();    //送信部分の選択肢

        //テキストを削除
        Array.from(li).forEach( elm =>{
            if(elm.id == Q) elm.remove();
        });

        //データ格納先の状態を変更
        for(let i=0; i <dataQA.length;i++){
            if(dataQA[i].Q == Q) {
                dataQA[i].state ="delete";
            }
        }
        setDatabaseQA(); //保存
    }
}

//テキスト部分をクリックすると，テキスト送信時の動画時間に変更される
$(function(){
    $('#chat-ul').on('click', 'li', function () {
        var text = $(this)
        var v = document.getElementById("video1");
        for(let i=0; i <dataQA.length;i++){
            if(dataQA[i].Q == text[0].id) v.currentTime = dataQA[i].videotime;
        }
    });
});

//現在の時刻取得
var now = new Date();
function nowTime() {
    var Year = now.getFullYear();
    var Month = now.getMonth()+1;
    var Date = now.getDate();
    var Hour = now.getHours();
    var Min = now.getMinutes();
    return Year + "年" + Month + "月" + Date + "日" + Hour + ":" + Min;
}

//表示部分の順番を質問順か動画時間順か変更する
function sortQA(){
    const value = document.getElementById("chat-sort").value;   //選択した変更IDを取得(sort_T or sort_Q)
    let li = document.querySelectorAll("#chat-ul li");          // 要素の取得

    //質問の数および内容を取得
    var order =[]
    for(var i = 0; i < li.length; i++){
        if(li[i].value != null) order.push({id:li[i].id,time:li[i].value,order:li[i].id.replace("Q","")});
    }

    // video time順に質問をソート
    if(value == "sort_T"){         //動画時間順にソート       
        Array.from(li).forEach( elm =>{
            if(elm.className == "left")
                for(var i = 0; i < order.length; i++){
                    if(order[i].id == elm.id){
                        elm.style.order=order[i].time;
                        break;
                    }
                }
        });
    }else if(value == "sort_Q"){   //質問順にソート  
        Array.from(li).forEach( elm =>{ 
            if(elm.className == "left") elm.style.order=elm.id.replace("Q","");
        });
    } 
}

/*
    質問か回答かは.classで管理（left:質問,right:回答）  
    質問の順番は.idで管理
    質問の動画時間は.valueで管理
    QAデータの格納先:dataQA 送信するデータを格納
*/


/*detabaseとの処理----------------------------------------------------------------------------------------*/
/*保存部分の処理*/


function setDatabaseQA() {
    const projectname = getQueryParam('projectName');
    const workname = getQueryParam('workName');
    const videoid = getQueryParam('videoID');
    let flag = flag_QA();
    firebase.database().ref(projectname+"/workList/"+workname+"/"+videoid+"/qaData").set({
        qa: dataQA,
        flag: flag
    });
    flag_QA_update()
}

/*呼出部分の処理*/
function getDatabaseQA() {
    const projectname = getQueryParam('projectName');
    const workname = getQueryParam('workName');
    const videoid = getQueryParam('videoID');
    firebase.database().ref(projectname+"/workList/"+workname+"/"+videoid+"/qaData").get().then((snapshot) => {
        if (snapshot.exists()) {
            let data = snapshot.val()
            if(data.qa != null){  
                let inputTag = document.getElementById('chat-tag');
                let deletet = document.getElementById('chat-delete');
                dataQA = data.qa
                Q_num = dataQA.length

                for(var i = 0; i < dataQA.length; i++){
                    if(dataQA[i].state != "delete"){
                        roadQuestions(dataQA[i]);
                        q_addSelect(dataQA[i].Q,inputTag,deletet);

                        if(dataQA[i].A.length != 1){
                            for(var j = 1; j < dataQA[i].A.length; j++){        
                                const field = document.getElementById('field');
                                field.scroll(0, field.scrollHeight - field.clientHeight);
                                viewAns(dataQA[i].Q,dataQA[i].A[j].sendtime,dataQA[i].A[j].priority,dataQA[i].A[j].ans);
                            }
                        }
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

function roadQuestions(roadQ){
    const field = document.getElementById('field');
    field.scroll(0, field.scrollHeight - field.clientHeight);
    var videoTime = roadQ.videotime
    var sendTime = roadQ.sendtime
    viewQ(videoTime,sendTime,roadQ.priority,roadQ.content,roadQ.Q);
}
/*-------------------------------------------------------------------------------------------------------*/


function flag_QA(){
    let flag = 0
    if(dataQA != null){
        for(var i = 0; i < dataQA.length; i++){
            if(dataQA[i].flag == 1 && dataQA[i].state != "delete"){
                flag = flag + 1;
            }
        }
    }
    return flag
}


function flag_Q_all(){
    let all = 0
    if(dataQA != null){
        for(var i = 0; i < dataQA.length; i++){
                all = all + 1;
        }
    }
    return all
}

function flag_QA_update(){

    const projectname = getQueryParam('projectName');
    const workname = getQueryParam('workName');
    firebase.database().ref(projectname+"/workList/"+workname).get().then((snapshot) => {
        let flag = 0

        if (snapshot.exists()) {
            let data = snapshot.val()
            if(data.flag_qa != null) flag = data.flag_qa;
        }

        
        flag = flag - flag_Q_all() + flag_QA();
        firebase.database().ref(projectname+"/workList/"+workname).update({
            flag_qa: flag
        });
    });
}
