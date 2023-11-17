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
        <div class="row" style="justify-content: flex-start; margin-bottom: 18px;"><div class="lbl">User</div></div>
        <div class="row" style="margin-bottom: 26px;">
          <input name="contact[uuid]" type="hidden" />
          <textarea name="contact[surName]" type="text" placeholder="Last Name"></textarea>
          <textarea name="contact[mName]" type="text" style="width:60px;" placeholder="M."></textarea>
          <textarea name="contact[fName]" type="text" style="flex-grow: 100;" placeholder="First Name"></textarea>
        </div>
        <div class="row" style="margin-bottom: 22px;"><textarea name="contact[email]" type="text" placeholder="email address"></textarea></div>
        <div class="row"><textarea name="contact[addr]" type="text" style="flex-grow: 100;" placeholder="ex. 123 main st."></textarea></div>
        <div class="row"><textarea name="contact[addr2]" type="text" style="flex-grow: 100;" placeholder="suite 123"></textarea></div>
        <div class="row"><textarea name="contact[city]" type="text" style="flex-grow: 100;" placeholder="city"></textarea><textarea name="contact[prov]" type="text" style="width: 60px;" placeholder="ST."></textarea><textarea name="contact[zip]" type="text" placeholder="zip code"></textarea></div>
        <div class="row" style="margin-bottom: 26px;"><textarea name="contact[country]" type="text" style="flex-grow: 100;" placeholder="country"></textarea></div>
        <div class="row"><textarea name="contact[phone]" type="text" placeholder="primary phone"></textarea></div>
        <div class="row" style="margin-bottom: 40px;"><textarea name="contact[cellphone]" type="text" placeholder="cell phone"></textarea></div>
        <div class="row" style="justify-content: flex-end; align-items: center;">
          <input id="contactsUserFormUpdtBtn" style="display:none;" type="submit" value="Update User" title="Update user info"/>
          <input id="contactsUserFormAddBtn" type="submit" value="Add User" title="Create new user"/>
        </div>
      </div>
      `;
      this.mainElHtml=[];
      this.mainElHtml[0]=`
      <div id="contactsAdd">
        <div id="contactsAddBtn">⨁</div>
      </div>
      <div id="contactFltr" class="fltrRow" style="justify-content: space-between;">
        <div id="contactsFltrInptWrap" class="fltrRowCell">
          <input id="contactsFltrInpt" name="contactsFilter[input]" class="fltrInpt" type="text" placeholder="User filter. Ex. Smith" title="User Filter. Filters on lastname, firstname, email and/or phones"/>
        </div>
        <div id="contactDelCnfrmWrap">
          <input id="contactDelCnfrm" name="contact" type="checkbox" />
        </div>
      </div>

      <div id="contactsMain">
      </div>
      `;
      this.mainElHtml[1]=`
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
          <th>action</th>
          </tr>
      `;
      this.mainElHtml[2]=`
       </table>
      `;
    this.tmpl={};
    this.tmpl.cntctsTblStrt=`
        <table id="contactsList">
          <tr>
    `;
    this.tmpl.cntctsTblHdCll=[];
    this.tmpl.cntctsTblHdCll[0]=`
          <th>
    `;
    this.tmpl.cntctsTblHdCll[1]=`
          </th>
    `;
    //<div class="tblHdSrt ##pntClass##" tabindex=0 name="##hdrNm##" onclick="apptObj.setColSrtHookFunc(event)">
    this.tmpl.cntctsTblHdCllIcn=`
            <div class="tblHdSrt ##pntClass##" tabindex=0 name="##hdrNm##" onclick="cntctsObj.setColSrtHookFunc(this)">
              <div>##hdrTtl##</div>
              <div class="tblHdSrtArrw" title="sort via ##hdlTtl">##icon##</div>
            </div>
    `;
    this.tmpl.cntctsTblHdEnd=`
          </tr>
    `;
    this.tmpl.cntctsTblEnd=`
        </table>
    `;

      this.tmpl.cntctsTblHdArr=[
      {'name':'status','title':'status', 'sort':true},
      {'name':'fName','title':'first name', 'sort':true},
      {'name':'surName','title':'surname', 'sort':true},
      {'name':'mName','title':'midName', 'sort':true},
      {'name':'email','title':'email', 'sort':true},
      {'name':'phone','title':'phone', 'sort':true},
      {'name':'cellphone','title':'cell', 'sort':true},
      {'name':'addr','title':'address', 'sort':false},
      {'name':'actions','title':'actions', 'sort':false}
      ];
    this.fltrStr='';
    this.fltrProps=['fName','surName','email','cEmail','phone','cellphone','username'];
    this.sortCol='fName';
    this.sortColDir='desc';
    this.customers=null;
    this.custHsh=null;
    this.updtCntctBtnId='contactsUserFormUpdtBtn';
    this.addCntctBtnId='contactsUserFormAddBtn';
    this.delCntctCnfrm=false;
    }

    /*-----------------------------------------
    pre: elements with id this.updtCntctBtnId and this.addCntctBtnId
    post: elements hidden and not are changed
    flips which button is displayed
    -----------------------------------------*/
    addUpdtBtnFlip(updt=false){
    let updtEl=document.getElementById(this.updtCntctBtnId);
    let addEl=document.getElementById(this.addCntctBtnId);
      if(updtEl&&addEl){
        updtEl.style.display=updt?"flex":"none";
        addEl.style.display=updt?"none":"flex";
      }
    }

    /*-----------------------------------------
    pre: right modal exists
    post: right modal cleared
    clear right modal
    -----------------------------------------*/
    clearRghtMod(){
    let els=document.getElementById("contactsUserForm").querySelectorAll("textarea[name^=contact]");
    let el_uuid=document.getElementById("contactsUserForm").querySelectorAll("input[name^=contact]");
      if(el_uuid&&el_uuid[0]){
      el_uuid[0].value="";
      }
      for(let el of els){
      el.value="";
      }
    }

    /*-----------------------------------------
    pre: right modal exists
    post: right modal filled
    fill right modal with user info
    -----------------------------------------*/
    fillRghtMod(cust){
    let els=document.getElementById("contactsUserForm").querySelectorAll("textarea[name^=contact]");
    let el_uuid=document.getElementById("contactsUserForm").querySelectorAll("input[name^=contact]");
      if(el_uuid&&el_uuid[0]){
      el_uuid[0].value=cust.uuid;
      }
      for(let el of els){
      let nm=getSubs(el.name);
        if(cust.hasOwnProperty(nm)){
        el.value=cust[nm];
        }  
      }
    }

    /*-----------------------------------------
    pre:
    post:
    fills out and opens right modal for updating user
    -----------------------------------------*/
    updtCntctsRghtMod(uuid=null){
      if(!uuid){
      return null;
      }
      if(this.custHsh.hasOwnProperty(uuid)&&this.custHsh[uuid]){
      this.fillRghtMod(this.custHsh[uuid]);
      this.addUpdtBtnFlip(true);
      let el=document.getElementById('rghtMod').getElementsByClassName("close")[0];
      mainObj.modPrcClsCall(el);
      }
    } 


    /*----------------------------------
    pre: everything this class requires
    post: events added to elements.
    adds event hooks to elements that need it
    ----------------------------------*/
    hookElFltr(){
      document.getElementById("contactsFltrInpt").onkeyup=(e)=>{
      this.fltrStr=e.target.value;
      this.draw();
      }
    }

    /*----------------------------------
    pre: everything this class requires
    post: events added to elements.
    adds event hooks to elements that need it
    ----------------------------------*/
    hookEl(){
      document.getElementById("contactsAddBtn").onclick=(e)=>{
      this.addUpdtBtnFlip(false);
      this.clearRghtMod();
      let el=document.getElementById('rghtMod').getElementsByClassName("close")[0];
      mainObj.modPrcClsCall(el);
      };

    this.hookElFltr();   

 
      document.getElementById(this.addCntctBtnId).onclick=(e)=>{
      let els=document.getElementById("contactsUserForm").querySelectorAll("textarea[name^=contact]");
      let hsh={};
        els.forEach((nd, i)=>{
        let nm=getSubs(nd.name);
        hsh[nm]=nd.value;
        });

      createCustUser(hsh);

      mainObj.setFloatMsg(`New User Added`);

      //closes modal
      // let el=document.getElementById('rghtMod').getElementsByClassName("close")[0];
      // mainObj.modPrcClsCall(el);

      //redraw mainEl
      this.draw();
      };


      document.getElementById(this.updtCntctBtnId).onclick=(e)=>{
      let el_uuid=document.getElementById("contactsUserForm").querySelectorAll("input[name^=contact]");
      let els=document.getElementById("contactsUserForm").querySelectorAll("textarea[name^=contact]");
      let hsh={};
        for(const nd of els){
        let nm=getSubs(nd.name);
        hsh[nm]=nd.value;
        };
        if(el_uuid&&el_uuid[0]&&el_uuid[0].value){
        updateCustUser(el_uuid[0].value,hsh);
        mainObj.setFloatMsg(`User updated`);
        this.draw();
        let el=document.getElementById('rghtMod').getElementsByClassName("close")[0];
        mainObj.modPrcClsCall(el);
        }
      }
    } 


    /*----------------------------------
    pre: this.rghtModForm 
    post: none
    generates right modal content
    ----------------------------------*/
    rghtMod(){
    let html=this.rghtModForm;
    return html; 
    }


    /*---------------------------------
    pre: sqlObj
    post: none
    params: user uuid
    deletes the user
    ---------------------------------*/
    delUser(uuid){
      if(!uuid){
      return null;
      }
      try{
        if(this.delCntctCnfrm){
        delCustUser(uuid);
        }
        else{
        mainObj.setFloatMsg(`Deletion is permanent. Check "Delete User Confirmation" to proceed`);
        }
      }
      catch(e){
      console.log(e);
      }
      this.draw();
    }

    /*---------------------------------
    pre: sqlObj
    post: none
    params: user uuid
    disables user
    ---------------------------------*/
    userOff(uuid){
      if(!uuid){
      return null;
      }
      try{
      sqlObj.runQuery(`update users set status_id=(select uuid from status where name="disabled") where uuid=$uuid`,{$uuid:uuid});
      }
      catch(e){
      console.log(e);
      }
    }

    /*---------------------------------
    pre: sqlObj
    post: none
    params: user uuid
    enables user
    ---------------------------------*/
    userOn(uuid){
      if(!uuid){
      return null;
      }
      try{
      sqlObj.runQuery(`update users set status_id=(select uuid from status where name="active") where uuid=$uuid`,{$uuid:uuid});
      }
      catch(e){
      console.log(e);
      }
    }

    /*----------------------------------
    pre: this.sortColDir, this.sortCol, this.fltrStr, this.appts, this.customers
    post:none.
    takes this.appts and sort and/or filter appointments by this.sortColDir, this.sortCol and this.fltrStr
    ----------------------------------*/
    fltrUsers(users){
    let rtrn=[];
      if(this.fltrStr){
        for(let user of users){
          if(user.status==this.fltrStts){
          rtrn.push({...user});
          break;
          }
          for(let prop of this.fltrProps){
            if(user[prop]&&user[prop].toLocaleLowerCase().search(this.fltrStr.toLocaleLowerCase())>=0){
            rtrn.push({...user});
            break;
            }
          }
        }
      }
      else{
      rtrn=[...users];
      }
    return rtrn;
    } 

    /*----------------------------------
    pre:this.sortCol,this.sortColDir
    post:figure out sorting and sets variables
    function to set proper variables
    ----------------------------------*/
    setColSrt(srt){
      if(this.sortCol!=srt){
      this.sortCol=srt;
      this.sortColDir="desc";
      return null;
      }

      this.sortColDir=this.sortColDir=="desc"?"asc":"desc";
    }

    /*----------------------------------
    pre:this.setColSrt()
    post:none
    function to set to hook for table header sort
    ----------------------------------*/
    setColSrtHookFunc(e){
    let nm=e.getAttribute("name");
      if(nm){
      this.setColSrt(nm);
      }
    this.draw();
    }

    /*---------------------------------
    pre: none
    post: redraw html
    draw the contact table
    ----------------------------------*/
    drawTbl(){
    let html='';
    let pObj={};
      if(state.dbObj&&state.dbObj!=null){
      let {customer:hsh, '':users}=spltUsr(getUsers(null,this.sortCol,this.sortColDir=='desc'));
      this.customers=[...hsh];
      this.custHsh=arrOfHshToHshHsh('uuid',hsh);
      let custFltrd=this.fltrUsers(hsh);
        for(let rcrd of custFltrd){
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
        <td>
          <div class="contactsCellActns">
          <div name="contactEditUser" class="menuIcon" onclick=cntctsObj.updtCntctsRghtMod("`+rcrd.uuid+`"); title="Edit User">`+getEvalIcon(iconSets, state.user.config.iconSet, 'edit')+`</div>
          <div name="contactEditUser" class="menuIcon" onclick=cntctsObj.delUser("`+rcrd.uuid+`"); title="Delete User">`+getEvalIcon(iconSets, state.user.config.iconSet, 'delete')+`</div>
          </div>
        </td>
        </tr>
        `;
        };
      }
      let hdrs='';
        for(let hdr of this.tmpl.cntctsTblHdArr){
        //function sortTblHdrTmplng(tmpl, obj, sortDir, srtClss='tblHdSrtPnt')
        hdrs+=this.tmpl.cntctsTblHdCll[0]+sortTblHdrTmplng(this.tmpl.cntctsTblHdCllIcn,hdr,this.sortCol==hdr.name?this.sortColDir:null)+this.tmpl.cntctsTblHdCll[1];
        }
    return this.tmpl.cntctsTblStrt+hdrs+this.tmpl.cntctsTblHdEnd+html+this.tmpl.cntctsTblEnd;
    }


    /*----------------------------------
    pre: drawTbl(), element contactsmain
    post: draws the table to the html
    generates contacts table
    ----------------------------------*/
    draw(){
    document.getElementById('contactsMain').innerHTML=this.drawTbl();
    }

    /*----------------------------------
    pre: this class' properties
    post: none
    generates mainEl content
    ----------------------------------*/
    mainEl(){
    let html=this.mainElHtml[0];
    return html;
    }
   
    /*-------------------------------------
    pre: this class, mainEl(), rghtMod(), hookEl()
    post: html page changed
    runs the main function to initialize the page
    -------------------------------------*/ 
    run(){
    document.getElementById('mainEl').innerHTML=this.mainEl();
    this.draw();
    document.getElementById('rghtMod').getElementsByClassName("content")[0].innerHTML=this.rghtMod();
    document.getElementById('leftNavMod').innerHTML="Contacts";
    this.hookEl();
    }

  }

var cntctsObj=new contacts(mainObj, sqlObj);
state.depModuleObjs['contacts']=cntctsObj;
}
