//Synchtube Premium、jQueryに依存します
(function () {
	//
	//要素の追加
	//
	
	//ボタンを作る
	var $chatControls=document.getElementById("chatcontrols");
	var chatSaveButton=document.createElement("button");
	chatSaveButton.id="chatsave-btn";
	chatSaveButton.classList.add("btn","btn-sm","btn-default","btn-chatctrl");
	chatSaveButton.innerHTML="保";//ボタンに表示するもの(仮)
	chatControls.insertBefore(chatSaveButton,$chatControls.firstElementChild.nextElementSibling);
	
	//関連操作用のウィンドウを作る
	var $leftPaneInner=document.getElementById("leftpane-inner");
	var chatSaveWrap=document.createElement("div");
	chatSaveWrap.id="chatsavewrap";
	chatSaveWrap.classList.add("col-lg-12","col-md-12","wells","leftareas");
 	chatSaveWrap.innerHTML=
 	'<div id="chatSave-well" class="well from-holizontal">'+
	'	<div style="text-align: center;">'+
	'		<input type="file" id="fileToSave"><br>'+
	'		<label for="isOverwrited">'+
	'			<input type="checkbox" id="isOverwrited" class="cs-checkbox">'+
	'			選択したファイルに上書き(チェックしなければ末尾に追加)'+
	'		</label>'+
	'		<br>'+
	'		<button class="btn btn-sm btn-default">記録スタート</button><br>'+
	'		<span id="status">保存先を選んでスタートボタンを押してください</span>'+
	'	</div>'+
	'</div>';
 	chatSaveWrap.style.display="none";
 	$leftPaneInner.insertBefore(chatSaveWrap,$leftPaneInner.firstElementChild.nextElementSibling);
 	
 	//作るもの
 	//スタートボタンが押されたときのイベントハンドラ
 	//↑ファイルが書き換えられる警告、ステータス変更、
 	//　チェックボックスとかファイルとか全部readonly、(ボタンはストップボタンにできるかな?)
 	//　ここから記録開始のメッセージを送る(addChatNotifycation()使う)
 	//　定期的にメッセージを保存するメソッドを無限ループで起動
 	//　OverWriteなら最初に全削除だけしてあとは両方末尾に追加でよさそう
 	//
 	//メッセージを保存するメソッド
 	//↑十秒に一回とか動かす
 	//　収集した最後のやつにID付与
 	//　ファイルに保存(毎回読み込むべき？)
 	//　無限ループ内につけるが、条件で終了できるように(あっちのハンドラの話)
 	
})();