import * as React from "react";
import {FileExplorer} from "./file-explorer/file-explorer"
import {Tabs} from "./tabs/tabs"
import {MiniEditor} from "./mini-editor/mini-editor"

import 'react-reflex/styles.css'

import {
    ReflexContainer,
    ReflexSplitter,
    ReflexElement
  } from 'react-reflex'

import "./main.less"

const splitterStyle = {
    border: "none",
    backgroundColor: "transparent",
    width: "4px",
    margin: "0 -2px 0 -2px"
}

export function Main (props) {
    return <>
    
    <ReflexContainer orientation="vertical" windowResizeAware={true}>
        <ReflexElement className="left-pane" minSize={200} maxSize={260}>
            <FileExplorer/>
        </ReflexElement>
        <ReflexSplitter propagate={false} style={splitterStyle}/>
        <ReflexElement className="right-pane" minSize={300}>
            <MiniEditor/>
        </ReflexElement>
    </ReflexContainer>
    </>
}