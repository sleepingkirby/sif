if(typeof config==='undefined'){
/*-------------------------------------------
pre: global mainObj, sqlObj, state variable, eventsLib for event/appointment CRUD
post: html changed, db updated
class to appointment events. Events DOESN'T HAVE TO BE APPOINTMENTS
-------------------------------------------*/
  class config{
    constructor(){
    this.tmpl={};
      this.tmpl.main=`
      <div class="configWrap">
        <div class="configArea">
          <textarea name="config[email]" type="text" placeholder="email" title="email"></textarea>
          <div class="configRow configRowHead">
          User:
          </div>
          <div class="configRow">
            <span class="configRowLabel">User type:</span>
            <select name="config[typeId]" title="Type for user">
              <option>none</option>
            </select>
          </div>
          <div class="configRow configRowHead">
          User Types Management:
          </div>
          <div class="configRow">
            <textarea name="config[newUserType]" type="text" placeholder="new user type name" title="new user type name"></textarea>
            <div class="menuIcon" title="Add New User Type" onclick=configObj.addType()>`+getEvalIcon(iconSets, state.user.config.iconSet, 'addCircle')+`</div>
          </div>
          <div class="configRow">
             <select name="config[mngUserType]" class="configRowSlctDrpDwn" title="Manage User Type">
              <option>none</option>
            </select>
            <div class="menuIcon" title="Delete User Type" onclick=configObj.delType()>`+getEvalIcon(iconSets, state.user.config.iconSet, 'delete')+`</div>
          </div>
          <div class="configRow configRowHead">
          Home Page:
          </div>
          <div class="configRow">
            <span class="configRowLabel">Look ahead(hours):</span>
            <input type="number" name="config[ahead]" title="How far ahead to display appointments(in hours)" size="3" max="168" min="0" />
          </div>
          <div class="configRow">
            <span class="configRowLabel">Look behind(hours):</span>
            <input type="number" name="config[behind]" title="How far behind to display appointments(in hours)" size="3" max="168" min="0" />
          </div>
          <div class="configRow">
            <span class="configRowLabel">Lunch Start:</span>
            <input type="time" name="config[lunch-start]" title="Start of lunch time"></input>
          </div>
          <div class="configRow">
            <span class="configRowLabel">Lunch Duration(min):</span>
            <input type="number" name="config[lunch-dur]" title="Lunch duration in minutes." size="3"></input>
          </div>
          <div class="configRow">
            <span class="configRowLabel">Refresh Interval(sec):</span>
            <input type="number" name="config[clockInterval]" title="The interval(in seconds) which the home page will check to see which appointments is/are the current appointments." size="3" max=3600 />
          </div>
          <div class="configRow configRowHead">
          Icons:
          </div>
          <div class="configRow">
            <span class="configRowLabel">Icon set:</span>
            <select name="config[iconSet]" title="Icon set for app. (Requires re-login)">
              <option>none</option>
            </select>
          </div>
          <div class="configRow">
            <span class="configRowLabel redBold" style="font-size:small">Icon set change requires re-login</span>
          </div>
          <div class="configRowButton">
            <input id="configCreateBtn" type="submit" value="Create" onclick=configObj.save('create') title="Create new user" />
            <input id="configSaveBtn" type="submit" value="Save" onclick="configObj.save()" title="Save user settings" />
          </div>
          <div class="configRow configAbout">
            <a href="https://b3spage.sourceforge.io/index.html?sif" target="_blank" title="If you find this useful, please consider contributing. Any amount helps and allows me to continue to support and expand this application.">About/Contribute</a>
            <a href="https://github.com/sleepingkirby/sif" target="_blank" title="Link to the original source code">Source Code</a>
          </div>
        </div>
      </div>
      `;
    let types=[];
    }



    /*-----------------------------------------------
    pre: none
    post:
    -----------------------------------------------*/
    addType(){
    let typeEl=document.getElementsByName('config[newUserType]');
      if(!typeEl||typeEl.length<=0||!typeEl[0].value||typeEl[0].value==''){
      mainObj.setFloatMsg("No name entered for new user type");
      return null;
      }

    let rtrn=addType(typeEl[0].value,'users');

    this.popltUserType();
    mainObj.setFloatMsg("New user type added");
    }


    /*-----------------------------------------------
    pre: none
    post:
    -----------------------------------------------*/
    delType(){
    let typeEl=document.getElementsByName('config[mngUserType]');
      if(!typeEl||typeEl.length<=0||!typeEl[0].value||typeEl[0].value==''){
      mainObj.setFloatMsg("User type dropdown or value not found");
      return null;
      }

      if(this.types.length<=1){
      mainObj.setFloatMsg("At least 1 user type (that's not a customer) is needed.");
      return null;
      }

    delType(typeEl[0].value);

    this.popltUserType();
    mainObj.setFloatMsg("User type deleted");
    }


    /*-----------------------------------------------
    pre: none
    post: db saved 
    -----------------------------------------------*/
    save(type=null){
    let els=document.querySelectorAll('*[name^="config"]');
      let config={
      'iconSet':null,
      'clockInterval':60000,
      'ahead':null,
      'behind':null,
      'lunchStart':null,
      'lunchDur':30
      };
    let user={'email':null, 'typeId':null, 'type':null};
      for(let el of els){
        switch(getSubs(el.name,'config')){
        case 'ahead':
        config.ahead=el.value;
        break;
        case 'behind':
        config.behind=el.value;
        break;
        case 'lunch-start':
        config.lunchStart=el.value;
        break;
        case 'lunch-dur':
        config.lunchDur=el.value;
        break;
        case 'clockInterval':
        config.clockInterval=Number(el.value) * 1000;
        break;
        case 'iconSet':
        config.iconSet=el.value;
        break;
        case 'email':
        user.email=el.value;
        break;
        case 'typeId':
        user.typeId=el.value;
        break;
        default:
        break;
        }
      }

    let success=false;
      if(user.email&&user.typeId){
      let uType=this.types.find((e)=>e.uuid==user.typeId);
      user.type=uType?uType.name:null;
        if(type==='create'){
        success=createMe(user);
        }
        else{
        success=updtCurUser(state.user.uuid, user);
        }
      state.user.email=user.email;
      state.user.typeId=user.typeId;
      state.user.type=user.type;
      }

      if(!success){
      mainObj.setFloatMsg("Update to user profile failed");
      return null;
      }

      if(success&&els){
        if(type==="create"){
        state.user.uuid=success; //user uuid
        success=createConfig(success,JSON.stringify(config),success); 
        }
        else{
        success=updtConfig(JSON.stringify(config));
        }
      state.user.config=config;
      }
    
      if(!success){
      mainObj.setFloatMsg("Update to configuration failed");
      }
      else{
        if(type==="create"){
        mainObj.setFloatMsg("New user and configuration updated");
        mainObj.setState('pos', 'home');
        }
        else{
        mainObj.setFloatMsg("Configuration updated");
        }
      }
    }

 
    /*-----------------------------------------------
    pre: none
    post: write iconSets to select
    
    -----------------------------------------------*/
    genSelectIcon(iconSets=null, curVal=null, dfltVal=null ){
      if(!iconSets){
      return '';
      }
    let rtrn='';
    let arr=Object.keys(iconSets);
    
      for(let k of arr){
      let s='';
        if(curVal&&curVal==k){
        s=' selected';
        }
        else if(dfltVal==k){
        s=' selected';
        }
      rtrn+=`<option value="${k}"${s}>${k}</option>`;
      }
    return rtrn;
    }

    /*-----------------------------------------------
    pre: 
    post:
    -----------------------------------------------*/
    popltUserType(){
    this.types=selectType('users');
    this.types=this.types.filter((t)=>t.name!="customer");
    let typeEl=document.getElementsByName('config[typeId]');
    typeEl=typeEl?typeEl[0]:null;
      if(typeEl){
      typeEl.innerHTML=genSlct(this.types,'uuid','name', state.user.typeId,null);
      }

    let mngTypeEl=document.getElementsByName('config[mngUserType]');
    mngTypeEl=mngTypeEl?mngTypeEl[0]:null;
      if(mngTypeEl){
      mngTypeEl.innerHTML=genSlct(this.types,'uuid','name');
      }
    }

    /*-----------------------------------------------
    pre: state.user.config, iconSets, config[iconSet] element
    post: write the html (with user data) to page
    -----------------------------------------------*/
    popltData(){
      if(!state?.user?.config){
      return null;
      }
    let slct=document.getElementsByName('config[iconSet]');
    slct=slct?slct[0]:null;
      if(!slct){
      return null;
      }
    slct.innerHTML=this.genSelectIcon(iconSets);
    slct.value=state.user.config.iconSet;

    let ahead=document.getElementsByName('config[ahead]');
    ahead=ahead?ahead[0]:null;
      if(ahead){
      ahead.value=state.user.config?.ahead?String(state.user.config.ahead):8;
      }
    let behind=document.getElementsByName('config[behind]');
    behind=behind?behind[0]:null;
      if(behind){
      behind.value=state.user.config?.behind?String(state.user.config.behind):4;
      }
    let email=document.getElementsByName('config[email]');
    email=email?email[0]:null;
      if(email){
        email.value=state.user.email||'';
      }
    let lunchStart=document.getElementsByName('config[lunch-start]');
    lunchStart=lunchStart?lunchStart[0]:null;
      if(lunchStart){
      lunchStart.value=state.user.config?.lunchStart||"12:00";
      }
    let lunchDur=document.getElementsByName('config[lunch-dur]');
    lunchDur=lunchDur?lunchDur[0]:null;
      if(lunchDur){
      lunchDur.value=state.user.config?.lunchDur||30;
      }
    let clockInterval=document.getElementsByName('config[clockInterval]');
    clockInterval=clockInterval?clockInterval[0]:null;
      if(clockInterval){
      clockInterval.value=Number(state.user.config.clockInterval) / 1000;
      }

    this.popltUserType();
    }

    /*-----------------------------------------------
    pre: none
    post: write the html to the page
    -----------------------------------------------*/
    elSwitch(){
    let crtBtn=document.getElementById('configCreateBtn');
    let svBtn=document.getElementById('configSaveBtn');
      if(!state.user.uuid){
      crtBtn.style.display='flex';
      svBtn.style.display='none';
      }
      else{
      crtBtn.style.display='none';
      svBtn.style.display='flex';
      }
    }

    /*-----------------------------------------------
    pre: none
    post: write the html to the page
    -----------------------------------------------*/
    run(){
    document.getElementById('mainEl').innerHTML=this.tmpl.main;
    document.getElementById('leftNavMod').innerHTML="Configurations";
    this.elSwitch();
    this.popltData();
    }
  }

var configObj=new config();
state.depModuleObjs['config']=configObj;
}
