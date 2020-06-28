
import * as React from "react";
import "./start-options.less"

import { Welcome } from "./c.welcome";
import { Recent } from "./c.recent";
import { News } from "./c.news";

export function StartOptions (props) {
    return <>
    <section id="start-options">
        <Welcome/><span/><Recent/><span/><News/>
    </section></>
}