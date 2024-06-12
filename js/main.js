/* -----------------main class for sif------------------
pre:global variable state, default configs, menuLftObj(class instance), global variable mod, sqljs object
post: html changed
------------------------------------------------------*/
class sif{

  constructor(modObj, menuLftObj, scrptWrpId, dbInId, overId, sqljs){
  this.mod=modObj;
  this.dfltScrptId='modScript';
  this.dbPgId=dbInId?dbInId:"enterDatabase";//file input to enter database file
  this.overId=overId?overId:"overEnterDatabase";//file input to enter database file
  this.cssFadeOut="fadeOut";
  this.msgFloatId="msgFloat";
  this.overModId="overModCloseId";
  this.sqlObj=typeof sqljs=="object"?sqljs:sqlObj;
  this.defaultConfig={
    "iconSet":"default",
    'shift':{
      'start': {
      'hour':10,
      'minute':0
      },
      'end':{
      'hour':20,
      'minute':0
      }
    }
  }

  this.hookEl();
  this.modOpenClose("lftMod");
  this.modOpenClose("rghtMod");
  this.openCloseOverModHook();

  this.tmpl={};
  this.tmpl['rightNav']=[];
  this.tmpl['rightNav'].push(`<div class="rightNavActns" onclick=mainObj.setState("pos","config")><div class="menuIcon" title="Settings" tabindex=0>`);
  this.tmpl['rightNav'].push(`</div>`);
  this.tmpl['rightNav'].push(`<div id="saveDB" class="menuIcon" title="Save" tabindex=0>`);
  this.tmpl['rightNav'].push(`</div>`);
  this.tmpl['rightNav'].push(`<div id="logout" class="menuIcon" title="Logout and save database." tabindex=0>`);
  this.tmpl['rightNav'].push(`</div></div>`);

    window.onbeforeunload=(e)=>{
      if(state.dbModded){
      const fn='sif-'+dtFlNm()+'.db';
      this.sqlObj.writeDb(fn);
      }
    e.preventDefault();
    e.returnValue=true;
    return "Are you sure you want to leave?";
    }
    window.onpagehide=(e)=>{
    return "Are you sure you want to leave?";
    }
  }

  /*-------------------------------------
  pre: this.mod, state.depModuleObjs
  post: module's destructor ran.
  run module's destructor function
  -------------------------------------*/
  destructModule(modNm=null){
  let moduleNm=modNm?modNm:state.pos
    if(moduleNm&&state.depModuleObjs.hasOwnProperty(moduleNm)){
      if(state.depModuleObjs[moduleNm].hasOwnProperty("destruct")){
      state.depModuleObjs[moduleNm].destruct();
      }
    }
  }

  /*-------------------------------------
  pre: this.mod, state.depModuleObjs
  post: module added to page.
  adds the module to the page.
  huh... lesson learned. You can't reuse the same instantiated script element to get the code within the script to run
  you have to create a new script element and then add for it to run the code
  -------------------------------------*/
  addModule(str, id, run=true, func=null){
  //if script element exists in document, remove from page and state.depModuleObjs
  let scrpt=document.getElementById(id);
    if(scrpt){
    document.head.removeChild(scrpt);

    //remove previous module from depMdulesObjs
    let moduleNm=scrpt.getAttribute('module');
      if(moduleNm&&state.depModuleObjs.hasOwnProperty(moduleNm)){
      this.destructModule(moduleNm);
      delete state.depModuleObjs[moduleNm];
      }
    }

  state.depModuleObjs[str]=true;
  scrpt=document.createElement('script');
  scrpt.src=this.mod[str].path;
  scrpt.id=id;
  scrpt.setAttribute("defer", true);
  scrpt.setAttribute('type',"text/javascript");
  scrpt.setAttribute('module',str);
    scrpt.onload = () => {
      if(this.mod[str].hasOwnProperty('eval')&&this.mod[str].eval!=''){
      eval(this.mod[str].eval);
      }
      if(run&&state.depModuleObjs[str]){
      state.depModuleObjs[str].run();
      }
      if(typeof func=='function'&&func){
      func();
      }
    };
  document.head.append(scrpt);
  }


