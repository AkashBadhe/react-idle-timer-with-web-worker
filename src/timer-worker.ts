// worker.js
// import api from "./testModule";

const workercode = () => {
  let timer: ReturnType<typeof setTimeout>;
  let timeOutInterval = 4000;
  

  const startTimer = (lastInteractionTime: number = new Date().valueOf()) => {
    if(timer) {
      clearTimeout(timer);     
    }
    timer = setTimeout(() => {
      const diff = new Date().valueOf() - (+lastInteractionTime);
      if (diff < timeOutInterval) {
        startTimer();
        postMessage("onActive");
      } else {
        postMessage("onIdle");
      }
    }, timeOutInterval || 6000);
  };

  self.onmessage = (e) => {
    if(e.data.key === 'userInteracted' || e.data.key === 'startTimer') {
      postMessage("onActive");
      startTimer();
    } else if(e.data.key === 'timeOutInterval') {
      timeOutInterval = e.data.value;
    }
  };
};

let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const workerScript = URL.createObjectURL(blob);

export default workerScript;
