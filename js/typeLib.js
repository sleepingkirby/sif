/*-----------------------------------------------
pre: sqlObj
post: none
common library for getting types
-----------------------------------------------*/

/*-----------------------------------------------
pre: array of types (from types table)
post: none
separates types record into an array
-----------------------------------------------*/
function sepTypesHsh(arr){
  if(typeof arr!="object"){
  return null;
  }
const obj={};
  for(let row of arr){
    if(row.hasOwnProperty('categ')&&row.hasOwnProperty('col')){
      if(!obj.hasOwnProperty(row.categ)){
      obj[row.categ]={};
      }
      if(!obj[row.categ].hasOwnProperty(row.col)){
      obj[row.categ][row.col]={};
      }
      obj[row.categ][row.col][row.name]=row.uuid;
    }
  }
return obj;
}

/*-----------------------------------------------
pre: array of types (from types table)
post: none
separates types record into an array
-----------------------------------------------*/
function sepTypesIdHsh(arr){
  if(typeof arr!="object"){
  return null;
  }
const obj={};
  for(const row of arr){
    if(row.hasOwnProperty('categ')&&row.hasOwnProperty('col')){
      if(!obj.hasOwnProperty(row.categ)){
      obj[row.categ]={};
      }
      if(!obj[row.categ].hasOwnProperty(row.col)){
      obj[row.categ][row.col]={};
      }
      obj[row.categ][row.col][row.uuid]=row.name;
    }
  }
return obj;
}


/*-----------------------------------------------
pre: sqlObj, type table
post: none
get type
-----------------------------------------------*/
function selectType(categ=null){
//CREATE TABLE type(uuid text primary key, name text null, categ text null, col text null, notes text null);
let query='select uuid, name, categ, col from type';
const where=' where';
let obj={};

  if(categ){
  query+=where+' categ=$categ';
  obj['$categ']=categ;
  }

return sqlObj.runQuery(query, obj);
}


/*-----------------------------------------------
pre: sqlObj, type table
post: none
get type
-----------------------------------------------*/
function addType(name=null, categ=null, col=null, note=null){
  if(!name||name==""){
  return null;
  }
//CREATE TABLE type(uuid text primary key, name text null, categ text null, col text null, notes text null);
let query='insert into type(uuid, name, categ, col, notes) values(?, ?, ?, ?, ?)';
let arr=[];
arr.push(createUUID());
arr.push(name||null);
arr.push(categ||null);
arr.push(col||null);
arr.push(note||null);

return sqlObj.runQuery(query, arr);
}


/*-----------------------------------------------
pre: sqlObj, type table
post: none
get type
-----------------------------------------------*/
function delType(uuid=null){
  if(!uuid||uuid==""){
  return null;
  }
//CREATE TABLE type(uuid text primary key, name text null, categ text null, col text null, notes text null);
let query='delete from type where uuid=?'

return sqlObj.runQuery(query, [uuid]);
}

