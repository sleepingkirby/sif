
function testfunc(){
var scrpt=document.createElement('script');
scrpt.src="./js/cal.js";
document.body.appendChild(scrpt);

var c=document.createElement('script');
c.textContent='('+function () {
console.log(state);
} +')();';

(document.head || document.documentElement).appendChild(c);


}

testfunc();
