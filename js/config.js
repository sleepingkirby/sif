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
          <div class="configRow"><span class="configRowLabel">Shift Start:</span><input type="time" name="config[shift][start]"></input></div>
          <div class="configRow"><span class="configRowLabel">Shift End:</span><input type="time" name="config[shift][end]"></input></div>
          <div class="configRowButton"><button>test</button></div>
        </div>
      </div>
      `;
    }

    /*-----------------------------------------------
    pre: none
    post: write the html to the page
    -----------------------------------------------*/
    run(){
    document.getElementById('mainEl').innerHTML=this.tmpl.main;
    }
  }

var configObj=new config();
state.depModuleObjs['config']=configObj;
}
