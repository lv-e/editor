import * as React from "react";
import "./header.less"
import { MiniButton } from "../../../../app-components/mini-button/mini-button";

declare function require(path: string);
const logo = require('../../../../app-assets/images/bg/header-logo-bg.png');

export function Header (props) {
    return <>
    <section id="welcome-header">
        <MiniButton icon="close"/>
        <div className="logo">
            <div className="stripe"/>
            <img src={String(logo)}/>
            <div className="stripe"/>
        </div>
    </section></>
}