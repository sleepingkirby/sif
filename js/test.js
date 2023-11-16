if(typeof test==='undefined'){
/*-------------------------------------------
pre: global mainObj, sqlObj, state variable, eventsLib for event/appointment CRUD
post: html changed, db updated
class to appointment events. Events DOESN'T HAVE TO BE APPOINTMENTS
-------------------------------------------*/
  class test{
    constructor(apptId=null){
    this.width = 320;    // We will scale the photo width to this
    this.height = 0;     // This will be computed based on the input stream

    this.streaming = false;

    this.video = null;
    this.canvas = null;
    this.photo = null;
    this.startbutton = null;
    }

    testFunc(e){
    console.log("asdfasdfasfdasdfd");
    console.log(e.target.value);
    }


    hookEls(){
      this.video.addEventListener(
        "canplay",
        (ev) => {
          if (!this.streaming) {
            this.height = (this.video.videoHeight / this.video.videoWidth) * this.width;
      
            this.video.setAttribute("this.width", this.width);
            this.video.setAttribute("this.height", this.height);
            this.canvas.setAttribute("this.width", this.width);
            this.canvas.setAttribute("this.height", this.height);
            this.streaming = true;
          }
        },
        false,
      );
      document.getElementById('startbutton').addEventListener(
        "click",
        (ev) => {
          this.takepicture();
          ev.preventDefault();
        },
        false,
      );
      this.closebutton.addEventListener(
        "click",
        (ev) => {
        const streams=this.video.srcObject.getTracks();
          for(const stream of streams){
          stream.stop();
          }
        },
        false,
      );
    }


    clearphoto() {
      const canvas=document.getElementById('canvas');
      const context = canvas.getContext("2d");
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);
    
      const data = canvas.toDataURL("image/png");
      this.photo.setAttribute("src", data);
    }
    
    takepicture() {
      const canvas=document.getElementById('canvas');
      const context = canvas.getContext("2d");
      if (this.width && this.height) {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        context.drawImage(this.video, 0, 0, this.width, this.height);
    
        const data = canvas.toDataURL("image/png");
        this.photo.setAttribute("src", data);
      } else {
        this.clearphoto();
      }
    }

    /*-----------------------------------------------
    pre: none
    post: write the html to the page
    -----------------------------------------------*/
    run(){

    document.getElementById('mainEl').innerHTML=`
    <div class="camera">
      <video id="video">Video stream not available.</video>
      <button id="startbutton">Take photo</button>
      <button id="closebutton">close</button>
    </div>
    <canvas id="canvas"> </canvas>
    <div class="output">
      <img id="photo" alt="The screen capture will appear in this box." />
    </div>
    `;

    this.video = document.getElementById('video');
    this.canvas = document.getElementById('canvas');
    this.photo = document.getElementById('photo');
    this.startbutton = document.getElementById('startbutton');
    this.closebutton = document.getElementById('closebutton');


      if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
          video: {
          facingMode: 'environment'
          },
          audio: false
        })
          .then((stream) => {
            video.srcObject = stream;
            video.play();
          })
          .catch((err) => {
            console.error(`An error occurred: ${err}`);
          });
      }
      this.hookEls();
    }
  }

var testObj=new test();
state.depModuleObjs['test']=testObj;
}