  /*-------------------------------------
  pre: global state, iconSets, config
  post: html drawn
  draws the bottom elements
  -------------------------------------*/
  drawBottomEls(){
  const html=`<div id="mainBttmElsNewAppntment" class="menuIcon" onclick="mainObj.modLftOpenClose();apptQckObj.genLftMod();" title="Quick Add Appointment" tabindex=0>`+getEvalIcon(iconSets, state.user.config.iconSet, 'addAppointment')+`</div>`;
  const els=document.getElementsByClassName('bttmElsActns');
    for(const el of els){
    el.innerHTML=html;
    };
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
  rtrn+=this.tmpl['rightNav'][0]+getEvalIcon(iconSets, state.user.config.iconSet, 'settings')+this.tmpl['rightNav'][1];
  rtrn+=this.tmpl['rightNav'][2]+getEvalIcon(iconSets, state.user.config.iconSet, 'save')+this.tmpl['rightNav'][3];
  rtrn+=this.tmpl['rightNav'][4]+getEvalIcon(iconSets, state.user.config.iconSet, 'logout')+this.tmpl['rightNav'][5];
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

  this.addModule(str, this.dfltScrptId);
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
        let ext=state.dbFile&&state.dbFile.name?state.dbFile.name.substr(-3):null;
        if(ext!=".db"){
        state[id]="";
        }
        if(!state.dbFile){
        document.getElementById(this.overId).style.display="flex";
        }
        else{
          // ----- this is, essentially, the initialization for the app once the user provides the database -----
          this.sqlObj.loadDB((e)=>{
          document.getElementById(this.overId).style.display="none";
          var config=this.sqlObj.runQuery(`
          select
          config.uuid,
          config.users_id,
          config.json,
          users.username,
          users.email,
          users.notes,
          type.name
          from config
          left join users
          on config.users_id=users.uuid
          left join type
          on config.type_id=type.uuid
          where 
          type.name="global"
          `);
          state.user.config=this.defaultConfig;
            if(config&&config.length>0){
            state.user.config=JSON.parse(config[0].json);
            }
          document.getElementById('rightNav').innerHTML=this.genRightNav();
          this.afterHookEl();
          this.saveHookEl();
          this.drawBottomEls();

          //setting left menu
          menuLftObj.setMenu();

          //setting up module appt module to set up left modal
          this.addModule("apptQck", "lftModalScript");
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
      case "pageVars":
      break;
      default:
      break;
    }
  }

  /*-------------------------------------------------------
  pre: msgFloat Element. class fadeout "this.cssFadeOut"
  post: sets the innerHTML and add this.cssFadeOut from msgFloat element
  sets the innerHTML/message
  -------------------------------------------------------*/
  setFloatMsg(text){
    if(!text||text==""){
    return null;
    }
  let el=document.getElementById(this.msgFloatId);
    if(el&&el.classList&&!el.classList.contains(this.cssFadeOut)){
    el.innerText=text;
    el.classList.add(this.cssFadeOut);
    }
  }

  /*-------------------------------------------------------
  pre: msgFloat Element. class fadeout "this.cssFadeOut"
  post: removes this.cssFadeOut from msgFloat element
  removes this.cssFadOut from the msgFloat element
  -------------------------------------------------------*/
  closeFloatMsg(){
  let el=document.getElementById(this.msgFloatId);
    if(el&&el.classList&&el.classList.contains(this.cssFadeOut)){
    el.classList.remove(this.cssFadeOut);
    }
  }

  /*-------------------------------------------------------
  pre: element this.overModId
  post: overMod display changes
  toggles the display on overMod, hiding it or showing it
  -------------------------------------------------------*/
  openCloseOverMod(el){
  let cEl=el?el:document.getElementById(this.overModId);
  let prntEl=document.getElementById(cEl.getAttribute('hideel'));
    if(prntEl){
    prntEl.style.display=prntEl.style.display=='none'?'flex':'none';
    }
  }

  /*-------------------------------------------------------
  pre: openCloseOverMod()
  post: hook set for overMod close button
  sets hook for overMod close button to close the modal on click
  -------------------------------------------------------*/
  openCloseOverModHook(){
  let el=document.getElementById(this.overModId);
    el.onclick=(e)=>{
    this.openCloseOverMod(e.target);
    }
  }

  /*---------------------------------------
  pre: setState(), global state
  post: element elId onchange is set
  params: elId=which element by id to attach onchange to.
  returns: none
  sets up onchange to elId
  ---------------------------------------*/
  hookEl(){
  let el=document.getElementById(this.dbPgId);
    if(el){
      el.onchange=(e)=>{
      this.setState('dbFile', e.target.files[0]);
      el.value="";
      };
    }
  //message floating element. Removes class on self
  let floatMsg=document.getElementById(this.msgFloatId);
    if(floatMsg){
      floatMsg.onanimationend=(e)=>{
        if(e.target.classList.contains(this.cssFadeOut)){
        e.target.classList.remove(this.cssFadeOut);
        }
      }
      floatMsg.onclick=()=>{
      this.closeFloatMsg();
      }
    }
  }

  /*---------------------------------------
  pre: setState(), global state
  post: element elId onchange is set
  params: elId=which element by id to attach onchange to.
  returns: none
  sets up onchange to elId
  ---------------------------------------*/
  afterHookEl(){
  var el=document.getElementById("logout");
    if(el){
      el.onclick=(e)=>{
      this.destructModule();
        if(state.dbModded){
        const fn='sif-'+dtFlNm()+'.db';
        this.sqlObj.writeDb(fn);
        }
      state.dbModded=false;
      this.setState('dbFile',"");
      }
    }
  }

  /*---------------------------------------
  pre: setState(), global state
  post: element elId onchange is set
  sets up onchange to elId
  ---------------------------------------*/
  saveHookEl(){
  var el=document.getElementById("saveDB");
    if(el){
      el.onclick=(e)=>{
      const fn='sif-'+dtFlNm()+'.db';
      this.sqlObj.writeDb(fn);
      }
    }
  }

  /*-------------------------------------------------------
  pre: lftMod element exists, modPrcClsCall()
  post: lfttMod modal opened or closed
  open/close left modal
  -------------------------------------------------------*/
  modLftOpenClose(){
  let el=document.getElementById('lftMod').getElementsByClassName('close')[0];
  this.modPrcClsCall(el);
  }

  /*-------------------------------------------------------
  pre: rghtMod element exists, modPrcClsCall()
  post: rghtMod modal opened or closed
  open/close right modal
  -------------------------------------------------------*/
  modRghtOpenClose(){
  let el=document.getElementById('rghtMod').getElementsByClassName('close')[0];
  this.modPrcClsCall(el);
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
  writeDb(fn){
	var blob = new Blob([state.dbObj.export()]);
	var a = document.createElement("a");
	document.body.appendChild(a);
	a.href = window.URL.createObjectURL(blob);
	a.download = fn||"sif.db";
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
  let q=qry.trim().toLocaleLowerCase();
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
var mainObj=new sif(mod, menuLftObj);
