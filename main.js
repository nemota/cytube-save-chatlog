//Synchtube Premium、jQueryに依存します
(function () {
	//
	//要素の追加
	//
	
	//ボタンを作る
	var $chatControls=document.getElementById("chatcontrols");
	var $chatSaveBtn=document.createElement("button");
	$chatSaveBtn.id="chatsave-btn";
	$chatSaveBtn.classList.add("btn","btn-sm","btn-default","btn-chatctrl");
	$chatSaveBtn.innerHTML="保";//ボタンに表示するもの(仮)
	$chatControls.insertBefore($chatSaveBtn,$chatControls.firstElementChild.nextElementSibling);
	
	//関連操作用のウィンドウを作る
	var $leftPaneInner=document.getElementById("leftpane-inner");
	var $chatSaveWrap=document.createElement("div");
	$chatSaveWrap.id="chatsavewrap";
	$chatSaveWrap.classList.add("col-lg-12","col-md-12","wells","leftareas");
 	$chatSaveWrap.innerHTML=
 	'<div id="chatSave-well" class="well from-holizontal">'+
	'	<div style="text-align: center;">'+
	'		<button id="fileToSave-wrap"class="btn btn-sm btn-default" style="padding:0;">'+
	'			<label for="fileToSave" style="width:100%;height:100%;margin-bottom:0;padding:5px 10px;font-weight:400;">'+
	'				<span id=filename>保存先ファイルを選択</span>'+
	'				<input type="file" id="fileToSave" style="display:none"><br>'+
	'			</label>'+
	'		</button>'+
	'		<label for="isOverWrited" style="font-weight:400;">'+
	'			<input type="checkbox" id="isOverWrited" class="cs-checkbox">'+
	'			選択したファイルに上書き(チェックしなければ末尾に追加)'+
	'		</label>'+
	'		<br>'+
	'		<button class="btn btn-sm btn-default" id="chatSave-startbtn">記録スタート</button><br>'+
	'		<span id="chatSave-status">保存先を選んでスタートボタンを押してください</span>'+
	'	</div>'+
	'</div>';
 	$chatSaveWrap.style.display="none";
 	$leftPaneInner.insertBefore($chatSaveWrap,$leftPaneInner.firstElementChild.nextElementSibling);
 	
 	//作るもの
 	//スタートボタンが押されたときのイベントハンドラ
 	//↑ファイルが書き換えられる警告、ステータス変更、
 	//　チェックボックスとかファイルとか全部readonly、(ボタンはストップボタンにできるかな?)
 	//　ここから記録開始のメッセージを送る(appendchild()がいいだろう)
 	//　定期的にメッセージを保存するメソッドを無限ループで起動
 	//　OverWriteなら最初に全削除だけしてあとは両方末尾に追加でよさそう
 	//
 	//メッセージを保存するメソッド
 	//↑十秒に一回とか動かす
 	//　収集した最後のやつにID付与
 	//　ファイルに保存(毎回読み込むべき？)
 	//　無限ループ内につけるが、条件で終了できるように(あっちのハンドラの話)
 	
 	//
 	//イベントハンドラ、関数
 	//
 	
 	//使う変数
 	var recording=false;//記録中か
 	var $messagebuffer=document.getElementById("messagebuffer");
 	var $isOverWrited=document.getElementById("isOverWrited");
 	var $fileToSaveWrap=document.getElementById("fileToSave-wrap");
 	var $fileToSave=document.getElementById("fileToSave");
 	var $chatSaveStartBtn=document.getElementById("chatSave-startbtn");
 	var $chatSaveStatus=document.getElementById("chatSave-status");
 	var $filename=document.getElementById("filename");
 	var $lastrecorded;
 	var chatlog="";//出力する文字列
 	
 	//保ボタンを押したときの動作
 	$chatSaveBtn.onclick=function () {
 		$($chatSaveBtn).toggleClass("btn-success");
 		if($chatSaveBtn.classList.contains("btn-success")){
 			$chatSaveWrap.style.display="block";
 		}else{
 			$chatSaveWrap.style.display="none";
 		}
 	}
 	
 	//ファイル参照を決めたときにファイル名を表示
 	$fileToSave.onchange=function () {
 		$filename.innerText="保存先:"+$fileToSave.files[0].name;
 		
 	}
 	
 	//スタート・ストップボタンが押されたときの動作
 	$chatSaveStartBtn.onclick=function () {
 		if(!recording){//始めるときなら
 			//始める前の確認
 			if($fileToSave.files.length!=1){
 				alert("1つのファイルを選択してください");
 				return;
 			}
 			if (!confirm("ファイルが書き換えられます。よろしいですか？")){
 				return;
 			}
 			
 			recording=true;
 			$chatSaveStatus.innerText="準備中";
 			
 			//ファイル変更等の操作を無効に
 			$fileToSave.disabled=true;
 			$isOverWrited.disabled=true;
 			$chatSaveStartBtn.disabled=true;
 			$fileToSaveWrap.disabled=true;
 			
 			//開始メッセージを表示
 			var $startMessage=document.createElement("div");
 			$startMessage.classList.add("chat-msg-","serverinfo");
 			var $startMessage_span=document.createElement("span");
 			$startMessage_span.classList.add("action","scriptanswer");
 			$startMessage_span.innerText="▮ 記録を開始します  "+new Date();
 			$startMessage.appendChild($startMessage_span);
 			$messagebuffer.appendChild($startMessage);
 			$lastrecorded=$startMessage.previousElementSibling;
 			
 			//OverWriteの場合ファイルをリセット
 			if($isOverWrited.value){
 				
 			}
 			
 			//ストップボタンを有効に
 			$chatSaveStartBtn.innerText="記録ストップ";
 			$chatSaveStartBtn.disabled=false;
 			
 			//30秒毎の記録を開始
 			$chatSaveStatus.innerText="記録中";
 			saveRestMessages();
 			var saveroutine=setInterval(function () {
				if(!recording){
					clearInterval(saveroutine);				
				}
 				saveRestMessages();
 			},1000);
 			
 		}else{//終わるときなら
 			if(!confirm("記録を終了してよろしいですか？\n(記録終了後ログファイルがダウンロードされます)")){
 				return;
 			}
 			$chatSaveStatus.innerText="終了待機中";
 			$chatSaveStartBtn.disabled=true;
	 		
 			//終了メッセージを表示
 			var $finishMessage=document.createElement("div");
 			$finishMessage.id="finishmessage";
 			$finishMessage.classList.add("chat-msg-","serverinfo");
 			var $finishMessage_span=document.createElement("span");
 			$finishMessage_span.classList.add("action","scriptanswer");
 			$finishMessage_span.innerText="▮ ここまで記録します  "+new Date();
 			$finishMessage.appendChild($finishMessage_span);
 			$messagebuffer.appendChild($finishMessage);
 			
 			
 		}
 	};
 	
 	//まだ保存していないメッセージを保存する
 	function saveRestMessages() {
 		while($lastrecorded.nextElementSibling){//次の要素がある間
 			$lastrecorded=$lastrecorded.nextElementSibling;
 			
 			//$lastrecordedの中身をテキストに起こし、ログに追記
 			
 			
 			
 			
 			//ここで保存が終わりなら
 			if($lastrecorded.id=="finishmessage"){
 				recording=false;
 				addChatNotification("記録を終了しました");
 				
 				//blobを作成し、ダウンロード
 				
 				//ファイル変更等の操作を有効に
 				$fileToSave.disabled=false;
 				$isOverWrited.disabled=false;
 				$chatSaveStartBtn.disabled=false;
 				$fileToSaveWrap.disabled=false;
 				
 				$chatSaveStartBtn.innerText="記録スタート";
 				$chatSaveStatus.innerText="保存先を選んでスタートボタンを押してください";
 			}
 		}
 	}
 	
})();