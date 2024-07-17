/*-----------------------------------------------
pre: sqlObj
post: none
common library for getting setting the events
-----------------------------------------------*/


/*-----------------------------------------------
pre: sqlObj
post: update databasewith new event
create new event
-----------------------------------------------*/
/*
sqlite> .schema events
CREATE TABLE events(uuid text not null primary key, forUser_id text not null, byUser_id text not null, create_date int not null, on_date int not null, done_date int null, duration int null, notes text, foreign key(forUser_id) references users(uuid), foreign key(byUser_id) references users(uuid));
*/
function createEvent(forUser, byUser, onDt, dur=30, type=null, stts=null, invntSrvs=[], users=[]){
let evnt_uuid=createUUID();
let nullStts=stts?'$stts':'(select uuid from status where name=$stts)';
let query='insert into events(uuid, forUser_id, byUser_id, status_id, create_date, on_date, duration) values($uuid, $forUser_id, $byUser_id, '+nullStts+', datetime($now_date), datetime($on_date), $dur)';
let obj={$uuid:evnt_uuid, $forUser_id:forUser, $byUser_id:byUser, $now_date:toInptValFrmt(), $on_date:onDt, $dur:dur, $stts:stts||'active'};
  sqlObj.runQuery(query,obj);
  /*
  try{
  sqlObj.runQuery(query,obj);
  }
  catch(e){
  console.log('Unable to add entry to "events" table. query: '+query+', binds: '+JSON.stringify({$uuid:evnt_uuid, $forUser_id:forUser, $byUser_id:byUser, $on_date:onDt, $dur:dur}));
  console.log(e);
  return null;
  }
  */

/*
CREATE TABLE events_type(uuid text not null primary key, event_uuid text not null, type_uuid text not null, foreign key(event_uuid) references events(uuid), foreign key(type_uuid) references type(uuid));
*/
  //need to set type for event
  if(type){
    let evntTyp_uuid=createUUID();
    query='insert into events_type(uuid, event_uuid, type_uuid) values($uuid, $event_uuid, (select uuid from type where categ="events" and name=$type))';
    obj={$uuid:evntTyp_uuid, $event_uuid:evnt_uuid, $type:type};

      try{
      sqlObj.runQuery(query,obj);
      }
      catch(e){
      console.log('Unable to add entry to "events_type" table. query: '+query+', binds: '+JSON.stringify(obj));
      console.log(e);
      return null;
      }
  }

/*
CREATE TABLE events_invntSrv(uuid text not null, create_date int not null, events_id text not null, invntSrv_id text not null, foreign key(events_id) references events(uuid), foreign key(invntSrv_id) references invntSrv(uuid));
*/
  //set what services or products are involved in this event
  let subQ='';
  let subObj='';
  let subQB='';
  let subObjB=null;

  if(invntSrvs&&typeof invntSrvs=="object"&&invntSrvs.length>0){
    invntSrvs.forEach((invnt)=>{
    subQ='insert into events_invntSrv(uuid, create_date, events_id, invntSrv_id) values($uuid, datetime("now"), $evntId, $invntId)';
    subObj={$uuid:createUUID(), $evntId:evnt_uuid, $invntId:invnt};

      try{
      sqlObj.runQuery(subQ,subObj);
      }
      catch(e){
      console.log('Unable to add entry to "events_invntSrv" table. Query: '+subQ+', binds: '+JSON.stringify(subObj));
      console.log(e);
      return null;
      }

      try{
      createInvntSrvBuff(evnt_uuid, null, invnt, null, 1);
      }
      catch(e){
      console.log('Unable to add entry to "invntSrvBuff" table. Query: '+subQ+', binds: '+JSON.stringify(subObj));
      console.log(e);
      return null;
      }

    });
  }

  if(users&&typeof users=="object"&&users.length>0){
    users.forEach((user)=>{
    subQ='insert into events_users(uuid, events_id, users_id) values($uuid, $evntId, $user)';
    subObj={$uuid:createUUID(), $evntId:evnt_uuid, $user:user};
      try{
      sqlObj.runQuery(subQ,subObj);
      }
      catch(e){
      console.log('Unable to add entry to "events_users" table. Query: '+subQ+', binds: '+JSON.stringify(subObj));
      console.log(e);
      return null;
      }
    });
  }
return true;
}

