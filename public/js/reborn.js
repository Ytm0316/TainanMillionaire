function reborn(){
  var question = new Array(4);

  question[0] = "A" ;
  question[1] = "B" ;
  question[2] = "C" ;
  question[3] = "D" ;
  question[4] = "E" ;

  var RandNum = Math.floor(Math.random()*5); //←數字請填寫圖片張數的值
  var q=question[RandNum];
  var content=document.getElementById("content" + (RandNum));
      content.innerHTML = q;

  
}
