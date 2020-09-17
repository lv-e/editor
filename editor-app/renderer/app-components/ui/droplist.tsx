
import * as React from "react";
import { useState } from "react";

import "./droplist.less"

export function DropList(options:string[]) {

    let [isVisible, setIsVisible] = useState<boolean>(false) 
    let [width, _setWidth] = useState<string>("200px") 
    let [px, setPX] = useState<string>("0px") 
    let [py, setPY] = useState<string>("0px") 

    let [caster, setCaster] = useState<null|HTMLButtonElement>(null)
    let callback:(string) => void = function(str:string) {}

    function toggle(visible:boolean) {

        if (caster != null) {
            if (visible) caster.classList.add("droplist-caster")
            else caster.classList.remove("droplist-caster")
        }

        setIsVisible(visible)
    }

    function setCallback(_callback:(string) => void) {
        callback = _callback
    }

    function setWidth(newWidth:number) {
        _setWidth(newWidth + "px")
    }

    function setPosition(x:number, y:number) {
        setPX(x + "px")
        setPY(y + "px")
    }

    function configureFor(element:HTMLButtonElement) {
        setCaster(element)
        setPosition(element.offsetLeft, element.offsetTop + element.offsetHeight + 2)
        setWidth(element.offsetWidth)
    }

    let tsx = <>

        <a className="full-overlay" style={{
            opacity: (isVisible ? "0.5" : "0.0"),
            pointerEvents: (isVisible ? "inherit" : "none"),
        }} onClick={ e => {
            toggle(false)
        }}></a>

        <ul className="popup-list" style={{
            opacity: (isVisible ? "1.0" : "0.0"),
            pointerEvents: (isVisible ? "inherit" : "none"),
            minWidth: width,
            left: px,
            top: py
        }}>
            { options.map( (option, i) => 
                <li key={i} >
                    <a className="glow" onClick={ e => {
                        toggle(false)
                        callback(option)
                    }}>{option}</a>
                </li>
            )}
        </ul>

    </>

    return {tsx, toggle, setCallback, setWidth, setPosition, configureFor}
}