/*-----------------------------------------------
pre: sqlObj
post: update the new event
update the event status
WARNING: This function DOES NOT CHECK THAT THE STATUS EXISTS IN STATUS TABLE
-----------------------------------------------*/
function updateEventStatus(evnt_uuid=null, stts=null){
  if(!evnt_uuid||!stts){
  return null;
  }

let query='update events set status_id=(select uuid from status where name=$stts)';
let obj={$uuid:evnt_uuid, $stts:stts};

  if(stts=="done"){
  query+=', done_date=datetime($nowDate)';
  obj['$nowDate']=toInptValFrmt(); 
  }
query+=' where uuid=$uuid';

sqlObj.runQuery(query,obj);

delInvntSrvBuff(null, evnt_uuid, null, null);

let invntSrvs=selectEventInvntSrv(evnt_uuid);
  invntSrvs.forEach((invnt)=>{
    if(stts=="active"){
    createInvntSrvBuff(evnt_uuid, null, invnt, null, 1);
    }
  });
}
 

/*-----------------------------------------------
pre: sqlObj
post: update the new event
update the event
-----------------------------------------------*/
function updateEvent(evnt_uuid=null, forUser, byUser, onDt, doneDt, dur=30, type=null, stts=null, invntSrvs=[], users=[]){
  if(!evnt_uuid){
  return null;
  }

let nullStts=stts?'$stts':'(select uuid from status where name=$stts)';
let query='update events set uuid=$uuid, forUser_id=$forUser_id, byUser_id=$byUser_id, status_id='+nullStts+', on_date=datetime($on_date), done_date=datetime($done_date), duration=$dur where uuid=$uuid';

let obj={$uuid:evnt_uuid, $forUser_id:forUser, $byUser_id:byUser, $now_date:toInptValFrmt(), $on_date:onDt, $done_date:doneDt, $dur:dur, $stts:stts||'active'};
  sqlObj.runQuery(query,obj);

  //update type for event
  if(type){
    query='update events_type set type_uuid=(select uuid from type where categ="events" and name=$type) where event_uuid=$event_uuid';
    obj={$event_uuid:evnt_uuid,$type:type};
    sqlObj.runQuery(query,obj);
  }
  let delQ='';
  let delQObj='';
  let subQ='';
  let subObj='';
  //set what services or products are involved in this event
  if(invntSrvs&&typeof invntSrvs=="object"&&invntSrvs.length>0){
  //delete existing services
  delQ='delete from events_invntSrv where events_id=$eventId';
  delQObj={$eventId:evnt_uuid};
  sqlObj.runQuery(delQ, delQObj);

  delInvntSrvBuff(null, evnt_uuid, null, null);

  let sttsHsh=arrOfHshToHshHsh('uuid',selectStatus());
    invntSrvs.forEach((invnt)=>{
    subQ='';
    subObj='';
    subQ='insert into events_invntSrv(uuid, create_date, events_id, invntSrv_id) values($uuid, datetime("now"), $evntId, $invntId)';
    subObj={$uuid:createUUID(), $evntId:evnt_uuid, $invntId:invnt};
    sqlObj.runQuery(subQ,subObj);

      if(sttsHsh.hasOwnProperty(stts)){
        if(sttsHsh[stts].name=="active"){
        createInvntSrvBuff(evnt_uuid, null, invnt, null, 1);
        }
      }
    });
  }

  //update users for event
  if(users&&typeof users=="object"&&users.length>0){
  delQ='delete from events_users where events_id=$eventId';
  delQObj={$eventId:evnt_uuid};
  sqlObj.runQuery(delQ, delQObj);

    users.forEach((user)=>{
    subQ='insert into events_users(uuid, events_id, users_id) values($uuid, $evntId, $user)';
    subObj={$uuid:createUUID(), $evntId:evnt_uuid, $user:user};
    sqlObj.runQuery(subQ,subObj);
    });
  }
return true;
}


