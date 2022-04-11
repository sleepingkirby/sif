/* -----------------main class for sif------------------
pre:global variable state, global variable mod
post: html changed
------------------------------------------------------*/
class sif{

  constructor(modObj){
  this.mod=modObj;
  this.scrpt=document.createElement('script'); //element that holds the script
  }


  //----------- draw the module ----------
  draw(str){
    if(!str||str==null||str==""||!this.mod.hasOwnProperty(str)){
    return false;
    }


  this.scrpt.src=this.mod[str].path;
  this.scrpt.defer=true;
  this.scrpt.id="modScript";
    if(this.mod[str].hasOwnProperty('eval')&&this.mod[str].eval!=''){
      scrpt.onload = () => {
      /*
      var obj = eval(`new ${this.mod[str].class}()`); 
      document.getElementById('mainEl').innerHTML=obj.genCal();
      */
      eval(this.mod[str].eval);
      };
    }

    //if script exists in document, remove.
    if(document.getElementById(this.scrpt.id)){
    document.head.removeChild(this.scrpt);
    }

  document.head.appendChild(this.scrpt);
  }

}


class sqljs{

  constructor(){}

  async main(){
  const initSqlJs = require('sql.js');
  //const initSqlJs = window.initSqlJs;

    const SQL = await initSqlJs({
    // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
    // You can omit locateFile completely when running in node
    locateFile: file => './sql-wasm.wasm'
    });

  //========= load db
  /*
    dbFileElm.onchange = () => {
      const f = dbFileElm.files[0];
      const r = new FileReader();
      r.onload = function() {
        const Uints = new Uint8Array(r.result);
        db = new SQL.Database(Uints);
      }
      r.readAsArrayBuffer(f);
    }
  */

  /*=== export to disk
    const fs = require("fs");
    // [...] (create the database)
    const data = db.export();
    const buffer = new Buffer(data);
    fs.writeFileSync("filename.sqlite", buffer);
  */

  }

}


function padDate(str){
  return String(str).padStart(2, '0');
}

function changePos(pos){
  if(!pos||pos==""){
  return false;
  }

  state.pos=pos;
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
