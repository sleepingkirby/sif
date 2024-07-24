var iconSets={
  'default':{
  'appointments':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M691-80q-78.435 0-133.718-55.283Q502-190.565 502-269q0-78.435 55.282-133.717Q612.565-458 691-458q78.435 0 133.718 55.283Q880-347.435 880-269q0 78.435-55.282 133.717Q769.435-80 691-80Zm58.243-88L777-196l-75-75v-112h-39v126l86.243 89ZM180-120q-24.75 0-42.375-17.625T120-180v-600q0-26 17-43t43-17h202q7-35 34.5-57.5T480-920q36 0 63.5 22.5T578-840h202q26 0 43 17t17 43v308q-15-9-29.516-15.48Q795.968-493.96 780-499v-281h-60v90H240v-90h-60v600h280q5 15 12 29.5t17 30.5H180Zm300-660q17 0 28.5-11.5T520-820q0-17-11.5-28.5T480-860q-17 0-28.5 11.5T440-820q0 17 11.5 28.5T480-780Z"/></svg>',
  'calendar':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M180-80q-24 0-42-18t-18-42v-620q0-24 18-42t42-18h65v-60h65v60h340v-60h65v60h65q24 0 42 18t18 42v620q0 24-18 42t-42 18H180Zm0-60h600v-430H180v430Zm0-490h600v-130H180v130Zm0 0v-130 130Zm300 230q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg>',
  'today':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M352.817-310Q312-310 284-338.183q-28-28.183-28-69T284.183-476q28.183-28 69-28T422-475.817q28 28.183 28 69T421.817-338q-28.183 28-69 28ZM180-80q-24 0-42-18t-18-42v-620q0-24 18-42t42-18h65v-60h65v60h340v-60h65v60h65q24 0 42 18t18 42v620q0 24-18 42t-42 18H180Zm0-60h600v-430H180v430Zm0-490h600v-130H180v130Zm0 0v-130 130Z"/></svg>',
  'contacts':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M100-200q-24 0-42-18t-18-42v-440q0-24 18-42t42-18h440q24 0 42 18t18 42v440q0 24-18 42t-42 18H100Zm0-112q49-32 105.5-48T320-376q58 0 114.5 16T540-312v-388H100v388Zm220-4q-53 0-101 13.5T130-260h380q-43-29-92-42.5T320-316Zm0-113q-46 0-78.5-32.5T209-540q0-46 32.5-78.5T320-651q46 0 78.5 32.5T431-540q0 46-32.5 78.5T320-429Zm-.5-53q24.5 0 41.5-16.5t17-41q0-24.5-16.917-41.5-16.916-17-41.083-17-25 0-41.5 16.917Q262-564.167 262-540q0 25 16.5 41.5t41 16.5ZM700-200v-560h60v560h-60Zm160 0v-560h60v560h-60ZM320-540Zm0 280Z"/></svg>',
  'settings':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m388-80-20-126q-19-7-40-19t-37-25l-118 54-93-164 108-79q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521L80-600l93-164 118 54q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669-710l118-54 93 164-108 77q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l108 78-93 164-118-54q-16 13-36.5 25.5T592-206L572-80H388Zm92-270q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Zm0-60q-29 0-49.5-20.5T410-480q0-29 20.5-49.5T480-550q29 0 49.5 20.5T550-480q0 29-20.5 49.5T480-410Zm0-70Zm-44 340h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715-480q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112Z"/></svg>',
  'logout':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h291v60H180v600h291v60H180Zm486-185-43-43 102-102H375v-60h348L621-612l43-43 176 176-174 174Z"/></svg>',
  'addAppointment':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M700-80v-120H580v-60h120v-120h60v120h120v60H760v120h-60Zm-520-80q-24 0-42-18t-18-42v-540q0-24 18-42t42-18h65v-60h65v60h260v-60h65v60h65q24 0 42 18t18 42v302q-15-2-30-2t-30 2v-112H180v350h320q0 15 3 30t8 30H180Zm0-470h520v-130H180v130Zm0 0v-130 130Z"/></svg>',
  'edit':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M180-180h44l443-443-44-44-443 443v44Zm614-486L666-794l42-42q17-17 42-17t42 17l44 44q17 17 17 42t-17 42l-42 42Zm-42 42L248-120H120v-128l504-504 128 128Zm-107-21-22-22 44 44-22-22Z"/></svg>',
  'save':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160v212q-19-8-39.5-10.5t-40.5.5v-169L647-760H200v560h240v80H200Zm0-640v560-560ZM520-40v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-260L643-40H520Zm300-263-37-37 37 37ZM580-100h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19ZM240-560h360v-160H240v160Zm240 320h4l116-115v-5q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Z"/></svg>',
  'delete':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M261-120q-24.75 0-42.375-17.625T201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z"/></svg>',
  'broken':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm43-314 172-172 170 170 171-171 44 44v-217H180v303l43 43Zm-43 254h600v-298l-44-44-171 171-170-170-172 172-43-43v212Zm0 0v-298 60-362 600Z"/></svg>',
  'done':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>',
  'cancel':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m388-212-56-56 92-92-92-92 56-56 92 92 92-92 56 56-92 92 92 92-56 56-92-92-92 92ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/></svg>',
  'disable':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>',
  'search':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>',
  'sortUp':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m280-400 200-200 200 200H280Z"/></svg>',
  'sortDwn':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-360 280-560h400L480-360Z"/></svg>',
  'arrowUpCrcl':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-320h80v-168l64 64 56-56-160-160-160 160 56 56 64-64v168Zm40 240q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>',
  'arrowDwnCrcl':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m480-320 160-160-56-56-64 64v-168h-80v168l-64-64-56 56 160 160Zm0 240q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>',
  'checkBox':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q8 0 15 1.5t14 4.5l-74 74H200v560h560v-266l80-80v346q0 33-23.5 56.5T760-120H200Zm261-160L235-506l56-56 170 170 367-367 57 55-424 424Z"/></svg>',
  'download':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>',
  'publish':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-160v-326L336-382l-56-58 200-200 200 200-56 58-104-104v326h-80ZM160-600v-120q0-33 23.5-56.5T240-800h480q33 0 56.5 23.5T800-720v120h-80v-120H240v120h-80Z"/></svg>',
  'addBox':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>',
  'shelves':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M120-40v-880h80v80h560v-80h80v880h-80v-80H200v80h-80Zm80-480h80v-160h240v160h240v-240H200v240Zm0 320h240v-160h240v160h80v-240H200v240Zm160-320h80v-80h-80v80Zm160 320h80v-80h-80v80ZM360-520h80-80Zm160 320h80-80Z"/></svg>',
  'receipt':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M120-80v-800l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v800l-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60Zm120-200h480v-80H240v80Zm0-160h480v-80H240v80Zm0-160h480v-80H240v80Zm-40 404h560v-568H200v568Zm0-568v568-568Z"/></svg>',
  'addCircle':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>',
  'home':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>',
  'moreVert':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg>',
  'moreHorz':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"/></svg>',
  'camera':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z"/></svg>',
  'hand':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="M480-480v-400q0-17 11.5-28.5T520-920q17 0 28.5 11.5T560-880v400h-80Zm-160 0v-360q0-17 11.5-28.5T360-880q17 0 28.5 11.5T400-840v360h-80ZM500-40q-142 0-241-99t-99-241v-380q0-17 11.5-28.5T200-800q17 0 28.5 11.5T240-760v380q0 109 75.5 184.5T500-120q109 0 184.5-75.5T760-380v-140q-17 0-28.5 11.5T720-480v160H600q-33 0-56.5 23.5T520-240v40h-80v-40q0-66 47-113t113-47h40v-400q0-17 11.5-28.5T680-840q17 0 28.5 11.5T720-800v207q10-3 19.5-5t20.5-2h80v220q0 142-99 241T500-40Zm40-320Z"/></svg>',
  'lunch':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="M160-120q-33 0-56.5-23.5T80-200v-120h800v120q0 33-23.5 56.5T800-120H160Zm0-120v40h640v-40H160Zm320-180q-36 0-57 20t-77 20q-56 0-76-20t-56-20q-36 0-57 20t-77 20v-80q36 0 57-20t77-20q56 0 76 20t56 20q36 0 57-20t77-20q56 0 77 20t57 20q36 0 56-20t76-20q56 0 79 20t55 20v80q-56 0-75-20t-55-20q-36 0-58 20t-78 20q-56 0-77-20t-57-20ZM80-560v-40q0-115 108.5-177.5T480-840q183 0 291.5 62.5T880-600v40H80Zm400-200q-124 0-207.5 31T166-640h628q-23-58-106.5-89T480-760Zm0 520Zm0-400Z"/></svg>',
  'debug':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-200q66 0 113-47t47-113v-160q0-66-47-113t-113-47q-66 0-113 47t-47 113v160q0 66 47 113t113 47Zm-80-120h160v-80H400v80Zm0-160h160v-80H400v80Zm80 40Zm0 320q-65 0-120.5-32T272-240H160v-80h84q-3-20-3.5-40t-.5-40h-80v-80h80q0-20 .5-40t3.5-40h-84v-80h112q14-23 31.5-43t40.5-35l-64-66 56-56 86 86q28-9 57-9t57 9l88-86 56 56-66 66q23 15 41.5 34.5T688-640h112v80h-84q3 20 3.5 40t.5 40h80v80h-80q0 20-.5 40t-3.5 40h84v80H688q-32 56-87.5 88T480-120Z"/></svg>'
  },
  'joke':{
  'appointments':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M140-160q-24 0-42-18t-18-42v-132h60v132h132v60H140Zm217-155 46-235-100 47v134h-60v-175l164-69q32-14 45.5-17.5t27.1-3.5q20.4 0 35.9 8.5T542-600l42 67 4.667 6.667Q591-523 593-520q-51 33-82 86.5T478-315H357Zm183.08-359q-30.08 0-51.58-21.42-21.5-21.421-21.5-51.5 0-30.08 21.42-51.58 21.421-21.5 51.5-21.5 30.08 0 51.58 21.42 21.5 21.421 21.5 51.5 0 30.08-21.42 51.58-21.421 21.5-51.5 21.5ZM80-768v-132q0-24 18-42t42-18h132v60H140v132H80Zm740 0v-132H688v-60h132q24 0 42 18t18 42v132h-60Zm-90.5 650Q650-118 594-173.867 538-229.735 538-309q0-80 55.867-135.5Q649.735-500 729-500q80 0 135.5 55.5t55.5 135q0 79.5-55.5 135.5t-135 56ZM714-279h35v-143h-35v143Zm17.5 85q9.5 0 16-6t6.5-16q0-10-6.6-16t-15.4-6q-10 0-16 6t-6 16q0 10 6 16t15.5 6Z"/></svg>',
  'calendar':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M169.859-485Q132-485 106-511.141t-26-64Q80-613 106.141-639t64-26Q208-665 234-638.859t26 64Q260-537 233.859-511t-64 26Zm185-170Q317-655 291-681.141t-26-64Q265-783 291.141-809t64-26Q393-835 419-808.859t26 64Q445-707 418.859-681t-64 26Zm250 0Q567-655 541-681.141t-26-64Q515-783 541.141-809t64-26Q643-835 669-808.859t26 64Q695-707 668.859-681t-64 26Zm185 170Q752-485 726-511.141t-26-64Q700-613 726.141-639t64-26Q828-665 854-638.859t26 64Q880-537 853.859-511t-64 26ZM266-75q-42 0-69-31.526T170-181q0-42 25.5-74.5T250-318q22-22 41-46.5t36-50.5q29-44 65-82t88-38q52 0 88.5 38t65.5 83q17 26 35.5 50t40.5 46q29 30 54.5 62.5T790-181q0 42.948-27 74.474Q736-75 694-75q-54 0-107-9t-107-9q-54 0-107 9t-107 9Z"/></svg>',
  'today':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M360-80q-46 0-78-32t-32-78q0-46 32-78t78-32q46 0 78 32t32 78q0 46-32 78t-78 32Zm169-132q-6-46-33.5-81.5T427-346l132-134H226q-29 0-47.5-23T160-556q0-18 9-33t24-24l498-300q14-9 30.5-4.5T746-899q8 14 4.5 30.5T733-844L314-590h420q27 0 46.5 19.5T800-524q0 17-4 32.5T781-465L529-212Z"/></svg>',
  'contacts':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m429-40-19-386-163-94-19 68 78 136-51 30-92-157 46-164 237-137-112-112 42-42 168 167-145 83 85 69 318-283 38 38-330 360-20 424h-61ZM193-677q-30 0-51.5-21.5T120-750q0-30 21.5-51.5T193-823q30 0 51.5 21.5T266-750q0 30-21.5 51.5T193-677Z"/></svg>',
  'settings':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M616-887q112 0 191 79t79 191h-60q0-42-15.574-79.016Q794.852-733.031 768-762l-40 66q-9.394 16-20.197 35Q697-642 684-629q-12 12-28.625 12t-28.5-12Q615-641 615.5-657t12.5-28q13-13 31.5-24.5T694-730l67-39q-28.969-26.852-65.984-42.426Q658-827 616-827v-60ZM483-80q-84 0-157.5-32t-128-86.5Q143-253 111-326.5T79-484q0-146 93-257.5T409-880q-18 98 11 192.635 29 94.635 100 165.736 71 71.101 165.5 100.143Q780-392.445 879-410.471q-26 144.206-138 237.338Q629-80 483-80Zm0-60q100 0 182-57t132-145q-90-8-173-41.5T477.5-480Q414-543 381-625.5T340-797q-88 48-144.5 130.5T139-484q0 143.333 100.333 243.667Q339.667-140 483-140Zm-6-340Z"/></svg>',
  'logout':'<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"><path d="M120-80v-60h78v-141q-35-10-56.5-38.5T120-386v-334h216v334q0 35-21.5 65T258-281v141h78v60H120Zm60-419h96v-161h-96v161Zm48 161q19 0 33.5-14.5T276-386v-53h-96v53q0 19 14.5 33.5T228-338ZM520-80q-24 0-42-18t-18-42v-408q0-20 11-32t31-21l38-17q24-11 35-27t11-39v-161q0-16 9.5-25.5T621-880h94q16 0 25.5 9.5T750-845v161q0 23 13.5 39t37.5 27l38 17q19 8 30 20.5t11 32.5v408q0 24-18 42t-42 18H520Zm126-696h44v-44h-44v44ZM520-465h300v-83l-42-16q-40-15-64-49t-24-75v-28h-44v28q0 41-22.5 72T563-568l-43 20v83Zm0 325h300v-103H520v103Zm0-163h300v-102H520v102Zm-292-35Zm292 35v-102 102Z"/></svg>',
  'addAppointment':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M619-650q6-39-3-68t-38-67q-25-32-33-65t-1-80h56q-8 40 .5 66.5T643-791q24 32 32 64.5t1 76.5h-57Zm160 0q6-39-3-68t-38-67q-25-32-33-65t-1-80h56q-8 40 .5 66.5T803-791q24 32 32 64.5t1 76.5h-57ZM230-80q-63 0-106.5-43.5T80-230v-216q0-28 13.5-53t36.5-40l324-209 20 20q15 15 17.5 35.5T483-654l-59 94h346q13 0 21.5 8.5T800-530q0 12-8.5 21t-21.5 9H316l91-147-244 159q-11 7-17 18t-6 24v216q0 37 26.5 63.5T230-140h500q13 0 21.5 8.5T760-110q0 12-8.5 21T730-80H230Zm250-280v-60h370q13 0 21.5 8.5T880-390q0 12-8.5 21t-21.5 9H480Zm0 140v-60h330q13 0 21.5 8.5T840-250q0 12-8.5 21t-21.5 9H480ZM310-360Z"/></svg>',
  'edit':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M261-160q-26 0-43-17t-17-43q0-18 9-34.5t26-23.5l172-68v-138q-66 81-134 122t-154 41v-60q68 0 124-31.5T345-501l58-65q10-12 23.5-20t29.5-8h48q16 0 30 8t24 20l58 65q48 55 102 87.5T840-381v60q-85 0-153.5-41T552-484v138l172 68q17 7 26 23.5t9 34.5q0 26-17 43t-43 17H396v-11q0-26 16-42t42-16h133q8 0 14-6t6-14q0-8-6-14t-14-6H454q-44 0-70 27t-26 71v11h-97Zm219-494q-30 0-51.5-21.5T407-727q0-30 21.5-51.5T480-800q30 0 51.5 21.5T553-727q0 30-21.5 51.5T480-654Z"/></svg>',
  'save':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M481-276ZM120-160v-160q0-83 58.5-141.5T320-520h429q38 0 64.5 26t26.5 64q0 31-19 55.5T773-342l-93 27v155q0 21-9.5 38T645-94q-16 11-35 13.5T571-86l-189-74H120Zm480-120H375q-7 0-10.5 4t-4.5 9q-1 5 1.5 9.5t8.5 6.5l230 91v-120Zm-400 40h84q-2-6-3-12t-1-13q0-39 28-67t67-28h163l214-59q5-2 7-5t1-7q-1-4-3.5-6.5T749-440H320q-50 0-85 35t-35 85v80Zm200-320q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T480-720q0-33-23.5-56.5T400-800q-33 0-56.5 23.5T320-720q0 33 23.5 56.5T400-640Zm81 364Zm-81-444Z"/></svg>',
  'delete':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M80-728v-132q0-24 18-42t42-18h132v60H140v132H80Zm192 608H140q-24 0-42-18t-18-42v-132h60v132h132v60Zm548-608v-132H688v-60h132q24 0 42 18t18 42v132h-60Zm-279.92 94q-30.08 0-51.58-21.42-21.5-21.421-21.5-51.5 0-30.08 21.42-51.58 21.421-21.5 51.5-21.5 30.08 0 51.58 21.42 21.5 21.421 21.5 51.5 0 30.08-21.42 51.58-21.421 21.5-51.5 21.5ZM357-275l46-235-100 47v134h-60v-175l164-69q32-14 45.5-17.5t27.1-3.5q20.4 0 35.9 8.5T542-560l42 67q17 26 40.5 48.5T677-408l-30 51q-29-16-54.5-39.5T543-453l-43 178H357ZM610-80q-17 0-25.5-16t-.5-30l160-279q8-17 25.5-16t27.5 15l160 280q9 15-.75 30.5T930-80H610Zm160-40q6 0 10.5-4.5T785-135q0-6-4.5-10.5T770-150q-6 0-10.5 4.5T755-135q0 6 4.5 10.5T770-120Zm-15-65h30v-165h-30v165Z"/></svg>',
  'broken':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm43-314 172-172 170 170 171-171 44 44v-217H180v303l43 43Zm-43 254h600v-298l-44-44-171 171-170-170-172 172-43-43v212Zm0 0v-298 60-362 600Z"/></svg>',
  'done':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M380-120v-120L240-380v-220q0-24 11-45t32-32l77 77h-40v186l140 140v74h40v-74l37-37L56-792l56-56 736 736-56 56-198-198-14 14v120H380Zm306-268-46-46v-166H474L320-754v-86h80v160h160v-160h80v200l-40-40h40q33 0 56.5 23.5T720-600v178l-34 34ZM558-516Zm-130 97Z"/></svg>',
  'cancel':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M160-80v-240h120v240H160Zm200 0v-476q-50 17-65 62.5T280-400h-80q0-128 75-204t205-76q100 0 150-49.5T680-880h80q0 88-37.5 157.5T600-624v544h-80v-240h-80v240h-80Zm120-640q-33 0-56.5-23.5T400-800q0-33 23.5-56.5T480-880q33 0 56.5 23.5T560-800q0 33-23.5 56.5T480-720Z"/></svg>',
  'disable':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m430-500 283-283q12-12 28-12t28 12q12 12 12 28t-12 28L487-444l-57-56Zm99 99 254-255q12-12 28.5-12t28.5 12q12 12 12 28.5T840-599L586-345l-57-56ZM211-211q-91-91-91-219t91-219l120-120 59 59q7 7 12 14.5t10 15.5l148-149q12-12 28.5-12t28.5 12q12 12 12 28.5T617-772L444-599l-85 84 19 19q46 46 44 110t-49 111l-57-56q23-23 25.5-54.5T321-440l-47-46q-12-12-12-28.5t12-28.5l57-56q12-12 12-28.5T331-656l-64 64q-68 68-68 162.5T267-267q68 68 163 68t163-68l239-240q12-12 28.5-12t28.5 12q12 12 12 28.5T889-450L649-211q-91 91-219 91t-219-91Zm219-219ZM680-39v-81q66 0 113-47t47-113h81q0 100-70.5 170.5T680-39ZM39-680q0-100 70.5-170.5T280-921v81q-66 0-113 47t-47 113H39Z"/></svg>',
  'search':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m120-40 112-564-72 28v136H80v-188l202-86q29-12 59-2.5t47 36.5l40 64q27 43 71.5 69.5T600-520v80q-66 0-123.5-27.5T380-540l-24 120 84 80v300h-80v-240l-84-80-72 320h-84Zm260-700q-33 0-56.5-23.5T300-820q0-33 23.5-56.5T380-900q33 0 56.5 23.5T460-820q0 33-23.5 56.5T380-740ZM780-40l-42-42 28-28H560v-60h206l-28-28 42-42 100 100L780-40ZM660-210 560-310l100-100 42 42-28 28h206v60H674l28 28-42 42Z"/></svg>',
  'sortUp':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M340-80v-60l80-60v-220L80-320v-80l340-200v-220q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v220l340 200v80L540-420v220l80 60v60l-140-40-140 40Z"/></svg>',
  'sortDwn':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-80q-61 0-125-22t-116-60q-52-38-85.5-89T120-360v-120l160 120-62 62q29 51 92 88t130 47v-357H320v-80h120v-47q-35-13-57.5-43.5T360-760q0-50 35-85t85-35q50 0 85 35t35 85q0 39-22.5 69.5T520-647v47h120v80H520v357q67-10 130-47t92-88l-62-62 160-120v120q0 58-33.5 109T721-162q-52 38-116 60T480-80Zm0-640q17 0 28.5-11.5T520-760q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760q0 17 11.5 28.5T480-720Z"/></svg>',
  'arrowUpCrcl':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-320h80v-168l64 64 56-56-160-160-160 160 56 56 64-64v168Zm40 240q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>',
  'arrowDwnCrcl':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m480-320 160-160-56-56-64 64v-168h-80v168l-64-64-56 56 160 160Zm0 240q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>',
  'checkBox':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M360-200v-80h80q-15-138-118-229T80-600v-80q129 0 237 68t163 184q38-81 100-143.5T719-680H560v-80h280v280h-80v-132q-93 57-160 141t-80 191h80v80H360Z"/></svg>',
  'download':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>',
  'publish':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-160v-326L336-382l-56-58 200-200 200 200-56 58-104-104v326h-80ZM160-600v-120q0-33 23.5-56.5T240-800h480q33 0 56.5 23.5T800-720v120h-80v-120H240v120h-80Z"/></svg>',
  'addBox':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M360-160q-19 0-34-11t-22-28l-92-241H40v-80h228l92 244 184-485q7-17 22-28t34-11q19 0 34 11t22 28l92 241h172v80H692l-92-244-184 485q-7 17-22 28t-34 11Z"/></svg>',
  'shelves':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m80-449 44-70 316 297q12 11 26.5 16.5T495-200q12 0 23-3.5t20-8.5l342-216v94L580-145q-19 12-40.5 18.5T494-120q-30 0-58-11.5T385-164L80-449Zm430 189q17 0 28.5-11.5T550-300q0-2-4-17l142-89q5 8 13.5 12t18.5 4q17 0 28.5-11.5T760-430q0-14-9-25t-23-14q1-2 1.5-5t.5-6q0-17-11.5-28.5T690-520q-17 0-28.5 11.5T650-480q0 4 7 22l-142 88q-5-9-14.5-14.5T480-390q-17 0-28.5 11.5T440-350q0 14 9 25t23 14q-1 2-1.5 5t-.5 6q0 17 11.5 28.5T510-260ZM257-732l43-68q75 37 139 101.5T535-564q36-38 79.5-60.5T736-668q46-13 79.5-25t64.5-27v88q-27 11-56.5 21T757-591q-84 22-125.5 49T554-458q-5 8-14 13t-20 5q-14 0-25-9t-14-22q-18-76-80.5-149T257-732ZM124-519q72 67 158 148.5T440-222q12 11 26.5 16.5T495-200q12 0 23-3.5t20-8.5q63-39 165-103.5T880-428L538-212q-9 5-20 8.5t-23 3.5q-14 0-28.5-5.5T440-222L124-519Z"/></svg>',
  'receipt':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M240-80q-50 0-85-35t-35-85v-120h120v-560l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v680q0 50-35 85t-85 35H240Zm480-80q17 0 28.5-11.5T760-200v-560H320v440h360v120q0 17 11.5 28.5T720-160ZM360-600v-80h240v80H360Zm0 120v-80h240v80H360Zm320-120q-17 0-28.5-11.5T640-640q0-17 11.5-28.5T680-680q17 0 28.5 11.5T720-640q0 17-11.5 28.5T680-600Zm0 120q-17 0-28.5-11.5T640-520q0-17 11.5-28.5T680-560q17 0 28.5 11.5T720-520q0 17-11.5 28.5T680-480ZM240-160h360v-80H200v40q0 17 11.5 28.5T240-160Zm-40 0v-80 80Z"/></svg>',
  'addCircle':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>',
  'home':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="m720-600-32 28q-14 13-33 13t-33-11q-14-11-19-28t1-36l16-50-34-20q-16-9-22.5-26t-1.5-34q5-17 20-26.5t34-9.5h40l12-38q6-19 20.5-30.5T720-880q17 0 31.5 11.5T772-838l12 38h40q19 0 33.5 9.5T878-764q7 18 0 35t-22 25l-36 20 16 50q6 19 1 36.5T818-570q-15 11-33.5 11T752-572l-32-28Zm0-80q17 0 28.5-11.5T760-720q0-17-11.5-28.5T720-760q-17 0-28.5 11.5T680-720q0 17 11.5 28.5T720-680ZM552-244q23 60-15 112T430-80q-33 0-62.5-17T324-142q-83 12-137.5-42.5T142-324q-30-17-46-46.5T80-438q0-61 55.5-98.5T244-552l62 26q20-31 53-50.5t71-21.5v-82h60v90q37 11 61 34.5t41 65.5h88v60h-82q-2 38-20.5 71T528-306l24 62Zm-248 24q0-27 4.5-52.5T322-322q-23 11-49.5 15.5T220-304q0 39 22.5 61.5T304-220Zm-74-164q32 0 56.5-8t63.5-32l-120-50q-29-12-49.5.5T160-434q0 26 17 38t53 12Zm200 224q25 0 40.5-17.5T478-214l-54-136q-19 32-29.5 64T384-228q0 33 11.5 50.5T430-160Zm66-222q10-10 16-26.5t6-34.5q0-32-21-54t-52-22q-18 0-34 6t-27 17l78 36 34 78Zm-174 60Z"/></svg>',
  'moreVert':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="m340-200 100-160h-60v-120L280-320h60v120ZM240-560h240v-200H240v200Zm0 360h240v-280H240v280Zm-80 80v-640q0-33 23.5-56.5T240-840h240q33 0 56.5 23.5T560-760v280h50q29 0 49.5 20.5T680-410v185q0 17 14 31t31 14q18 0 31.5-14t13.5-31v-375h-10q-17 0-28.5-11.5T720-640v-80h20v-60h40v60h40v-60h40v60h20v80q0 17-11.5 28.5T840-600h-10v375q0 42-30.5 73.5T725-120q-43 0-74-31.5T620-225v-185q0-5-2.5-7.5T610-420h-50v300H160Zm320-80H240h240Z"/></svg>',
  'moreHorz':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="M750-614q-27 27-62 41t-70 14q-35 0-69-13.5T488-614l-75-75q-15-15-34-22.5t-39-7.5q-20 0-39 7.5T267-689l-75 75-57-57 75-75q27-27 61-40.5t69-13.5q35 0 68.5 13.5T469-746l75 75q16 16 35 23.5t39 7.5q20 0 39.5-7.5T693-671l75-75 57 57-75 75Zm0 200q-27 27-61.5 40.5T619-360q-35 0-69.5-13.5T488-414l-75-75q-15-15-34-22.5t-39-7.5q-20 0-39 7.5T267-489l-75 75-57-56 75-76q27-27 61-40.5t69-13.5q35 0 68.5 13.5T469-546l75 75q16 16 35 23.5t39 7.5q20 0 39.5-7.5T693-471l75-75 57 57-75 75Zm-1 200q-27 27-61 40.5T619-160q-35 0-69.5-13.5T488-214l-76-75q-15-15-34-22.5t-39-7.5q-20 0-39 7.5T266-289l-75 75-56-56 75-76q27-27 61-40.5t69-13.5q35 0 68.5 13.5T469-346l75 75q16 16 35.5 23.5T619-240q20 0 39-7.5t35-23.5l75-75 56 57-75 75Z"/></svg>',
  'camera':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="m740-333-56-56 179-179 57 56-180 179Zm-84-85-57-56 123-123-170-170-123 123-57-57 180-179 283 283-179 179ZM791-56 553-293 420-160H40v-105q0-26 14.5-46T92-340q17-7 37.5-17t41.5-24l55 55q6 6 14 6t14-6q6-6 6-14t-6-14l-51-52 15.5-15.5Q226-429 234-438l51 51q6 6 14 6t14-6q6-6 6-14t-6-14l-56-56q6-11 10.5-22t7.5-23l68 69q6 6 14 6t14-6q6-6 6.5-14t-5.5-14L56-791l56-57 735 736-56 56ZM122-240h265l110-110-67-67-133 133q-23 23-55 22.5T184-284l-8-7q-14 6-27 12.5T122-266v26Zm308-177Zm107-119Z"/></svg>',
  'hand':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="M80-160v-80h230q-22-85-83.5-146.5T80-470q20-5 39.5-7.5T160-480q134 0 227 93t93 227H80Zm480 0q0-42-9-83.5T525-323q42-71 114.5-114T800-480q21 0 40.5 2.5T880-470q-85 22-146 83.5T650-240h230v80H560Zm-80-239q0-65 24-122t66-100.5q42-43.5 98.5-69.5T789-719q-56 35-98 86t-65 114q-44 21-80.5 51.5T480-399Zm-73-75q-12-9-24-17t-25-16q0-6 1-12.5t1-12.5q0-76-24-144t-68-124q66 27 114.5 77.5T457-606q-18 30-31 63.5T407-474Z"/></svg>',
  'lunch':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="M160-120q-33 0-56.5-23.5T80-200v-120h800v120q0 33-23.5 56.5T800-120H160Zm0-120v40h640v-40H160Zm320-180q-36 0-57 20t-77 20q-56 0-76-20t-56-20q-36 0-57 20t-77 20v-80q36 0 57-20t77-20q56 0 76 20t56 20q36 0 57-20t77-20q56 0 77 20t57 20q36 0 56-20t76-20q56 0 79 20t55 20v80q-56 0-75-20t-55-20q-36 0-58 20t-78 20q-56 0-77-20t-57-20ZM80-560v-40q0-115 108.5-177.5T480-840q183 0 291.5 62.5T880-600v40H80Zm400-200q-124 0-207.5 31T166-640h628q-23-58-106.5-89T480-760Zm0 520Zm0-400Z"/></svg>',
  'debug':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-200q66 0 113-47t47-113v-160q0-66-47-113t-113-47q-66 0-113 47t-47 113v160q0 66 47 113t113 47Zm-80-120h160v-80H400v80Zm0-160h160v-80H400v80Zm80 40Zm0 320q-65 0-120.5-32T272-240H160v-80h84q-3-20-3.5-40t-.5-40h-80v-80h80q0-20 .5-40t3.5-40h-84v-80h112q14-23 31.5-43t40.5-35l-64-66 56-56 86 86q28-9 57-9t57 9l88-86 56 56-66 66q23 15 41.5 34.5T688-640h112v80h-84q3 20 3.5 40t.5 40h80v80h-80q0 20-.5 40t-3.5 40h84v80H688q-32 56-87.5 88T480-120Z"/></svg>'
  }
}
