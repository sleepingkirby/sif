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
function createEvent(forUser, byUser, onDt, dur=30, type=null, stts='active', invntSrvs=[], users=[]){
let evnt_uuid=createUUID();
let query='insert into events(uuid, forUser_id, byUser_id, status_id, create_date, on_date, duration) values($uuid, $forUser_id, $byUser_id, (select uuid from status where name=$stts), datetime($now_date), datetime($on_date), $dur)';
let obj={$uuid:evnt_uuid, $forUser_id:forUser, $byUser_id:byUser, $now_date:toInptValFrmt(), $on_date:onDt, $dur:dur, $stts:stts};
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
    obj={$uuid:evntTyp_uuid, $event_uuid:evnt_uuid};
    sqlObj.runQuery(query,obj);

    /*
      try{
      sqlObj.runQuery(query,obj);
      }
      catch(e){
      console.log('Unable to add entry to "events_type" table. query: '+query+', binds: '+JSON.stringify(obj));
      console.log(e);
      return null;
      }
    */  
  }

/*
CREATE TABLE events_invntSrv(uuid text not null, create_date int not null, events_id text not null, invntSrv_id text not null, foreign key(events_id) references events(uuid), foreign key(invntSrv_id) references invntSrv(uuid));
*/
  //set what services or products are involved in this event
  if(invntSrvs&&typeof invntSrvs=="object"&&invntSrvs.length>0){
    invntSrvs.forEach((invnt)=>{
    let subQ='';
    let subObj='';
    subQ='insert into events_invntSrv(uuid, create_date, events_id, invntSrv_id) values($uuid, datetime("now"), $evntId, $invntId)';
    subObj={$uuid:createUUID(), $evntId:evnt_uuid, $invntId:invnt};
    sqlObj.runQuery(subQ,subObj);
      /*
      try{
      subQ='insert into events_invntSrv(uuid, create_date, events_id, invntSrv_id) values($uuid, datetime("now"), $evntId, $invntId)';
      subObj={$uuid:createUUID(), $evntId:evnt_uuid, $invntId:invnt};
      sqlObj.runQuery(subQ,subObj);
      }
      catch(e){
      console.log('Unable to add entry to "events_invntSrv" table. Query: '+subQ+', binds: '+JSON.stringify(subObj));
      console.log(e);
      return null;
      }
      */
    });
  }

/*
CREATE TABLE events_users(uuid text not null primary key, events_id text not null, users_id text not null, foreign key(events_id) references events(uuid), foreign key(users_id) references users(uuid));
*/
  if(users&&typeof users=="object"&&users.length>0){
    users.forEach((user)=>{
    subQ='insert into events_users(uuid, events_id, users_id) values($uuid, $evntId, $user)';
    subObj={$uuid:createUUID(), $evntId:evnt_uuid, $user:user};
    sqlObj.runQuery(subQ,subObj);
      /*
      try{
      subQ='insert into events_users(uuid, events_id, users_id) values($uuid, $evntId, $user)';
      subObj={$uuid:createUUID(), $evntId:evnt_uuid, $user:user};
      sqlObj.runQuery(subQ,subObj);
      }
      catch(e){
      console.log('Unable to add entry to "events_users" table. Query: '+subQ+', binds: '+JSON.stringify(subObj));
      console.log(e);
      return null;
      }
      */
    });
  }
}

/*-----------------------------------------------
pre: sqlObj, view_events_user
post: none
get event_user
-----------------------------------------------*/
function selectViewEventUser(param, val, ord, asc=false, status=null){
let query='select event_id, cust_uuid, cust_username, cust_status_id, cust_status_name, cust_email, cust_phone, cust_cellphone, byUser_uuid, byUser_username, byUser_status_id, byUserStatus_status_name, byUser_email, status, create_date, done_date, on_date, duration from view_events_user';
let and=' and ';
let obj={};
  if(param){
    switch(param){
    case 'byUser_uuid':
    query+=' where byUser_uuid=$val';
    obj['$val']=val;
    break;
    case 'byUser_username':
    query+=' where byUser_username=$val';
    obj['$val']=val;
    break;
    case 'cust_uuid':
    query+=' where cust_uuid=$val';
    obj['$val']=val;
    break;
    case 'cust_username':
    query+=' where cust_username=$val';
    obj['$val']=val;
    break;
    default:
    break;
    }
    if(status){
    query+=' and status=$status';
    obj['$status']=status;
    }

      switch(ord){
      case 'on_date':
      query+=' order by on_date';
      query+=asc?' asc':' desc';
      break;
      case 'create_date':
      query+=' order by create_date';
      query+=asc?' asc':' desc';
      break;
      default:
      break;
      }
  let tmp=sqlObj.runQuery(query,obj);
  return tmp;
  }
return null;
}


function delEvent(uuid){
console.log("<<+++++++++++++=============== delEvent() "+uuid);
}


function updateEvent(uuid, forUser, byUser, onDt, dur=30, type=null, stts='active', invntSrvs=[], users=[] ){


}
