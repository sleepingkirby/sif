// check it element (el) wants padding and set it if so.
function padVal(el, val){
let v=val;

let min=el.getAttribute("minVal");
let max=el.getAttribute("maxVal");
let len=el.getAttribute("padLen");
let chr=el.getAttribute("padChar");

  if(min&&max){
    if(v<min){
    v=max;
    }
    if(v>max){
    v=min;
    }
  }

  if(len&&chr){
  v=String(v).padStart(len, chr);
  }

el.innerText=v;
}

/*----------------------------------
pre:
post:
gets the string within the brackets. i.e contact[subname] gets subname
----------------------------------*/
function getSubs(str, head="contact"){
  if(str){
  const patt=new RegExp('(^'+head+'\\[|\\]$)','g');
  return str.replace(patt,"");
  }
return "";
}

/*----------------------------------
pre: none
post: none
takes an array of hashs and makes a hash of hashes index by indx
indx HAS to exist in all hashs inside array
----------------------------------*/
function arrOfHshToHshHsh(indx, arr){
  if(!indx){
  return null;
  }
  if(!arr&&arr.length<=0){
  return null;
  }

  let hsh={};
  for(let ind in arr){
    if(!arr[ind].hasOwnProperty(indx)){
    return null;
    }
    hsh[arr[ind][indx]]={...arr[ind],'indx':ind};
  }

return {...hsh};
}