/*-----------------------------------------------
pre: sqlObj
post: none
get event
-----------------------------------------------*/
function selectViewEventUser(paramObj, ord, desc=false, limit=null, offset=null){
let query=`select
e.uuid as event_id,
cust.uuid as cust_uuid,
cust.username as cust_username,
cust.status_id as cust_status_id,
custStatus.name as cust_status_name,
cust.email as cust_email,
cntcts.phone as cust_phone,
cntcts.cellphone as cust_cellphone,
cntcts.fName as cust_fName,
cntcts.surName as cust_surName,
cntcts.nickName as cust_nickName,
byUser.uuid as byUser_uuid,
byUser.username as byUser_username,
byUser.status_id as byUser_status_id,
byUserStatus.name as byUserStatus_status_name,
byUser.email as byUser_email,
s.uuid as status_uuid,
s.name as status,
e.create_date as create_date,
e.on_date as on_date,
e.done_date as done_date,
e.duration as duration
from events as e
left join status as s on e.status_id=s.uuid
left join users as cust on e.forUser_id=cust.uuid
left join users as byUser on e.byUser_id=byUser.uuid
left join status as custStatus on cust.status_id=custStatus.uuid
left join status as byUserStatus on byUser.status_id=byUserStatus.uuid
left join contacts as cntcts on cntcts.user_id=cust.uuid
`;
let and='';
let tmp=null;
let obj=[];

  if(paramObj){
  query+='where';
    for(let param of Object.keys(paramObj)){
      if(paramObj[param]){
      query+=`${and} ${param}=?`;
      obj.push(paramObj[param]);
      and=' and';
      }
    }
  }

  switch(ord){
  case 'on_date':
  query+=' order by on_date';
  query+=desc?' desc':' asc';
  break;
  case 'create_date':
  query+=' order by create_date';
  query+=desc?' desc':' asc';
  break;
  case 'status':
  query+=' order by status';
  query+=desc?' desc':' asc';
  break;
  case 'done_date':
  query+=' order by done_date';
  query+=desc?' desc':' asc';
  break;
  case 'duration':
  query+=' order by duration';
  query+=desc?' desc':' asc';
  break;
  case 'cust_status_name':
  query+=' order by cust_status_name';
  query+=desc?' desc':' asc';
  break;
  case 'username':
  query+=' order by username';
  query+=desc?' desc':' asc';
  break;
  default:
  break;
  }


  if(!isNaN(parseInt(limit))){
  query+=' limit ?';
  obj.push(limit);
  }

  if(!isNaN(parseInt(offset))){
  query+=' offset ?';
  obj.push(offset);
  }
tmp=sqlObj.runQuery(query,obj);
return tmp;
}

/*-----------------------------------------------
pre: sqlObj, events_users
post: none 
get users for event 
CREATE TABLE events_users(uuid text not null primary key, events_id text not null, users_id text not null, foreign key(events_id) references events(uuid), foreign key(users_id) references users(uuid));
-----------------------------------------------*/
function selectEventUsers(uuid){
  if(!uuid){
  return [];
  }
let query='select uuid, events_id, users_id from events_users where events_id=$val';
let obj={$val:uuid};
let tmp=sqlObj.runQuery(query,obj);
return tmp;
}

/*-----------------------------------------------
pre: sqlObj, events_invntSrv
post: none 
get invntSrv for event 
CREATE TABLE events_invntSrv(uuid text not null, create_date int not null, events_id text not null, invntSrv_id text not null, foreign key(events_id) references events(uuid), foreign key(invntSrv_id) references invntSrv(uuid));
-----------------------------------------------*/
function selectEventInvntSrv(uuid){
  if(!uuid){
  return [];
  } 
let query='select uuid, create_date, events_id, invntSrv_id from events_invntSrv where events_id=$val';
let obj={$val:uuid};
let tmp=sqlObj.runQuery(query,obj);
return tmp;
}

