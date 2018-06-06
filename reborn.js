var question = new Array(4);

question[0] = "A" ;
question[1] = "B" ;
question[2] = "C" ;
question[3] = "D" ;
question[4] = "E" ;



var RandNum = Math.floor(Math.random()*5); //←數字請填寫圖片張數的值
var q=question[RandNum];
document.write(<div class="content">赤崁樓位於哪一座城市
		<p></p><p></p>
		A:台南 B:台北 C:台中 D:高雄
		</div>)
