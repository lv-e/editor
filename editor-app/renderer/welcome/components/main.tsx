import * as React from "react";
import { Header } from "./header/header";
import { Hero } from "./hero/hero";
import { StartOptions } from "./start-options/start-options";

import "./main.less"

export function Main (props) {
    return <>
    <div id="welcome">
        <Header/>
        <Hero/>
        <StartOptions/>
    </div></>
}