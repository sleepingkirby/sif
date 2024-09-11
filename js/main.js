/* -----------------main class for sif------------------
pre:global variable state, default configs, menuLftObj(class instance), global variable mod, sqljs object
post: html changed
------------------------------------------------------*/
class sif{

  constructor(modObj, menuLftObj, scrptWrpId, dbInId, overId, sqljs){
  this.mod=modObj;
  this.dfltScrptId='modScript';
  this.dbPgId=dbInId?dbInId:"enterDatabaseWrap";//file input to enter database file
  this.overId=overId?overId:"overEnterDatabase";//file input to enter database file
  this.cssFadeOut="fadeOut";
  this.msgFloatId="msgFloat";
  this.overModId="overModCloseId";
  this.selectUserId="selectUser";
  this.sqlObj=typeof sqljs=="object"?sqljs:sqlObj;
    this.defaultConfig={
    "iconSet":"default",
    "clockInterval":60000,
    "ahead":"8",
    "behind":"4",
    "lunchStart":"12:00",
    "lunchDur":"30"
    }

  this.defaultConfig=this.defaultConfig?this.defaultConfig:defaultConfig;

  this.hookEl();
  this.modOpenClose("lftMod");
  this.modOpenClose("rghtMod");
  this.openCloseOverModHook();

  this.tmpl={};
  this.tmpl['rightNav']=[];
  this.tmpl['rightNav'].push(`<div class="rightNavActns" ><div class="menuIcon" onclick=mainObj.setState("pos","config") title="Settings" tabindex=0>`);
  this.tmpl['rightNav'].push(`</div>`);
  this.tmpl['rightNav'].push(`<div id="saveDB" class="menuIcon" title="Save" tabindex=0>`);
  this.tmpl['rightNav'].push(`</div>`);
  this.tmpl['rightNav'].push(`<div id="logout" class="menuIcon" title="Logout and save database." tabindex=0>`);
  this.tmpl['rightNav'].push(`</div></div>`);

    window.onbeforeunload=(e)=>{
    this.logout();
    e.preventDefault();
    e.returnValue=true;
    return "Are you sure you want to leave?";
    }
    window.onpagehide=(e)=>{
    return "Are you sure you want to leave?";
    }
  }


  /*-------------------------------------
  pre: this.mod, this.state, state.depModuleObjs
  post: module's destructor ran.
  run module's destructor function
  -------------------------------------*/
  logout(){
  this.destructModule();
    if(state.dbModded){
    const fn='sif-'+dtFlNm()+'.db';
    this.sqlObj.writeDb(fn);
    }
  state.dbModded=false;
  this.setState('dbFile',"");
  state.user={
    "uuid":null,
    "username":null,
    "type":null,
    "typeId":null,
    'config':null
    }
  state.pos='home';
  }

