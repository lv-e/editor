
import * as React from "react";
import "./hero.less"

declare function require(path: string);
const logo = require('../../assets/images/hero-gallery/a.png');

export function Hero (props) {
    return <>
    <div id="hero">
        <img src={String(logo)}/>
    </div></>
}