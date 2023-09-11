/*-----------------------------------------------
pre: sqlObj
post: none
common library for getting setting the events/invntSrv
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
function createEvent(forUser, byUser, onDt, dur=30, type="service", invntSrvs, users=null){
let evnt_uuid=createUUID();
  let query='insert into events(uuid, forUser_id, byUser_id, create_date, on_date, duration) values($uuid, $forUser_id, $byUser_id, datetime("now"), datetime($on_date), $dur)';
  try{
  sqlObj.runQuery(query, {$uuid:evnt_uuid, $forUser_id:forUser, $byUser_id:byUser, $on_date:onDt, $dur:dur});
  }
  catch(e){
  console.log('Unable to add entry to "events" table. query: '+query+', binds: '+JSON.stringify({$uuid:evnt_uuid, $forUser_id:forUser, $byUser_id:byUser, $on_date:onDt, $dur:dur}));
  console.log(e);
  return null;
  }

/*
CREATE TABLE events_type(uuid text not null primary key, event_uuid text not null, type_uuid text not null, foreign key(event_uuid) references events(uuid), foreign key(type_uuid) references type(uuid));
*/
  //need to set type for event

/*
CREATE TABLE events_invntSrv(uuid text not null, create_date int not null, events_id text not null, invntSrv_id text not null, foreign key(events_id) references events(uuid), foreign key(invntSrv_id) references invntSrv(uuid));
*/
  //set what services or products are involved in this event
  
}


