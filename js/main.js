/* -----------------main class for sif------------------
pre:global variable state, global variable mod, sqljs object
post: html changed
------------------------------------------------------*/
class sif{

  constructor(modObj, scrptWrpId, dbInId, overId, sqljs){
  this.mod=modObj;
  this.scrpt=document.createElement('script'); //element that holds the script
  this.scrptWrpId=scrptWrpId?scrptWrpId:"endJs";//file input to enter database file
  this.scrptWrpEl=document.getElementById(this.scrptWrpId);
  this.scrptWrpObsrv=null; //place holder for mutation observer.
  this.setMutationObsrv(this.scrptWrpEl);
  this.dbPgId=dbInId?dbInId:"enterDatabase";//file input to enter database file
  this.overId=overId?overId:"overEnterDatabase";//file input to enter database file
  this.sqlObj=typeof sqljs=="object"?sqljs:sqlObj;

  this.hookEl();
  this.modOpenClose("lftMod");
  this.modOpenClose("rghtMod");


  window.onbeforeunload=(e)=>{return "Are you sure you want to leave?";}
  window.onpagehide=(e)=>{return "Are you sure you want to leave?";}
  }

  
  //sets mutation observer for the element.
  setMutationObsrv(el, optsObj){
    if(!el){
    return null; //element is null, do nothing.
    }
  
  let opts=optsObj;
    if(!opts){
    opts={childList:true};
    }

    this.scrptWrpObsrv=new MutationObserver(function(e){
    console.log("=========== testing mutation observer ==========");
    console.log(e);
    
    });

  this.scrptWrpObsrv.observe(el, opts);
  }

  /*----------- draw the module ----------

  --------------------------------------*/
  draw(str){
    if(!str||str==null||str==""||!this.mod.hasOwnProperty(str)){
    return false;
    }

    //if script exists in document, remove.
    if(document.getElementById(this.scrpt.id)){
    document.head.removeChild(this.scrpt);
    }

  //huh... lesson learned. You can't reuse the same instantiated element to get the code to run.
  //you have to create a new element and then add for it to run.
  this.scrpt=document.createElement('script');
  this.scrpt.src=this.mod[str].path;
  this.scrpt.id="modScript";
  this.scrpt.setAttribute("defer", true);
  this.scrpt.setAttribute('type',"text/javascript");
    if(this.mod[str].hasOwnProperty('eval')&&this.mod[str].eval!=''){
      console.log("eval");
      this.scrpt.onload = () => {
      console.log("eval onload");
      /*
      var obj = eval(`new ${this.mod[str].class}()`); 
      document.getElementById('mainEl').innerHTML=obj.genCal();
      */
      console.log(this.mod[str].eval);
      eval(this.mod[str].eval);
      };
    }

  console.log(this.scrpt); 
  document.head.append(this.scrpt);
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
      this.draw(val);
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

  /*-------------------------------------------------------
  pre:
  post:
  sets up mod open clse
  -------------------------------------------------------*/
  modOpenClose(elId){
  let el=document.getElementById(elId);
  let cls=el.getElementsByClassName("close")[0];
  cls.onclick=this.modPrcCls;
  }

  /*-------------------------------------------------------
  pre:
  post:
  hides or shows the element of elId.
  -------------------------------------------------------*/
  modPrcCls(e){
  let el=e.target;
  let oLft=el.getAttribute("oLft");
  let nLft=el.getAttribute("nLft");
  let oRght=el.getAttribute("oRght");
  let nRght=el.getAttribute("nRght");
  let prntEl=document.getElementById(el.getAttribute("hideEl"));

    if(oLft&&nLft){
      if(prntEl.style.left==''||prntEl.style.left==oLft){
      prntEl.style.left=nLft;
      return null;
      }
      if(prntEl.style.left!=oLft){
      prntEl.style.left=oLft;
      return null;
      }
    }

    if(oRght&&nRght){
      if(prntEl.style.right==''||prntEl.style.right==oRght){
      prntEl.style.right=nRght;
      return null;
      }
      if(prntEl.style.right!=oRght){
      prntEl.style.right=oRght;
      return null;
      }
    }

  }

  /*-------------------------------------------------------
  pre:
  post:
  -------------------------------------------------------*/
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


  testFunc(v){
  console.log(v);
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

function testFunc(v){
console.log(v);
}


var sqlObj=new sqljs();
var mainObj=new sif(mod);
mainObj.draw(state.pos);
