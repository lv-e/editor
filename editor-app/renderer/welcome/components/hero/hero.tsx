import * as React from "react";
import "./hero.less"

export function Hero (props) {
    const artworkCount = 3
    const selected = 1 + (new Date().getDay()) % artworkCount
    return  <section id="hero">
                <img className={`logo type${selected}`}/>
            </section>
}