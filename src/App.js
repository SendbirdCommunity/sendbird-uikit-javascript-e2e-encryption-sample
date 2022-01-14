import React from "react";
import {SendBirdProvider} from "sendbird-uikit";
import "sendbird-uikit/dist/index.css";
import './App.css';
import {APP_ID, USER_ID, NICKNAME, THEME} from "./const";
import CustomizedApp from "./CustomizedApp"

const App = () => {
    return (
        <SendBirdProvider
            appId={APP_ID}
            userId={USER_ID}
        >
            <div>
                <CustomizedApp/>
            </div>
        </SendBirdProvider>
    )
}

export default App;
