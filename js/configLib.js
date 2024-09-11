/*-------------------------------------
pre: sqlObj.runQuery 
post: database updated
updates config 
-------------------------------------*/
function createConfig(hshStr=null, userId=null, typeId='(select uuid from type where name="global" and categ="config")'){
  if(!hshStr||hshStr==''||!userId||userId==''){
  return null;
  }

let arr=[];
arr.push(createUUID());
arr.push(userId);
arr.push(typeId);
arr.push(hshStr);

//CREATE TABLE config(uuid text primary key, users_id text not null, type_id text null, json text null, foreign key(users_id) references users(uuid), foreign key(type_id) references type(uuid));
let query=`insert into config values(?, ?, ?, ?);`;
return sqlObj.runQuery(query, arr);
}

/*-------------------------------------
pre: sqlObj.runQuery 
post: database updated
updates config 
-------------------------------------*/
function updtConfig(hshStr=null, id='global'){
  if(!hshStr||hshStr==''){
  return null;
  }

//CREATE TABLE config(uuid text primary key, users_id text not null, type_id text null, json text null, foreign key(users_id) references users(uuid), foreign key(type_id) references type(uuid));
let where='';
let arr=[hshStr];
  if(!id||id=='global'){
  where='type_id=(select uuid from type where name="global")';
  }
  else{
  where='users_id=?';
  arr.push(id);
  }

let query=`
update config set json=?
where ${where}
`;
return sqlObj.runQuery(query, arr);
}

/*-------------------------------------
pre: sqlObj.runQuery 
post: database updated
updates current user
updates only email and/or 
-------------------------------------*/
function updtCurUser(id=null, hsh=null){
  if(!id||id==null||!hsh||hsh==null){
  return null;
  }
/*
CREATE TABLE users(uuid text primary key, username text null, password text null, salt text null, pin text null, status_id text not null, email text null, create_dt integer not null, mod_dt integer not null, failLgn_dt integer null, lastLgn_dt integer null, role_id text, parent_user_id text, notes text, foreign key(status_id) references status(uuid), foreign key(role_id) references roles(uuid), foreign key(parent_user_id) references users(uuid));
typeId
email
*/
let arr=null;
let query=null;
  if(hsh.hasOwnProperty('email')){
  arr=[hsh.email,id];
  query=`
  update users set 
  email=?,
  mod_dt=datetime('now')
  where uuid=?
  `;
    try{
    sqlObj.runQuery(query,arr);
    }
    catch(err){
    console.log(err);
    return false;
    }
  }

  if(hsh.hasOwnProperty('typeId')){
  arr=[hsh.typeId,id];
  query=`
  update users_type set 
  type_uuid=?
  where user_uuid=?
  `;
    try{
    sqlObj.runQuery(query,arr);
    }
    catch(err){
    console.log(err);
    return false;
    }
  }
 

/*
CREATE TABLE contacts(uuid text primary key, user_id text not null, fName text, surName text not null, mName text, nickName text, title text, suffix text, addr text, addr2 text, city text, prov text, zip text, country text, phone text, cellphone text, email text, type text, notes text, foreign key(user_id) references users(uuid), foreign key(type) references type(uuid));
CREATE INDEX contacts_users_id on contacts(user_id);

*/ 
  query=`
  update contacts set 
  fName=?,
  surName=?,
  mName=?,
  phone=?,
  cellphone=?
  where user_id=?
  `;
    try{
    sqlObj.runQuery(query,[hsh.fName, hsh.surName, hsh.mName, hsh.phone, hsh.cellphone]);
    }
    catch(err){
    console.log(err);
    return false;
    }
 

 
return true;
}













