export function startConference(roomId,user,closeJitsi) {
    try {
      const domain = "meet.jit.si";
      const options = {
        roomName: roomId,
        height: "100%",
        width: "100%",
        parentNode: document.getElementById("jitsi-container"),
        interfaceConfigOverwrite: {
          filmStripOnly: false,
          SHOW_JITSI_WATERMARK: false,
        },
        configOverwrite: {
          disableSimulcast: false,
        },
        onload: "Loading",
        userInfo: {
          email: user.email,
          displayName: `${user.name} ${user.lastname}`,
        },
      };

      const api = new window.JitsiMeetExternalAPI(domain, options);
      api.addEventListener("videoConferenceJoined", () => {
        console.log("Local User Joined");
        api.executeCommand("displayName", `${user.name} ${user.lastname}`);
      });
      api.addEventListener("readyToClose", () => {
        closeJitsi();
      });
    } catch (error) {
      console.error("Failed to load Jitsi API", error);
    }
  }