/*-----------------------------------------------
pre: sqlObj
post: none 
get invntSrv for event via userId, from Date and to Date 
-----------------------------------------------*/
function selectEventDateRngUser(userId, dtFro, dtTo, stts='active', sttsId=null){
  if(!userId||!dtFro||!dtTo){
  return [];
  }

let query=`
select
e.uuid as event_id,
cust.uuid as cust_uuid,
cust.username as cust_username,
cust.status_id as cust_status_id,
custStatus.name as cust_status_name,
cust.email as cust_email,
cntcts.phone as cust_phone,
cntcts.cellphone as cust_cellphone,
cntcts.fName as cust_fName,
cntcts.surName as cust_surName,
cntcts.nickName as cust_nickName,
byUser.uuid as byUser_uuid,
byUser.username as byUser_username,
byUser.status_id as byUser_status_id,
byUserStatus.name as byUserStatus_status_name,
byUser.email as byUser_email,
s.uuid as status_uuid,
s.name as status,
e.create_date as create_date,
e.on_date as on_date,
e.done_date as done_date,
e.duration as duration
from events as e
left join status as s on e.status_id=s.uuid
left join users as cust on e.forUser_id=cust.uuid
left join users as byUser on e.byUser_id=byUser.uuid
left join status as custStatus on cust.status_id=custStatus.uuid
left join status as byUserStatus on byUser.status_id=byUserStatus.uuid
left join contacts as cntcts on cntcts.user_id=cust.uuid
where byUser_uuid=?
`;

/*

sqlite> select e.uuid, e.forUser_id, GROUP_CONCAT(i.name,';') from events as e left join events_invntSrv as ei on e.uuid=ei.events_id left join invntSrv as i on i.uuid=ei.invntSrv_id group by e.uuid;
169ea253-fe59-4169-b1e4-7041e1ce8744|d9ece037-c868-4197-be79-2d75d7ab6b85|hair wash
2cd98333-7874-442d-b613-2f7283932491|d9ece037-c868-4197-be79-2d75d7ab6b85|hair wash
49a8edc1-2721-414a-b5c9-6e34cc9aaf61|d9ece037-c868-4197-be79-2d75d7ab6b85|hair wash;hair wash
5c6c7058-b891-4ec0-bfa1-56903247f153|d9ece037-c868-4197-be79-2d75d7ab6b85|hair wash;hair wash;hair wash
61a7285e-2d37-4f9b-bd31-e56024c21e0d|4ceb051a-7113-4b8b-97c6-e66ec9c77f68|hair wash;conditioner;shampoo;shampoo
82280c5e-1c1c-45d9-a196-ff8900166754|d9ece037-c868-4197-be79-2d75d7ab6b85|shampoo;shampoo
8cb74bc3-e6be-4fd7-90b7-45d01da20466|d9ece037-c868-4197-be79-2d75d7ab6b85|hair wash
9dbe1d8a-3de7-4439-bc95-57198f94a95d|d9ece037-c868-4197-be79-2d75d7ab6b85|hair wash;conditioner;conditioner;conditioner;shampoo;shampoo
b0aa2158-0433-4a23-9738-96eaa329e1e8|d9ece037-c868-4197-be79-2d75d7ab6b85|hair wash
b2511661-871d-4377-bc14-3cbbf50dfb8c|d9ece037-c868-4197-be79-2d75d7ab6b85|shampoo;shampoo;shampoo
e76ee0dd-17ef-4fdc-a59e-8b3b8680773c|d9ece037-c868-4197-be79-2d75d7ab6b85|hair wash;hair wash;hair wash
ee8dde78-040c-4b79-8c0d-b756d5461dc8|d9ece037-c868-4197-be79-2d75d7ab6b85|
*/

let obj=[userId];

query+=` and e.on_date>=?`;
obj.push(dtFro);

query+=` and e.on_date<?`;
obj.push(dtTo);

  if(sttsId){
  query+=` and s.uuid=?`;
  obj.push(sttsId);
  }
  else if(stts&&stts!=''){
  query+=` and s.name=?`;
  obj.push(stts);
  }

query+=` order by e.on_date asc`;

let tmp=null;

  try{
  tmp=sqlObj.runQuery(query,obj);
  }
  catch(e){
  console.log(`Unable to get appointments in selectEventDateRngUser(), userId: ${userId}, dtFro: ${dtFro}, dtTo: ${dtTo}`);
  console.log(e);
  }
return tmp;
}


function delEvent(uuid){
console.log("<<+++++++++++++=============== delEvent() "+uuid);
}

