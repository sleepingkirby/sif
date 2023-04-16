class menuLft {

  constructor(){
  }

  /*----------------------------
  pre:
  post:
  ----------------------------*/
  genMenu(str=null){
  var val=state.pos||'menu';
  var menuLst=[];
  var modsLst=Object.keys(mod);
    for(const modNm of modsLst){
      if(mod[modNm].hasOwnProperty('menu')&&mod[modNm].menu.hasOwnProperty('enabled')&&mod[modNm].menu.enabled){
      menuLst[mod[modNm].menu.ord]={'icon':mod[modNm].menu.icon,'name':modNm}
      }
    }
  var menu=``;
    console.log(menuLst);
    for(const menuItm of menuLst){
      if(menuItm){
      menu+=`<div class="menuLftItm" onclick=mainObj.setState("pos","`+menuItm.name+`")>`+menuItm.name+`</div>
`;
      }
    }
  return menu; 
  }

}


var menuLftObj=new menuLft();
document.getElementById('menuDropDown').innerHTML=menuLftObj.genMenu();
