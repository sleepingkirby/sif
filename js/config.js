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
          <div class="configRow">
            <span class="configRowLabel">Shift Start:</span>
            <input type="time" name="config[shift-start]" title="Start of shift time"></input>
          </div>
          <div class="configRow">
            <span class="configRowLabel">Shift End:</span>
            <input type="time" name="config[shift-end]" title="End of shift time"></input>
          </div>
          <div class="configRow">
             <span class="configRowLabel">User type:</span>
            <select name="config[typeId]" title="Type for user">
              <option>none</option>
            </select>
          </div>
          <div class="configRow">
            <span class="configRowLabel">Icon set:</span>
            <select name="config[iconSet]" title="Icon set for app. (Requires restart)">
              <option>none</option>
            </select>
          </div>
          <div class="configRow">
            <span class="configRowLabel redBold">Icon set change requires restart</span>
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
        'shift':{
          'start':null,
          'end':null
        }
      };
    let user={'email':null, 'typeId':null, 'type':null};
      for(let el of els){
        switch(getSubs(el.name,'config')){
        case 'shift-start':
        config.shift.start=el.value;
        break;
        case 'shift-end':
        config.shift.end=el.value;
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

    let shftStrt=document.getElementsByName('config[shift-start]');
    shftStrt=shftStrt?shftStrt[0]:null;
      if(shftStrt){
      shftStrt.value=String(state.user.config.shift.start);
      }
    let shftEnd=document.getElementsByName('config[shift-end]');
    shftEnd=shftEnd?shftEnd[0]:null;
      if(shftEnd){
      shftEnd.value=String(state.user.config.shift.end);
      }
    let email=document.getElementsByName('config[email]');
    email=email?email[0]:null;
      if(email){
      email.value=state.user.email;
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
