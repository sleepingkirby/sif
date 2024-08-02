if(typeof test==='undefined'){
/*-------------------------------------------
pre: global mainObj, sqlObj, state variable, eventsLib for event/appointment CRUD
post: html changed, db updated
class to appointment events. Events DOESN'T HAVE TO BE APPOINTMENTS
-------------------------------------------*/
  class homeCamera{
    constructor(apptId=null){
    this.width = 320;    // We will scale the photo width to this
    this.height = 0;     // This will be computed based on the input stream
    this.outPath="./photos/appt/";


    //Camera spec
    this.camSpec=null;

    this.video = null;
    this.canvas = null;
    this.photo = null;
    this.startbutton = null;
    this.closebutton = null;
    this.clearbutton = null;
    this.drpDwn=null;
    this.oldImgBuff=null;

    this.videoWrapId='cameraVideoWrap';
    this.outputWrapId='cameraOutput';
    this.controlsId='cameraOutputControls';

    this.dl = null;

    this.apptId=null;

    this.wndwEvent=this.wndwOrnt;

    this.destruct=this.destructor;//hook for destructor to run on module change.
    }

    testFunc(e){
    console.log("asdfasdfasfdasdfd");
    console.log(e.target.value);
    }

    /*-----------------------------------------------
    pre: none
    post: adds hooks to elements
    -----------------------------------------------*/
    hookEls(){
      this.video.addEventListener(
        "canplay",
        (ev) => {
          if (this.video&&this.camSpec) {
          this.height = (this.video.videoHeight / this.video.videoWidth) * this.width;
      
          this.video.setAttribute("width", this.camSpec.width);
          this.video.setAttribute("height", this.camSpec.height);
          this.video.style.maxWidth=String(this.camSpec.width)+'px';
          this.video.style.maxHeight=String(this.camSpec.height)+'px';

            if(this.camSpec){
            this.canvas.setAttribute("width", this.camSpec.width);
            this.canvas.setAttribute("height", this.camSpec.height);
            this.canvas.style.width=String(this.camSpec.width)+'px';
            this.canvas.style.height=String(this.camSpec.height)+'px';
            }
            else{
            this.canvas.setAttribute("width", this.width);
            this.canvas.setAttribute("height", this.height);
            this.canvas.style.width=String(this.width)+'px';
            this.canvas.style.height=String(this.height)+'px';
            }
          }
        this.imgFlip();
        },
        false,
      );
      //take picture
      this.startbutton.addEventListener(
        "click",
        (ev) => {
          this.takepicture();
          this.imgFlip();
          const a=document.getElementById('picDL');
          a.download=this.genNm();
          ev.preventDefault();
        },
        false,
      );
      this.closebutton.addEventListener(
        "click",
        this.closeStream,
        false,
      );
      this.clearbutton.addEventListener(
        "click",
        (e)=>{
        this.clearphoto();
        this.imgFlip();
        },
        false,
      );
      /*
      this.dl.addEventListener("click",
        (ev) => {
        const a=document.getElementById('picDL');
        a.download="test.png";
        },
        false,
      );
      */
      this.drpDwnHook();
      this.oldImgHook();
      this.oldImgIconHook();
      window.addEventListener("deviceorientation", this.wndwEvent, false);
    }


    /*-----------------------------------------------
    pre: none
    post:none
    -----------------------------------------------*/
    loadOldImg(name=null){
    const nm=name||this.genNm();
    this.oldImgBuff.src=this.outPath+nm;
    }


    /*-----------------------------------------------
    pre: none
    post:none
    -----------------------------------------------*/
    drpDwnHook(){
      if(!this.drpDwn){
      return null;
      }
      this.drpDwn.addEventListener("change",(e)=>{
      this.loadOldImg();

      //set download image name
      const a=document.getElementById('picDL');
      a.download=this.genNm();
      },false);
    }

    /*-----------------------------------------------
    pre: none
    post:none
    -----------------------------------------------*/
    oldImgIconHook(){
      const img=document.getElementById('cameraOutputOldImgIcon');
      img.addEventListener("mouseenter",(event)=>{
      //if there is no photo in image,
        if(!event.target.getAttribute('err')){
        console.log(this.oldImgBuff.src);
        this.photo.setAttribute('src',this.oldImgBuff.src);
        return null;
        }
      event.target.setAttribute('class','err');
      },false);

      img.addEventListener("mouseleave",(event)=>{
      this.photo.setAttribute('src',this.canvas.toDataURL("image/png"));

        if(event.target.getAttribute('class')=="err"){
        event.target.removeAttribute('class');
        }
      },false);
    }
    

    /*-----------------------------------------------
    pre: none
    post:none
    -----------------------------------------------*/
    oldImgIconFlip(hide=false){
      const img=document.getElementById('cameraOutputOldImgIcon');
      if(hide){
        img.setAttribute('title','No picture in this slot');
        img.innerHTML=getEvalIcon(iconSets, state.user.config.iconSet, 'hideImage');
      }
      else{
        img.setAttribute('title','See picture in this slot');
        img.innerHTML=getEvalIcon(iconSets, state.user.config.iconSet, 'image');
      }
    }

    /*-----------------------------------------------
    pre: none
    post:none
    -----------------------------------------------*/
    oldImgHook(){
      this.oldImgBuff.addEventListener("error",(e)=>{
      this.oldImgIconFlip(true);
      const img=document.getElementById('cameraOutputOldImgIcon');
      img.setAttribute('err',true);
      },false);

      this.oldImgBuff.addEventListener("load",(e)=>{
      this.oldImgIconFlip(false);
      const img=document.getElementById('cameraOutputOldImgIcon');
      img.removeAttribute('err');
      },false);
    }


    /*-----------------------------------------------
    pre: none
    post:none
    function to detect orientation 
    -----------------------------------------------*/
    wndwOrnt(event){
    console.log(event);
      const rotateDegrees = event.alpha; // alpha: rotation around z-axis
      const leftToRight = event.gamma; // gamma: left to right
      const frontToBack = event.beta; // beta: front back motion
    }

    /*-----------------------------------------------
    pre: none
    post:none
    clearing the photo from the canvas and the photo element
    -----------------------------------------------*/
    clearphoto() {
      const canvas=document.getElementById('cameraCanvas');
      const context = canvas.getContext("2d");
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);
    
      const data = canvas.toDataURL("image/png");
      this.photo.setAttribute("src", "");
    }
   

    /*-----------------------------------------------
    pre: none
    post: canvas(not show), alias and img drawn
    draws image to canvas, alias and img
    -----------------------------------------------*/
    takepicture() {
      const context = this.canvas.getContext("2d");

      this.loadOldImg();//tries to load the old image to sync the oldImgIcon

      if (this.camSpec) {
        context.drawImage(this.video, 0, 0, this.camSpec.width, this.camSpec.height);
    
        const data = this.canvas.toDataURL("image/png");
        this.photo.style.maxWidth=String(this.camSpec.width)+'px';
        this.photo.style.maxHeight=String(this.camSpec.height)+'px';
        this.photo.setAttribute("src", data);

        mainObj.setFloatMsg(`Make sure to save pictures to ${this.outPath}`); 
      } else {
        this.clearphoto();
      }
      const a=document.getElementById('picDL');
      if(a){
      a.href=this.canvas.toDataURL("image/png");
      }
    }

    /*-----------------------------------------------
    pre: none
    post: closes video stream 
    -----------------------------------------------*/
    closeStream(ev){
    const streams=homeCameraObj.video?.srcObject?.getTracks()||null;
      if(!streams){
      return null;
      }
      for(const stream of streams){
      stream.stop();
      }
    window.removeEventListener("deviceorientation",this.wndwEvent);
    }

    /*-----------------------------------------------
    pre: none
    post: html drawn
    flips between video mode and image mode
    i.e. looking to take a picture and picture taken, show said picture to save
    -----------------------------------------------*/
    imgFlip(){
    const video=document.getElementById(this.videoWrapId);
    const output=document.getElementById(this.outputWrapId);
    const drpdwn=document.getElementById('cameraOutputImgs');
      if(!this.photo.getAttribute('src')||this.photo.getAttribute('src')==""){
      output.style.display='none';
      video.style.display='flex';
      this.dl.style.display='none';
      this.startbutton.style.display='flex';
      this.clearbutton.style.setProperty('visibility','hidden');
      drpdwn.style.setProperty('visibility','hidden');
      }
      else{
      output.style.display='flex';
      video.style.display='none';
      this.dl.style.display='flex';
      this.startbutton.style.display='none';
      this.clearbutton.style.setProperty('visibility','visible');
      drpdwn.style.setProperty('visibility','visible');
      }
    }

    /*-----------------------------------------------
    pre: none
    post: writes img name 
    -----------------------------------------------*/
    genNm(path=false){
    const d=document.getElementById('cameraDrpdwn');
    const val=d?d.value:'1';
      if(path){
      return this.outPath+this.apptId+'-'+val+'.png';
      }

    return this.apptId+'-'+val+'.png';
    }


    /*-----------------------------------------------
    pre: none
    post: write the html to the page
    If the canvas is being hidden, why do we need it?
    The video data is drawn to the canvas and only 
    via the canvas (to my knowledge), can you convert
    to an image.
    -----------------------------------------------*/
    drawCamera(apptId){
    this.apptId=apptId||null;

    document.getElementById('overModBody').innerHTML=`
    <div id="cameraVideoWrap" class="camera">
      <video id="video">Video stream not available.</video>
      <button id="cameraCloseButton">close</button>
    </div>
    <canvas id="cameraCanvas"></canvas>
    <div id="cameraOutput" class="output">
      <img id="photo" />
    </div>
    `;

    document.getElementById("overModFoot").innerHTML=`
      <div id="cameraOutputControls">
        <div id="cameraOutputImgs">
          <div id="cameraOutputOldImgIcon">`+getEvalIcon(iconSets, state.user.config.iconSet, 'hideImage')+`</div>
          <img id="cameraOutputOldImgImg" />
          <select id="cameraDrpdwn">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          </select>
        </div>
        <div id="startbutton" tabindex=1>`+getEvalIcon(iconSets, state.user.config.iconSet, 'radioButton')+`</div>
        <div id="dlbutton" title="Save photo">
          <a id="picDL">
          `+getEvalIcon(iconSets, state.user.config.iconSet, 'addCircle')+`
          </a>
        </div>
        <div id="clearbutton" title="Clear photo">`+getEvalIcon(iconSets, state.user.config.iconSet, 'cancelCircle')+`</div>
      </div>
    `;


    this.video = document.getElementById('video');
    this.canvas = document.getElementById('cameraCanvas');
    this.photo = document.getElementById('photo');
    this.startbutton = document.getElementById('startbutton');
    this.closebutton = document.getElementById('cameraCloseButton');
    this.clearbutton = document.getElementById('clearbutton');
    this.dl = document.getElementById('dlbutton');
    this.drpDwn = document.getElementById('cameraDrpdwn');
    this.oldImgBuff = document.getElementById('cameraOutputOldImgImg');
//navigator.mediaDevices.getUserMedia(params);
      if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
          video: {
          facingMode: 'environment'
          },
          audio: false
        })
          .then((stream) => {
            this.camSpec=stream.getTracks()[0].getSettings();
            video.srcObject = stream;
            video.play();
          })
          .catch((err) => {
            console.error(`An error occurred: ${err}`);
          });
      }
    this.hookEls();
    this.loadOldImg();
    }

    
    /*-----------------------------------------------
    pre: this.destruct
    post: close/stops the streams
    destructor to run closing any streams when changing modules.
    -----------------------------------------------*/
    destructor() {
    this.closeStream();
    }
  }

var homeCameraObj=new homeCamera();
state.depModuleObjs['homeCamera']=homeCameraObj;
}
