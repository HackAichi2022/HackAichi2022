let dataQA= []  //送信するQAデータを格納
let Q_num = 0;  //質問の数（番号）

window.addEventListener('load', function(){
    getDatabaseQA();
 });


/* 画面への出力処理----------------------------------------------------------------------------------------*/
// 画面への出力(val:メッセージ内容，person:ユーザー）
function output(val, person, page) {
    const field = document.getElementById('field');
    field.scroll(0, field.scrollHeight - field.clientHeight);
    var sendTime = nowTime();

    //テキストを表示
    if(person == "Q"){
        let li = viewQ(sendTime,page,val,"Q"+ Q_num);
        dataQA[Q_num]={Q:li.id, A:[],state:"add",sendtime:sendTime,page:page,content:val}
        dataQA[Q_num].A.push({ans:"回答内容",sendtime:"送信時間",page:"ページ番号"})
        Q_num+=1;
    } else{
        viewAns(person,sendTime,page,val)
        dataQA[person.replace("Q","")].A.push({ans:val,sendtime:sendTime,page:page})
    };
}

//質問の画面への出力部分
function viewQ(sendTime,page,val,id){
    const li = document.createElement('li');
    li.style="display:list-item block;"
    const div = document.createElement('div');
    let ul = document.getElementById('chat-ul');
    div.classList.add('chat-left');
    li.classList.add('left');
    li.id = id;
    console.log("page: "+page)
    li.value = page.replace("p","");
    li.style="display:list-item block;"
    ul.appendChild(li);
    div.innerHTML = "[" + id + "]    Send: "+ sendTime + "    /pege: " + page + "<br>  " + val;
    li.appendChild(div);
    return li
    }

//回答の画面への出力部分
function viewAns(person,sendTime,page,val){
    const li = document.createElement('li');
    li.style="display:list-item block;"
    const div = document.createElement('div');
    let ul = document.getElementById(person);
    div.classList.add('chat-right');
    li.classList.add('right');
    li.id = person
    ul.appendChild(li);
    div.innerHTML = "[" + person + " Ans]    Send:" + sendTime + " /pege: " + page + " <br>" + "  " + val;
    li.appendChild(div);
}

/* ---------------------------------------------------------------------------------------------------------*/

// 送信ボタンを押した時の処理
function sendBtnFunc() {
    let inputTag = document.getElementById('chat-tag');
    let inputpage = document.getElementById('page');
    let inputText = document.getElementById('chat-input');
    let deletet = document.getElementById('chat-delete');
    if (!inputText.value) return false; //入力文字（質問等）がなかったら反映しない

    //質問の場合
    if (inputTag.value == "Q") q_addSelect("Q" + Q_num,inputTag,deletet)   //選択肢を追加
    output(inputText.value, inputTag.value, inputpage.value);   //テキスト送信    
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
            if(dataQA[i].Q == Q) dataQA[i].state ="delete";
        }
        setDatabaseQA(); //保存
    }
}


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


/*detabaseとの処理----------------------------------------------------------------------------------------*/
/*保存部分の処理*/


function setDatabaseQA() {
    const projectname = getQueryParam('projectName');
    const workname = getQueryParam('workName');
    const pdfid = getQueryParam('pdfID');
    firebase.database().ref(projectname+"/workList/"+workname+"/"+pdfid+"_pdf/qaData").set({
        qa: dataQA
    });
}

/*呼出部分の処理*/
function getDatabaseQA() {
    const projectname = getQueryParam('projectName');
    const workname = getQueryParam('workName');
    const pdfid = getQueryParam('pdfID');
    firebase.database().ref(projectname+"/workList/"+workname+"/"+pdfid+"_pdf/qaData").get().then((snapshot) => {
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
    var sendTime = roadQ.sendtime
    viewQ(sendTime,roadQ.priority,roadQ.content,roadQ.Q);
}
/*-------------------------------------------------------------------------------------------------------*/


//テキスト部分をクリックした時の処理
$(function(){
    $('#chat-ul').on('click', 'li', function () {
        var text = $(this)

        for(let i=0; i <dataQA.length;i++){
            if(dataQA[i].Q == text[0].id) {
                console.log(text[0].value)
                state.currentPage = text[0].value;
                render();
            }
        }

    });
});


// $('#chat-ul').on('click', 'li', function () {
//     var text = $(this)
//     var v = document.getElementById("video1");
//     for(let i=0; i <dataQA.length;i++){
//         if(dataQA[i].Q == text[0].id) v.currentTime = dataQA[i].videotime;
//     }
// });