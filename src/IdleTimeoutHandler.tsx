import { useEffect, useRef } from "react";
import workerScript from './timer-worker';

interface IdleTimeOutHandlerProps {
  onActive: () => void;
  onIdle: () => void;
  timeOutInterval: number;
}
const IdleTimeOutHandler = ({
  onActive,
  onIdle,
  timeOutInterval
}: IdleTimeOutHandlerProps) => {
  const worker = useRef<Worker>();
  const events = ["click", "scroll", "load", "keydown"];

  const eventHandler = (eventType: any) => {
    localStorage.setItem(
      "lastInteractionTime",
      JSON.stringify(new Date().valueOf())
    );
    worker.current?.postMessage({key: "userInteracted"});
  };

  const addEvents = () => {
    events.forEach((eventName) => {
      window.addEventListener(eventName, eventHandler);
    });
  };

  const removeEvents = () => {
    events.forEach((eventName) => {
      window.removeEventListener(eventName, eventHandler);
    });
  };

  useEffect(() => {
    addEvents();
    worker.current = new Worker(workerScript);
    worker.current?.postMessage({key: "timeOutInterval", value: timeOutInterval});
    worker.current?.postMessage({key: "startTimer"});
    worker.current.onmessage = (e) => {
      if(e.data === 'onActive') {
        onActive();
      } else if (e.data === 'onIdle') {
        onIdle();
      } else {
        console.log(e.data);
      }
    }

    return () => {
      removeEvents();
      worker.current?.terminate();
    };
  }, []);

  return null;
};

export default IdleTimeOutHandler;
