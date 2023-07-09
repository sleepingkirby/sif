/* -----------------main class for sif------------------
pre:global variable state, global variable mod, sqljs object
post: html changed
------------------------------------------------------*/
class sif{

  constructor(modObj, scrptWrpId, dbInId, overId, sqljs){
  this.mod=modObj;
  this.scrpt=document.createElement('script'); //element that holds the script
  this.dbPgId=dbInId?dbInId:"enterDatabase";//file input to enter database file
  this.overId=overId?overId:"overEnterDatabase";//file input to enter database file
  this.sqlObj=typeof sqljs=="object"?sqljs:sqlObj;

  this.hookEl();
  this.modOpenClose("lftMod");
  this.modOpenClose("rghtMod");

  this.tmpl={};
  this.tmpl['rightNav']=[];
  this.tmpl['rightNav'][0]=`<div class="rightNavActns"><div class="menuIcon" title="Settings">`;
  this.tmpl['rightNav'][1]=`</div>`;
  this.tmpl['rightNav'][2]=`<div class="menuIcon" title="Logout">`;
  this.tmpl['rightNav'][3]=`</div></div></div>`;


    window.onbeforeunload=(e)=>{
      if(state.dbModded){
      this.sqlObj.writeDb();
      }
    return "Are you sure you want to leave?";
    }
  window.onpagehide=(e)=>{return "Are you sure you want to leave?";}
  }


  /*----------- draw the module ----------
  pre: global state, global iconSets, this.tmpl, iconLib.getEvalIcon()
  post: none
  param:iconSet=name of iconset to use
  returns: html
  generate righNav
  --------------------------------------*/
  genRightNav(){
  var rtrn='';
  rtrn+=this.tmpl['rightNav'][0]+getEvalIcon(iconSets, state.user.iconSet, 'settings')+this.tmpl['rightNav'][1];
  rtrn+=this.tmpl['rightNav'][2]+getEvalIcon(iconSets, state.user.iconSet, 'logout')+this.tmpl['rightNav'][3];
  return rtrn;
  }

  /*----------- draw the module ----------
  pre: global mod variable
  post: html redrawn
  param: str=name of module in global varibale "mod"
  returns: false if str empty or not valid
  inital draw for any new module
  --------------------------------------*/
  draw(str){
    if(!str||str==null||str==""||!this.mod.hasOwnProperty(str)){
    return false;
    }

    //if script exists in document, remove.
    if(document.getElementById(this.scrpt.id)){
    document.head.removeChild(this.scrpt);
    }

  //huh... lesson learned. You can't reuse the same instantiated script element to get the code within the script to run
  //you have to create a new script element and then add for it to run the code
  this.scrpt=document.createElement('script');
  this.scrpt.src=this.mod[str].path;
  this.scrpt.id="modScript";
  this.scrpt.setAttribute("defer", true);
  this.scrpt.setAttribute('type',"text/javascript");
    if(this.mod[str].hasOwnProperty('eval')&&this.mod[str].eval!=''){
      this.scrpt.onload = () => {
      eval(this.mod[str].eval);
      };
    }
  document.head.append(this.scrpt);
  }

  /*--------- setState --------------
  pre: this class, global state variable
  post: state modified, html modified(possibly)
  params: id=which index in global var "state" to modify, val=what value to modify to
  returns: false on empty or non-existent id 
  sets values in state global variable. And, if necessary, change/redraw the page
  basically, similar idea to react's setState. Only redraw when state is changed AND is necessary
  ---------------------------------*/
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
          this.sqlObj.loadDB((e)=>{
          document.getElementById(this.overId).style.display="none";
          console.log(this.sqlObj.runQuery("select * from config"));
          document.getElementById('rightNav').innerHTML=this.genRightNav();

          this.draw(state.pos);
          /*reminder for later if needed
          let mod=eval(`new ${state.pos}()`);
          mod.draw();
          */
          });
        }
      break;
      case "pos":
      this.draw(val);
      break;
      default:
      break;
    }
  }

  /*---------------------------------------
  pre: setState(), global state
  post: element elId onchange is set
  params: elId=which element by id to attach onchange to.
  returns: none
  sets up onchange to elId
  ---------------------------------------*/
  hookEl(elId=this.dbPgId){
  var el=document.getElementById(elId);
    if(el){
      el.onchange=(e)=>{
      this.setState('dbFile', e.target.files[0]);
      };
    }
  }

  /*-------------------------------------------------------
  pre: this.modPrcCls(), element of elId to be modal
  post: modal's state changes
  sets up modal open close
  -------------------------------------------------------*/
  modOpenClose(elId){
  let el=document.getElementById(elId);
  let cls=el.getElementsByClassName("close")[0];
  cls.onclick=(e)=>{this.modPrcCls(e);};
  }

  /*-------------------------------------------------------
  pre: modal existing, modPrcClsCall()
  post: modal's state changes
  params: onclick event's "e"
  hides or shows the element. *This is an adapter to modPrcClsCall() to for onclick event*
  -------------------------------------------------------*/
  modPrcCls(e){
  let el=e.target;
  this.modPrcClsCall(el);
  }


  /*-------------------------------------------------------
  pre: modal existing
  post: modal's state changes
  params: el=element (not ID, actual element) to be changed
  hides or shows the element of el. 
  -------------------------------------------------------*/
  modPrcClsCall(el){
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
  not use currently.
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

  /*------------------------------------------------
  pre: state, state.dbObj filled
  post: db file written to.
  write to db file
  ------------------------------------------------*/
  writeDb(){
	var blob = new Blob([state.dbObj.export()]);
	var a = document.createElement("a");
	document.body.appendChild(a);
	a.href = window.URL.createObjectURL(blob);
	a.download = "sql.db";
	  a.onclick = function () {
		  setTimeout(function () {
			window.URL.revokeObjectURL(a.href);
		  }, 1500);
	  };
	a.click();
  }

  /*-------------------------------------------------
  pre: sql.js, database loaded
  post: db modified (potentially)
  param: qry=sqlite query to run, binds=object to beind to the qry statement
  returns: object of results.
  runs the qry with binds, if needed. 
  -------------------------------------------------*/
  runQuery(qry, binds){
    //do nothing, no query
    if(!qry || qry==""){
    return null;
    }
    if(!state.dbObj){
    console.log("unable to run query. dbObj in state is empty");
    }

  let stmt=state.dbObj.prepare(qry);
  var rtrn=[];
    if(stmt && stmt.bind(binds)){
      while(stmt.step()){
      rtrn.push(stmt.getAsObject());
      }
    stmt.free();
    }
    else{
    console.log("unable to run query: "+qry);
    }

  //setting dbModded state to true
  let q=qry.toLocaleLowerCase();
    if(q.indexOf('select')!=0){
    state.dbModded=true;
    }

  return rtrn;
  }
}


function padDate(str){
  return String(str).padStart(2, '0');
}

function testFunc(v){
console.log(v);
}

//pulled this off the internet
function createUUID() {
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
   });
}

var sqlObj=new sqljs();
var mainObj=new sif(mod);
