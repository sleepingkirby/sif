/* -----------------main class for sif------------------
pre:global variable state, global variable mod, sqljs object
post: html changed
------------------------------------------------------*/
class sif{

  constructor(modObj, dbInId, overId, sqljs){
  this.mod=modObj;
  this.scrpt=document.createElement('script'); //element that holds the script
  this.dbPgId=dbInId?dbInId:"enterDatabase";//file input to enter database file
  this.overId=overId?overId:"overEnterDatabase";//file input to enter database file
  this.sqlObj=typeof sqljs=="object"?sqljs:sqlObj;
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

  //--------- setState --------------
  //if pos, redraw
  //if dbFile, turn on or off element Id "enterDatabase"
  setState(id, val){
    if(!state.hasOwnProperty(id)){
    return false;
    }
    state[id]=val;
    switch(id){
      case "dbFile":
        //validate if db file. If not, empty. if so hide element
        let ext=state.dbFile.name.substr(-3);
        if(ext!=".db"){
        state[id]="";
        return false;
        }
        if(!state.dbFile){
        document.getElementById(this.overId).style.display="flex";
        }
        else{
        document.getElementById(this.overId).style.display="none";
        this.sqlObj.load();
        }
      break;
      case "pos":
      break;
      default:
      break;
    }
  }

  //----------hook to turn on or off the enter Database page
  hookEl(elId=this.dbPgId){
  var el=document.getElementById(elId);
    if(el){
      el.onchange=(e)=>{
      this.setState('dbFile', e.target.files[0]);
      };
    }
  }

  getBlob(elId=this.dbPgId){
  var el=document.getElementById(elId);
    if(el){
      el.onchange=(e)=>{
      var r=new FileReader();
        r.onload=function(){
        const uints=new Uint8Array(r.result);
        console.log(uints);
        }
      r.readAsArrayBuffer(e.target.files[0]);
      };
    }
  }

  
}


class sqljs{

  constructor(){
  }

  load(){
  /*
  const db = new SQL.Database();
    if(state.dbFile){
    const f = state.dbFile;
    const r = new FileReader();
      r.onload = function() {
        const Uints = new Uint8Array(r.result);
        db = new SQL.Database(Uints);
      }
    r.readAsArrayBuffer(f);
    }
  */
  }
}


function loadDB(el){
  if(el.target.files.length<1){
  return null;
  }
  console.log(el.target.files);
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

var sqlObj=new sqljs();
var mainObj=new sif(mod);
mainObj.draw(state.pos);
//mainObj.hookEl();
mainObj.getBlob();
