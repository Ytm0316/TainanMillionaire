 var q_used= new Array(4);
 var i;
 var deadtime = 5;  //總共可以死幾次(問題數)
 var rebor=document.getElementById("reborn");
 var select1=document.getElementById("select1");
 var select2=document.getElementById("select2");
 var select3=document.getElementById("select3");
 var select4=document.getElementById("select4");

    for (i = 0; i < 5; i++) {
        q_used[i]=0;
    }
 console.log(q_used);
function check(){
  RandNum = Math.floor(Math.random()*5);
  if(q_used[RandNum]== -1)
  {check();}

}
function reborn(){
  if(deadtime > 0){
    //rebor.style.display="block";
   
    var question = new Array(4); 
  
    //問題的答案請放在數字%4+1的選項  ex:第0題答案為A  第5題答案為B
    question[0] = "A" ; 
    question[1] = "B" ;
    question[2] = "C" ;
    question[3] = "D" ;
    question[4] = "E" ;

    var RandNum = Math.floor(Math.random()*5); //←數字請填寫圖片張數的值
    if(q_used[RandNum]== -1)
      {console.log("123");
       check();}
    deadtime = deadtime - 1 ;
    q_used[RandNum] = -1;
    console.log(RandNum);
    console.log(q_used[RandNum]);
    console.log(deadtime);
    var aus = RandNum % 4 + 1;
    var content=document.getElementById("content" + (RandNum));
        //content.style.display="block";
        //select1.style.display="block";
        //select2.style.display="block";
        //select3.style.display="block";
        //select4.style.display="block";
        content.innerHTML = question[RandNum];
        
   jump.revive();
   return (aus);
  }else{
     jump.restart();
     console.log("456");
   }
}

