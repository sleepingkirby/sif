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
