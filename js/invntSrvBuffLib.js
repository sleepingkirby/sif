/*-----------------------------------------------
pre: sqlObj
post: none
common library for invntSrvBuff (inventory/service buffer)
-----------------------------------------------*/

/*-----------------------------------------------
pre: sqlObj
post: created new item for inventory/service buffer
create new inventory/service buffer item
-----------------------------------------------*/
function createInvntSrvBuff(event_uuid=null, invcs_uuid=null, invntSrv_uuid=null, invntSrvPrnt_uuid=null, amount=0, state=1){
  if(!invntSrv_uuid||invntSrv_uuid==""||!(event_uuid||invcs_uuid)){
  return null;
  }

let uuid=createUUID();

let query='insert into invntSrvBuff(uuid, event_uuid, invcs_uuid, invntSrv_uuid, invntSrvPrnt_uuid, amount, state) values($uuid, $event_uuid, $invcs_uuid, $invntSrv_uuid, $invntSrvPrnt_uuid, $amount, $state)';

let obj={$uuid:uuid, $event_uuid:event_uuid, $invcs_uuid:invcs_uuid, $invntSrv_uuid:invntSrv_uuid, $invntSrvPrnt_uuid:invntSrvPrnt_uuid, $amount:amount, $state:state}
  try{
  sqlObj.runQuery(query,obj);
  }
  catch(e){
  console.log('Unable to add entry to "invntSrvBuff" table. query: '+query+', binds: '+JSON.stringify(obj));
  console.log(e);
  }
}


/*----------------------------------------------
pre: sqlObj
post: none
gets inventory/service buff 
----------------------------------------------*/
function getInvntSrvBuff(uuid=null, event_uuid=null, invcs_uuid=null, invntSrv_uuid=null){
  if(!uuid&&!event_uuid&&!invcs_uuid&&!invntSrv_uuid){
  return null;
  }

let q=`
select
uuid,
event_uuid,
invcs_uuid,
invntSrv_uuid,
invntSrvPrnt_uuid,
amount,
state
from invntSrvBuff
`;
let obj={};

  if(uuid){
  q+=`where uuid=$uuid`;
  obj['$uuid']=uuid;
  }
  else if(event_uuid){
  q+=`where event_uuid=$event_uuid`;
  obj['$event_uuid']=event_uuid;
  }
  else if(invcs_uuid){
  q+=`where invcs_uuid=$invcs_uuid`;
  obj['$invcs_uuid']=invcs_uuid;
  }
  else if(invntSrv_uuid){
  q+=`where invntSrv_uuid=$invntSrv_uuid`;
  obj['$invntSrv_uuid']=invntSrv_uuid;
  }
  else{
  return null;
  }  

let rtrn=null;

  try{
  rtrn=sqlObj.runQuery(q,obj);
  }
  catch(e){
  console.log('Unable to get entry from "invntSrvBuff" table. query: '+q+', binds: '+JSON.stringify(obj));
  console.log(e);
  }
return rtrn;
}


/*-----------------------------------------------
pre: sqlObj
post: update database with new inventory/service buff
update invntSrvBuff
-----------------------------------------------*/
function updateInvntSrvBuff(uuid, hsh){
  if(!uuid){
  return null;
  }

let query='update invntSrvBuff set';
let obj={};
let c='';
let cols=['event_uuid', 'invcs_uuid', 'invntSrv_uuid', 'invntSrvPrnt_uuid', 'amount'];

  for(let col of cols){
    if(hsh.hasOwnProperty(col)&&hsh[col]){
    query+=`${c} ${col}=$${col}`;
    obj[`$${col}`]=hsh[col];
    c=',';
    }
  }

query+=" where uuid=$uuid";
obj['$uuid']=uuid;

  try{
  sqlObj.runQuery(query,obj);
  }
  catch(e){
  console.log('Unable to update entry in "invntSrvBuff" table. query: '+q+', binds: '+JSON.stringify(obj));
  console.log(e);
  }
}

/*-----------------------------------------------
pre: sqlObj
post: update database
update invntSrvBuff items with new state by evntId
-----------------------------------------------*/
function updateInvntSrvBuffStatesEvntId(evntId=null, state=1){
  if(!evntId){
  return null;
  }

  let q='update invntSrvBuff set state=$state where event_uuid=$eid';
  let obj={$state:state, $eid:evntId}

  try{
  sqlObj.runQuery(q,obj);
  }
  catch(e){
  console.log('Unable to update entry state in "invntSrvBuff" table. query: '+q+', binds: '+JSON.stringify(obj));
  console.log(e);
  }
  
}

/*-----------------------------------------------
pre: sqlObj
post: removes invntSrvBuff item 
deletes invntSrvBuff item from db
-----------------------------------------------*/
function delInvntSrvBuff(uuid, event_uuid, invcs_uuid, invntSrv_uuid){
  if(!uuid&&!event_uuid&&!invcs_uuid&&!invntSrv_uuid){
  return null;
  }

let q=`delete from invntSrvBuff`;
let obj={};

  if(uuid){
  q+=`where uuid=$uuid`;
  obj['$uuid']=uuid;
  }
  else if(event_uuid){
  q+=`where event_uuid=$event_uuid`;
  obj['$event_uuid']=event_uuid;
  }
  else if(invcs_uuid){
  q+=`where invcs_uuid=$invcs_uuid`;
  obj['$invcs_uuid']=invcs_uuid;
  }
  else if(invntSrv_uuid){
  q+=`where invntSrv_uuid=$invntSrv_uuid`;
  obj['$invntSrv_uuid']=invntSrv_uuid;
  }
  else{
  return null;
  }

  try{
  sqlObj.runQuery(q,obj);
  }
  catch(e){
  console.log('Unable to update entry in "invntSrvBuff" table. query: '+q+', binds: '+JSON.stringify(obj));
  console.log(e);
  }

}

