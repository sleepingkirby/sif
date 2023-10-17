/*-----------------------------------------------
pre: sqlObj
post: none
common library for getting status
-----------------------------------------------*/

/*-----------------------------------------------
pre: sqlObj, status table
post: none
get statuses
-----------------------------------------------*/
function selectStatus(){
//CREATE TABLE status(uuid text primary key, name text not null, notes text);
let query='select uuid, name from status;
return sqlObj.runQuery(query);
}

