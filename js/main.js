/* -----------------main class for sif------------------
pre:global variable state, global variable mod
post: html changed
------------------------------------------------------*/
class sif{

  constructor(modObj){
  this.mod=modObj;
  }

  draw(str){
    if(!str||str==null||str==""||!this.mod.hasOwnProperty(str)){
    return false;
    }

  var scrpt=document.createElement('script');
  scrpt.src=this.mod[str].path;
  scrpt.defer=true;
  scrpt.id="modScript";
    if(this.mod[str].hasOwnProperty('eval')&&this.mod[str].eval!=''){
      scrpt.onload = () => {
      /*
      var obj = eval(`new ${this.mod[str].class}()`); 
      document.getElementById('mainEl').innerHTML=obj.genCal();
      */
      eval(this.mod[str].eval);
      };
    }
  document.head.appendChild(scrpt);
  }

}

function changePos(pos){
  if(!pos||pos==""){
  return false;
  }

  

}


function testfunc(){
var scrpt=document.createElement('script');
scrpt.src="./js/cal.js";
scrpt.defer=true;
scrpt.onload = () => { testFuncCal();};
document.head.appendChild(scrpt);
/*
var c=document.createElement('script');
c.textContent='('+function () {
testFunc();
} +')();';

(document.head || document.documentElement).appendChild(c);
*/

}

var mainObj=new sif(mod);
mainObj.draw(state.pos);
