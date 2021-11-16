import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {startConference} from '../Controlers/jitsi'
import jwt from "jsonwebtoken";
function JitsiMeet({ closeJitsi }) {
  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const roomId = useSelector((state) => state.messages.conversation);
  const { user } = jwt.verify(
    JSON.parse(sessionStorage.getItem("user"))?.token,
    "secret"
  );

  useEffect(() => {
    // verifico si JITSI existe en el objeto globlal
    if (window.JitsiMeetExternalAPI) startConference(roomId,user,closeJitsi);
    else alert("Jitsi Meet API script not loaded");
  }, [roomId,user,closeJitsi]);

  return (
    <div style={containerStyle}>
      <div id="jitsi-container" style={containerStyle} />
    </div>
  );
}

export default JitsiMeet;
