function reborn(){
  var question = new Array(4); 
  
  //問題的答案請放在數字%4+1的選項  ex:第0題答案為A  第5題答案為B
  question[0] = "A" ; 
  question[1] = "B" ;
  question[2] = "C" ;
  question[3] = "D" ;
  question[4] = "E" ;

  var RandNum = Math.floor(Math.random()*5); //←數字請填寫圖片張數的值
  var aus = RandNum % 4 + 1;
  var content=document.getElementById("content" + (RandNum));
      content.innerHTML = question[RandNum];

  return (aus);
}


