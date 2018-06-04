var jump = new Jump();// 該函數添加整個遊戲本體
jump.init();//遊戲初始化
jump.start();//可以進行跳動
jump.addFailedFn(//遊戲添加功能範例
	function(){
		alert('NOOB');
		this.revive();
	}
);