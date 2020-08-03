import * as React from "react";
import { SquareButton } from "[comps]/ui/square-button";
import { SearchBar } from "./search-bar";

import "./toolbar.less"

export function Toolbar(props) {
    return <div className="toolbar">
        <SearchBar/>
        <SquareButton onclick={ e => console.log(e) } icon="new-scene"/>
        <SquareButton onclick={ e => console.log(e) } icon="new-folder"/>
        <SquareButton onclick={ e => console.log(e) } icon="new-file"/>
    </div>
}