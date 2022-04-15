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

  this.hookEl();

  window.onbeforeunload=(e)=>{return "Are you sure you want to leave?";}
  window.onpagehide=(e)=>{return "Are you sure you want to leave?";}
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
        this.sqlObj.loadDB((e)=>{document.getElementById(this.overId).style.display="none";});
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


/*-------------------------
pre: state variable, sql.js loaded, wasm binary
post: state updated, database modified.
class to handle and interact with the database
-------------------------*/
class sqljs{

  constructor(){
  }


  /*----------------------------------------------
  pre: state.dbFile.db, wasm, sql,js
  post: state modified
  load DB
  ----------------------------------------------*/
  async loadDB(callback){
    if(wasm.length<=0||typeof wasm!="string"){
    console.log("sqljs->loadDB() failed. wasm is not a string or empty");
    return false;
    }

  //convert wasm to uint8array to blob so sql.js can load it.
  var bin=atob(wasm);
  var len=bin.length;

  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
      bytes[i] = bin.charCodeAt(i);
  }

  var myBlob=new Blob([bytes], {type: 'application/wasm'});

  const config = await initSqlJs({
  locateFile: file => URL.createObjectURL(myBlob)
  });

    initSqlJs(config).then(function(SQL){
    const r = new FileReader();
      r.onload = function() {
      var Uints = new Uint8Array(r.result);
      state.dbObj = new SQL.Database(Uints);
      callback();
      }
    r.readAsArrayBuffer(state.dbFile);
    });
  }


  runQuery(){
    /*
      //Create the database
      const db = new SQL.Database();
      // Run a query without reading the results
      db.run("CREATE TABLE test (col1, col2);");
      // Insert two rows: (1,111) and (2,222)
      db.run("INSERT INTO test VALUES (?,?), (?,?)", [1,111,2,222]);

      // Prepare a statement
      const stmt = db.prepare("SELECT * FROM test WHERE col1 BETWEEN $start AND $end");
      stmt.getAsObject({$start:1, $end:1}); // {col1:1, col2:111}

      // Bind new values
      stmt.bind({$start:1, $end:2});
      while(stmt.step()) { //
        const row = stmt.getAsObject();
        console.log('Here is a row: ' + JSON.stringify(row));
      }
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

/*
function testfunc(){
var scrpt=document.createElement('script');
scrpt.src="./js/cal.js";
scrpt.defer=true;
scrpt.onload = () => { testFuncCal();};
document.head.appendChild(scrpt);
var c=document.createElement('script');
c.textContent='('+function () {
testFunc();
} +')();';

(document.head || document.documentElement).appendChild(c);
}
*/


var sqlObj=new sqljs();
var mainObj=new sif(mod);
mainObj.draw(state.pos);
