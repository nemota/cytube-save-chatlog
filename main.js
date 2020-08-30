//Synchtube Premiumに依存します
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
	'		ダウンロード時のファイル名(拡張子不要)<input type="text" id=file-name class="form-control cs-textbox"><br>'+
	'		<button class="btn btn-sm btn-default" id="chatSave-startbtn">記録スタート</button><br>'+
	'		<span id="chatSave-status">スタートボタンを押すと記録を開始します</span>'+
	'	</div>'+
	'</div>';
 	$chatSaveWrap.style.display="none";
 	$leftPaneInner.insertBefore($chatSaveWrap,$leftPaneInner.firstElementChild.nextElementSibling);
 	
 	//使う変数
 	var recording=false;//記録中か
 	var $messagebuffer=document.getElementById("messagebuffer");
 	var $chatSaveStartBtn=document.getElementById("chatSave-startbtn");
 	var $chatSaveStatus=document.getElementById("chatSave-status");
 	var $filename=document.getElementById("file-name");
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
 	
 	
 	//スタート・ストップボタンが押されたときの動作
 	$chatSaveStartBtn.onclick=function () {
 		if(!recording){//始めるときなら
 			//始める前の確認
 			if($filename.value.trim()==""){
 				alert("ファイル名を指定してください");
 				return;
 			}
 			if (!confirm("記録を開始します。よろしいですか？")){
 				return;
 			}
 			
 			recording=true;
 			$chatSaveStatus.innerText="準備中";
 			
 			//ボタン操作を一時的に無効に
 			$filename.disabled=true;
 			$chatSaveStartBtn.disabled=true;
 			
 			//開始メッセージを表示
 			var $startMessage=document.createElement("div");
 			$startMessage.classList.add("chat-msg-","serverinfo");
 			var $startMessage_span=document.createElement("span");
 			$startMessage_span.classList.add("action","scriptanswer");
 			$startMessage_span.innerText="▮ 記録を開始します  "+new Date();
 			$startMessage.appendChild($startMessage_span);
 			$messagebuffer.appendChild($startMessage);
 			$lastrecorded=$startMessage.previousElementSibling;
 			
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
 			},30000);
 			
 		}else{//終わるときなら
 			if(!confirm("記録を終了してよろしいですか？\n(記録終了後ログファイルがダウンロードされます)")){
 				return;
 			}
 			$chatSaveStatus.innerText="終了待機中(30秒以内に終了します)";
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
 			var tempText="";
 			var spans=$lastrecorded.getElementsByTagName("span");
 			if(spans.length==0){//切断通知などのとき
 				tempText+=$lastrecorded.innerText+"\n";
 			}else{//その他のとき
 				for(var tempNode=$lastrecorded.firstChild;tempNode!=null;tempNode=tempNode.nextSibling){
 					//子要素が複数あるかで場合分け
 					if(tempNode.childNodes.length>1){
 						for(var tempNode2=tempNode.firstChild;tempNode2!=null;tempNode2=tempNode2.nextSibling){
 							if(tempNode2.getElementsByClassName&&tempNode2.getElementsByClassName("embedimg").length>0){//埋め込み画像があれば
 								//リンクを追加
 								tempText+=tempNode2.getElementsByClassName("embedimg")[0].src;
 								
 							}else if(tempNode2.classList&&tempNode2.classList.contains("channel-emote")){//エモートであれば
 								//エモートタイトルを追加
 								tempText+=tempNode2.title;
 								
 							}else{//その他のとき
 								//文を追加
 								tempText+=tempNode2.innerText||tempNode2.data;
 								
 							}
 						}
 						
 					}else{
 						if(tempNode.getElementsByClassName("embedimg").length>0){//埋め込み画像があれば
 							//リンクを追加
 							tempText+=tempNode.getElementsByClassName("embedimg")[0].src;
 							
 						}else if(tempNode.getElementsByClassName("channel-emote").length>0){//エモートがあれば
 							//エモートタイトルを追加
 							tempText+=tempNode.getElementsByClassName("channel-emote")[0].title;
 							
 						}else{//その他のとき
 							//文を追加
 							tempText+=tempNode.innerText||tempNode.data;
 							
 						}
 					}
 					
 				}
 				chatlog+=tempText+"\n";
 			}
 			
 			
 			
 			//ここで保存が終わりなら
 			if($lastrecorded.id=="finishmessage"){
 				recording=false;
 				addChatNotification("記録を終了しました");
 				
 				//blobを作成し、ダウンロード
 				var link=document.createElement("a");
 				link.download=$filename.value;
 				var blob=new Blob([chatlog],{type:'text/plain'});
 				link.href=URL.createObjectURL(blob);
 				link.click();
 				URL.revokeObjectURL(link.href);
 				
 				//ファイル変更等の操作を有効に
 				$filename.disabled=false;
 				$chatSaveStartBtn.disabled=false;
 				
 				//ログをリセット
 				chatlog="";
 				
 				$chatSaveStartBtn.innerText="記録スタート";
 				$chatSaveStatus.innerText="保存先を選んでスタートボタンを押してください";
 			}
 		}
 	}
 	
})();
