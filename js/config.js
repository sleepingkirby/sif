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
             <span class="configRowLabel">User type:</span>
            <select name="config[typeId]" title="Type for user">
              <option>none</option>
            </select>
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
            <input id="configSaveBtn" type="submit" value="Save" onclick="configObj.save()"/>
          </div>
        </div>
      </div>
      `;
    let types=[];
    }


    /*-----------------------------------------------
    pre: none
    post: db saved 
    -----------------------------------------------*/
    save(){
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

      if(els){
      success=updtConfig(JSON.stringify(config));
      state.user.config=config;
      }
    
      if(success===false){
      mainObj.setFloatMsg("Update to configuration failed");
      }

      if(user.email&&user.typeId){
      let type=this.types.find((e)=>e.uuid==user.typeId);
      user.type=type?type.name:null;
      success=updtCurUser(state.user.uuid, user);
      state.user.email=user.email;
      state.user.typeId=user.typeId;
      state.user.type=user.type;
      }

      if(success===false){
      mainObj.setFloatMsg("Update to profile failed");
      }
      else{
      mainObj.setFloatMsg("Configuration updated");
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
      email.value=state.user.email;
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

    this.types=selectType('users');
    let typeEl=document.getElementsByName('config[typeId]');
    typeEl=typeEl?typeEl[0]:null;
      if(typeEl){
      this.types=selectType('users');
      typeEl.innerHTML=genSlct(this.types,'uuid','name', state.user.typeId,null);
      }
    }

    /*-----------------------------------------------
    pre: none
    post: write the html to the page
    -----------------------------------------------*/
    run(){
    document.getElementById('mainEl').innerHTML=this.tmpl.main;
    document.getElementById('leftNavMod').innerHTML="Configurations";
    this.popltData();
    }
  }

var configObj=new config();
state.depModuleObjs['config']=configObj;
}
