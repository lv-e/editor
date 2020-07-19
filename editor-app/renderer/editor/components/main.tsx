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

export function Main (props) {
    return <>
    
    <ReflexContainer orientation="vertical" windowResizeAware={true}>

        <ReflexElement className="left-pane" minSize={200} maxSize={260}>
            <FileExplorer/>
        </ReflexElement>
        <ReflexSplitter/>
        <ReflexElement className="right-pane" minSize={300}>
            <Tabs/>
            <MiniEditor/>
        </ReflexElement>
    </ReflexContainer>
    </>
}