  /*-------------------------------------
  pre: this.mod, state.depModuleObjs
  post: module's destructor ran.
  run module's destructor function
  -------------------------------------*/
  destructModule(modNm=null){
  const moduleNm=modNm?modNm:state.pos
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
    const moduleNm=scrpt.getAttribute('module');
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
  let rtrn='';
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


  /*--------------------------------------
  pre:
  post:
  onchange hook for select user
  --------------------------------------*/
  flipDBSelect(whch='slct'){
  let selectUserWrap=document.getElementById('selectUserWrap');
  let enterDatabaseWrap=document.getElementById('enterDatabaseWrap');
    if(whch=='slct'){
    selectUserWrap.style.display='flex';
    enterDatabaseWrap.style.display='none';
    }
    else{
    selectUserWrap.style.display='none';
    enterDatabaseWrap.style.display='flex';
    }
  }
  
  
  /*--------------------------------------
  pre:
  post:
  onchange hook for select user
  --------------------------------------*/
  hookSlctEl(){
  let el=document.getElementById(this.selectUserId);
    el.onchange=(e)=>{
      if(e.target.value=="Select User"){
      return null;
      }
    document.getElementById(this.overId).style.display="none";
    this.getSetUser(e.target.value);
    this.flipDBSelect('db');
    }
  }

  /*----------- draw the module ----------
  pre: sqlObj
  post:
  gets config and user profile
  --------------------------------------*/
  getSetUser(userId=null){
  // ----- this is, essentially, the initialization for the app once the user provides the database -----
  //global configuration
  const config=this.sqlObj.runQuery(`
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
  //global config setting (in case user doesn't have any)
  state.user.config=this.defaultConfig;
    if(config&&config.length>0&&config[0].json){
    state.user.config=JSON.parse(config[0].json);
    }


  const profile=this.sqlObj.runQuery(`
  select
  users.uuid,
  users.username,
  users.email,
  users.notes,
  ut.name as userType,
  ut.uuid as userTypeId,
  cntct.fName as fName,
  cntct.surName as surName,
  cntct.mName as mName,
  cntct.phone as phone,
  cntct.cellphone as cellphone,
  cntct.addr as addr,
  cntct.addr2 as addr2,
  cntct.city as city,
  cntct.prov as prov,
  cntct.zip as zip,
  cntct.country as country,
  config.json
  from users
  left join users_type as u_t on u_t.user_uuid=users.uuid
  left join type as ut on ut.uuid=u_t.type_uuid
  left join config on config.users_id=users.uuid
  left join contacts as cntct on users.uuid=cntct.user_id
  where users.uuid=?
  `,[userId||'']);

    if(profile&&profile.length>=1){
    state.user.uuid=profile[0].uuid;
    state.user.username=profile[0].username;
    state.user.type=profile[0].userType;
    state.user.typeId=profile[0].userTypeId;
    state.user.email=profile[0].email;
    state.user.fName=profile[0].fName;
    state.user.surName=profile[0].surName;
    state.user.mName=profile[0].mName;
    state.user.phone=profile[0].phone;
    state.user.cellphone=profile[0].cellphone;

      if(profile[0].json){
      state.user.config=JSON.parse(profile[0].json);
      }
    }

  document.getElementById('rightNav').innerHTML=this.genRightNav();
  this.afterHookEl();
  this.saveHookEl();
  this.drawBottomEls();

  //setting left menu
  menuLftObj.setMenu();

  //setting up modules that needs to be loaded and available.
  this.addModule("apptQck", "lftModalScript");
  this.addModule("invcsRghtMod", null, false);
  this.addModule("apptRghtMod", null, false);
  this.addModule("homeCamera", null, false);

    if(!userId||userId=='null'){
    this.setFloatMsg("Create your new user");
    this.draw('config');
    return null;
    }
  this.draw(state.pos);

  /*reminder for later if needed
  let mod=eval(`new ${state.pos}()`);
  mod.draw();
  */
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
        const ext=state.dbFile&&state.dbFile.name?state.dbFile.name.substr(-3):null;
        if(ext!=".db"){
        state[id]="";
        }
        if(!state.dbFile){
        document.getElementById(this.overId).style.display="flex";
        }
        else if(state.dbFile && !state.user.uuid){
          this.sqlObj.loadDB((e)=>{

          let users=spltUsr(getUsers(null, 'email'));
          let selectUser=document.getElementById('selectUser');
          selectUser.innerHTML=genLoginUserSlct(users[''],'uuid', null);
          this.flipDBSelect('slct');
          let dbEl=document.getElementById('enterDatabase');
          dbEl.value="";
          }); 
        }
      break;
      case "pos":
        if(!state.user.uuid){
        const u=document.getElementById('databaseUsername');
        this.setFloatMsg("User not found. Save to set up user.");
        this.draw("config");
        }
        else{
        this.draw(val);
        }
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
  const el=document.getElementById(this.msgFloatId);
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
  const el=document.getElementById(this.msgFloatId);
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
  const cEl=el?el:document.getElementById(this.overModId);
  const prntEl=document.getElementById(cEl.getAttribute('hideel'));
    if(prntEl){
    prntEl.style.display=prntEl.style.display=='none'?'flex':'none';
    }
    if(state.depModuleObjs.hasOwnProperty('homeCamera')){
    state.depModuleObjs.homeCamera.closeStream();
    }

    //refresh list of photos from right modal
    if(apptRghtModObj&&apptRghtModObj.genPhotos){
    apptRghtModObj.genPhotos();
    }
  }

  /*-------------------------------------------------------
  pre: openCloseOverMod()
  post: hook set for overMod close button
  sets hook for overMod close button to close the modal on click
  -------------------------------------------------------*/
  openCloseOverModHook(){
  const el=document.getElementById(this.overModId);
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
  const el=document.getElementById(this.dbPgId);
    if(el){
      el.onchange=(e)=>{
      this.setState('dbFile', e.target.files[0]);
      el.value="";
      };
    }

  //message floating element. Removes class on self
  const floatMsg=document.getElementById(this.msgFloatId);
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

  this.hookSlctEl(); //select user event
  }

  /*---------------------------------------
  pre: setState(), global state
  post: element elId onchange is set
  params: elId=which element by id to attach onchange to.
  returns: none
  sets up onchange to elId
  ---------------------------------------*/
  afterHookEl(){
  const el=document.getElementById("logout");
    if(el){
      el.onclick=(e)=>{
      this.logout();
      }
    }
  }

  /*---------------------------------------
  pre: setState(), global state
  post: element elId onchange is set
  sets up onchange to elId
  ---------------------------------------*/
  saveHookEl(){
  const el=document.getElementById("saveDB");
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
  const el=document.getElementById('lftMod').getElementsByClassName('close')[0];
  this.modPrcClsCall(el);
  }

  /*-------------------------------------------------------
  pre: rghtMod element exists, modPrcClsCall()
  post: rghtMod modal opened or closed
  open/close right modal
  -------------------------------------------------------*/
  modRghtOpenClose(){
  const el=document.getElementById('rghtMod').getElementsByClassName('close')[0];
  this.modPrcClsCall(el);
  }

  /*-------------------------------------------------------
  pre: this.modPrcCls(), element of elId to be modal
  post: modal's state changes
  sets up modal open close
  -------------------------------------------------------*/
  modOpenClose(elId){
  const el=document.getElementById(elId);
  const cls=el.getElementsByClassName("close")[0];
  cls.onclick=(e)=>{this.modPrcCls(e);};
  }

  /*-------------------------------------------------------
  pre: modal existing, modPrcClsCall()
  post: modal's state changes
  params: onclick event's "e"
  hides or shows the element. *This is an adapter to modPrcClsCall() to for onclick event*
  -------------------------------------------------------*/
  modPrcCls(e){
  const el=e.target;
  this.modPrcClsCall(el);
  }


  /*-------------------------------------------------------
  pre: modal existing
  post: modal's state changes
  params: el=element (not ID, actual element) to be changed
  hides or shows the element of el. 
  -------------------------------------------------------*/
  modPrcClsCall(el){
  const oLft=el.getAttribute("oLft");
  const nLft=el.getAttribute("nLft");
  const oRght=el.getAttribute("oRght");
  const nRght=el.getAttribute("nRght");
  const prntEl=document.getElementById(el.getAttribute("hideEl"));

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
  const el=document.getElementById(elId);
    if(el){
      el.onchange=(e)=>{
      const r=new FileReader();
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
  const bin=atob(wasm);
  const len=bin.length;

  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
      bytes[i] = bin.charCodeAt(i);
  }

  const myBlob=new Blob([bytes], {type: 'application/wasm'});

  const config = await initSqlJs({
  locateFile: file => URL.createObjectURL(myBlob)
  });

    initSqlJs(config).then(function(SQL){
    const r = new FileReader();
      r.onload = function() {
      const Uints = new Uint8Array(r.result);
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
	const blob = new Blob([state.dbObj.export()]);
	const a = document.createElement("a");
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

  const stmt=state.dbObj.prepare(qry);
  const rtrn=[];
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
  const q=qry.trim().toLocaleLowerCase();
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
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
   });
}

const sqlObj=new sqljs();
const mainObj=new sif(mod, menuLftObj);
