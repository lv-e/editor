import * as React from "react";

import "./tabs.less"

export function Tabs (props) {
    return  <section className="tabs-bar">
                <ul>
                    <li className="selected">menu.lvcode</li>
                    <li>old.lvsprite</li>
                    <li>my_game.lvproject</li>
                    <li>JumperGuy-lib.lvcode</li>
                </ul>
            </section>
}