import * as lv from '@lv-game-editor/lv-cli';
import { IpcMainEvent } from 'electron';
import { writeFileSync } from 'fs';
import { EditorScreen } from '../editor-main';

export function saveProject(e:IpcMainEvent, newValue:lv.projectContent) : boolean {
    try {
        let path = EditorScreen.shared.pathForEvent(e)
        let rawJSON = JSON.stringify(newValue, null, '\t')
        writeFileSync(path, rawJSON, {encoding:"utf-8"})
        return true
    } catch (e) {
        return false 
    }
}