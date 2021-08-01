import { useEffect, useState } from "react";
import MDSpinner from "react-md-spinner";
const appID = process.env.REACT_APP_ID;
const region = process.env.REACT_APP_REGION;
const AUTH_KEY = process.env.REACT_APP_AUTH_KEY;
const wid = process.env.REACT_APP_W1;
var appSetting = new window.CometChat.AppSettingsBuilder()
  .subscribePresenceForAllUsers()
  .setRegion(region)
  .build();

const Client = () => {
  const [load, setLoad] = useState(true);

  useEffect(() => {
    setLoad(true);
    window.CometChat.init(appID, appSetting).then(
      () => {
        // // You can now call login function.
        window.CometChatWidget.init({
          appID: appID,
          appRegion: region,
          authKey: AUTH_KEY,
        }).then((response) => {
          console.log("Initialization completed successfully");
          //You can now call login function.
          let uid = localStorage.getItem("cc-uid");
          if (uid === null) {
            // create new user
            const uid = "user" + new Date().getSeconds().toString();
            const user = new window.CometChat.User(uid);
            user.setName(uid);
            window.CometChat.createUser(user, AUTH_KEY).then(
              (user) => {
                localStorage.setItem("cc-uid", user.uid);
                window.CometChatWidget.login({ uid: user.uid }).then(
                  (user) => {
                    console.log(user);
                    window.CometChatWidget.launch({
                      widgetID: wid,
                      roundedCorners: "true",
                      docked: "true",
                      height: "300px",
                      width: "400px",
                      defaultID: "agent", //default UID (user) or GUID (group) to show,
                      defaultType: "user", //user or group
                    });
                    setLoad(false);
                  },
                  (error) => {}
                );
              },
              (error) => {}
            );
          } else {
            window.CometChatWidget.login({
              uid: uid,
            }).then((user) => {
              window.CometChatWidget.launch({
                widgetID: wid,
                roundedCorners: "true",
                docked: "true",
                height: "300px",
                width: "400px",
                defaultID: "agent", //default UID (user) or GUID (group) to show,
                defaultType: "user", //user or group
              });
              setLoad(false);
            });
          }
        });
      },
      (error) => {
        console.log("Initialization failed with error:", error);
        // Check the reason for error and take appropriate action.
      }
    );
  }, []);

  if (load) {
    return (
      <div className="container">
        <MDSpinner />
      </div>
    );
  }

  return <div className="App"></div>;
};

export default Client;
