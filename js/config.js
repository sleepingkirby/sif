if(typeof config==='undefined'){
/*-------------------------------------------
pre: global mainObj, sqlObj, state variable, eventsLib for event/appointment CRUD
post: html changed, db updated
class to appointment events. Events DOESN'T HAVE TO BE APPOINTMENTS
-------------------------------------------*/
  class config{
    constructor(){
    this.tmpl={};
/*
uuid text primary key, username text null, password text null, salt text null, pin text null, status_id text not null, email text null, create_dt integer not null, mod_dt integer not null, failLgn_dt integer null, lastLgn_dt integer null, role_id text, parent_user_id text, notes text, foreign key(status_id) references status(uuid), foreign key(role_id) references roles(uuid), foreign key(parent_user_id) references users(uuid));

*/
      this.tmpl.main=`
      <div class="configWrap">
        <div class="configArea">
          <textarea name="config[email]" type="text" placeholder="email"></textarea>
          <div class="configRow">
            <span class="configRowLabel">Shift Start:</span>
            <input type="time" name="config[shift][start]"></input>
          </div>
          <div class="configRow">
            <span class="configRowLabel">Shift End:</span>
            <input type="time" name="config[shift][end]"></input>
          </div>
          <div class="configRow">
            <span class="configRowLabel">Icon set:</span>
            <select name="config[iconSet]">
              <option>test</option>
            </select>
          </div>
          <div class="configRowButton"><button>test</button></div>
        </div>
      </div>
      `;
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

    let shftStrt=document.getElementsByName('config[shift][start]');
    shftStrt=shftStrt?shftStrt[0]:null;
      if(shftStrt){
      shftStrt.value=String(state.user.config.shift.start.hour).padStart(2, '0')+":"+String(state.user.config.shift.start.minute).padStart(2, '0');
      }
    let shftEnd=document.getElementsByName('config[shift][end]');
    shftEnd=shftEnd?shftEnd[0]:null;
      if(shftEnd){
      shftEnd.value=String(state.user.config.shift.end.hour).padStart(2, '0')+":"+String(state.user.config.shift.end.minute).padStart(2, '0');
      }
    let email=document.getElementsByName('config[email]');
    email=email?email[0]:null;
      if(email){
      email.value=state.user.email;
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
