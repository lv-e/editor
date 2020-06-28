import * as React from "react";
import { MiniButton } from "../../../../app-components/mini-button/mini-button";
import "./header.less"

declare function require(path: string);
const logo = require('../../../../app-assets/images/bg/header-logo-bg.png');

export function Header (props) {
    return <>
    <section id="welcome-header">
        <MiniButton icon="close"/>
        <div className="logo">
            <span className="stripe"/>
            <img src={String(logo)}/>
            <span className="stripe"/>
        </div>
    </section></>
}