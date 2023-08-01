if(typeof contacts==='undefined'){
  /*-------------------------------------------
  pre: global mainObj, sqlObj, state variable
  post: html changed, db updated
  class to handle adding new users;
  -------------------------------------------*/
  class contacts{

    constructor(){
      this.rghtModForm=`
      <div id="contactsUserForm">
        <div class="row" style="justify-content: flex-start; margin-bottom: 18px;"><div class="lbl">Add new user</div></div>
        <div class="row" style="margin-bottom: 26px;"><textarea name="contact[surName]" type="text" placeholder="Last Name"></textarea> <textarea name="contact[mName]" type="text" style="width:60px;" placeholder="M."></textarea><textarea name="contact[fName]" type="text" style="flex-grow: 100;" placeholder="First Name"></textarea></div>
        <div class="row" style="margin-bottom: 22px;"><textarea name="contact[email]" type="text" placeholder="email address"></textarea></div>
        <div class="row"><textarea name="contact[addr]" type="text" style="flex-grow: 100;" placeholder="ex. 123 main st."></textarea></div>
        <div class="row"><textarea name="contact[addr2]" type="text" style="flex-grow: 100;" placeholder="suite 123"></textarea></div>
        <div class="row"><textarea name="contact[city]" type="text" style="flex-grow: 100;" placeholder="city"></textarea><textarea name="contact[prov]" type="text" style="width: 60px;" placeholder="ST."></textarea><textarea name="contact[zip]" type="text" placeholder="zip code"></textarea></div>
        <div class="row" style="margin-bottom: 26px;"><textarea name="contact[country]" type="text" style="flex-grow: 100;" placeholder="country"></textarea></div>
        <div class="row"><textarea name="contact[phone]" type="text" placeholder="home phone"></textarea></div>
        <div class="row" style="margin-bottom: 40px;"><textarea name="contact[cellphone]" type="text" placeholder="cell phone"></textarea></div>
        <div class="row" style="justify-content: flex-end; align-items: center;"><input id="contactsUserFormAddBtn" type="submit" value="Add User"></div>
      </div>
      `;
      this.mainElHtml=[];
      this.mainElHtml[0]=`
      <div id="contactsAdd">
        <div id="contactsAddBtn">⨁</div>
      </div>
      <div id="contactsMain">
        <table id="contactsList">
          <tr>
          <th>status</th>
          <th>first name</th>
          <th>surname</th>
          <th>m.</th>
          <th>email</th>
          <th>phone</th>
          <th>cell</th>
          <th>address</th>
          </tr>
      `;
      this.mainElHtml[1]=`
        </table>
      </div>
      `;
    }


    /*----------------------------------
    pre: everything this class requires
    post: events added to elements.
    adds event hooks to elements that need it
    ----------------------------------*/
    hookEl(){
      document.getElementById("contactsAddBtn").onclick=(e)=>{
      let el=document.getElementById('rghtMod').getElementsByClassName("close")[0];
      mainObj.modPrcClsCall(el);
      };

    
      document.getElementById("contactsUserFormAddBtn").onclick=(e)=>{
      var els=document.getElementById("contactsUserForm").querySelectorAll("textarea[name^=contact]");
      var hsh={};
        els.forEach((nd, i)=>{
        let nm=nd.name.replace(/(contact\[|\])/g, "");
        hsh[nm]=nd.value;
        });
      
      //inserts into users table
      let user_uuid=createUUID(); 
        try{
        sqlObj.runQuery('insert into users(uuid, status_id, email, create_dt, mod_dt) values($uuid, 0, $email ,date("now"), date("now"))', {$uuid:user_uuid, $email:hsh.email});
        }
        catch(e){
        console.log('Unable to add entry to "users" table. query: '+'insert into users(uuid, status_id, email, create_dt, mod_dt) values($uuid, 0, $email ,date("now"), date("now"))'+', binds: '+JSON.stringify({$uuid:createUUID(), $email:hsh.email}));
        console.log(e);
        return null;
        }

      //inserts into contacts
        try{
        sqlObj.runQuery('insert into contacts(uuid, user_id, fName, surName, mName, addr, addr2, city, prov, zip, country, phone, cellphone) values($uuid, $u_uuid, $fName, $surName, $mName, $addr, $addr2, $city, $prov, $zip, $country, $phone, $cellphone)', {$uuid:createUUID(), $u_uuid:user_uuid, $fName:hsh.fName, $surName:hsh.surName, $mName:hsh.mName, $addr:hsh.addr, $addr2:hsh.addr2, $city:hsh.city, $prov:hsh.prov, $zip:hsh.zip, $country:hsh.country, $phone:hsh.phone, $cellphone:hsh.cellphone});
        }
        catch(e){
        console.log('Unable to add entry to "contacts" table. query: '+'insert into contacts(uuid, user_id, fName, surName, mName, addr, addr2, city, prov, zip, country, phone, cellphone, email) values($uuid, $u_uuid, $fName, $surName, $mName, $addr, $addr2, $city, $prov, $zip, $country, $phone, $cellphone)'+', binds: '+JSON.stringify({$uuid:createUUID(), $u_uuid:user_uuid, $fName:hsh.fName, $surName:hsh.surName, $mName:hsh.mName, $addr:hsh.addr, $addr2:hsh.addr2, $city:hsh.city, $prov:hsh.prov, $zip:hsh.zip, $country:hsh.country, $phone:hsh.phone, $cellphone:hsh.cellphone}));
        console.log(e);
        return null;
        }

      //closes modal
      // let el=document.getElementById('rghtMod').getElementsByClassName("close")[0];
      // mainObj.modPrcClsCall(el);

      //redraw mainEl
      this.draw();
      };

    } 


    /*----------------------------------
    pre: this.rghtModForm 
    post: none
    generates right modal content
    ----------------------------------*/
    rghtMod(){
    var html=this.rghtModForm;
    return html; 
    }


    /*---------------------------------
    pre: sqlObj
    post: none
    return object of table query
    ---------------------------------*/
    getList(){
    return sqlObj.runQuery("select c.fName as fName, c.surName as surName, c.mName as mName, c.email as email, s.name as status, c.phone as phone, c.cellphone as cellphone, c.addr as addr, c.addr2 as addr2, c.city as city, c.prov as prov, c.zip as zip, c.country as country from users as u left join contacts as c on u.uuid=c.user_id left join status as s on u.status_id=s.uuid");
    }


    /*----------------------------------
    pre: this class' properties
    post: none
    generates mainEl content
    ----------------------------------*/
    mainEl(){
      var html=this.mainElHtml[0];
      //make rows
      if(state.dbObj&&state.dbObj!=null){
      let hsh=this.getList();
        hsh.forEach((rcrd, i)=>{
        let cpz=""; //city prov, zip
        if(rcrd.city!=""||rcrd.prov!=""||rcrd.zip!=""){
        cpz=rcrd.city+' '+rcrd.prov+', '+rcrd.zip+'<br>';
        }
          html+=`
          <tr>
          <td>`+rcrd.status+`</td>
          <td>`+rcrd.fName+`</td>
          <td>`+rcrd.surName+`</td>
          <td>`+rcrd.mName+`</td>
          <td>`+rcrd.email+`</td>
          <td>`+rcrd.phone+`</td>
          <td>`+rcrd.cellphone+`</td>
          <td>`+rcrd.addr+`<br>`+rcrd.addr2+`<br>`+cpz+rcrd.country+`</td>
          </tr>
          `;
        });

      }
      html+=this.mainElHtml[1];

    return html;
    }
   
    /*-------------------------------------
    pre: this class, mainEl(), rghtMod(), hookEl()
    post: html page changed
    runs the main function to initialize the page
    -------------------------------------*/ 
    run(){
    document.getElementById('mainEl').innerHTML=this.mainEl();
    document.getElementById('rghtMod').getElementsByClassName("content")[0].innerHTML=this.rghtMod();
    document.getElementById('leftNavMod').innerHTML="Contacts";
    this.hookEl();
    }

    /*-------------------------------------
    pre: this class, mainEl(), rghtMod(), hookEl()
    post: html page changed
    redraws the main page the mainEl
    -------------------------------------*/  
    draw(){
    document.getElementById('mainEl').innerHTML=this.mainEl();
    this.hookEl();//when elements are redrawn/generated, event listeners will need to be reattached. consider global listeners.
    }
  }

var cntctsObj=new contacts(mainObj, sqlObj);
state.depModuleObjs['contacts']=cntctsObj;
}
