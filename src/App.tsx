import * as React from "react";
import IdleTimeOutHandler from "./IdleTimeoutHandler";

export default function App() {
  const [isActive, setIsActive] = React.useState(true);
  return (
    <React.Fragment>
      <h1>{isActive ? "User is Active" : "User is Not active"}</h1>
      <IdleTimeOutHandler
        onActive={() => {
          setIsActive(true);
        }}
        onIdle={() => {
          setIsActive(false);
        }}
        timeOutInterval={10000}
      />
    </React.Fragment>
  );
}
