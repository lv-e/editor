
import { existsSync } from "fs";
import * as path from "path";

import Store = require('electron-store');

export class FileEntry {

    readonly filepath : string;
    readonly directoryPath : string;
    readonly resourceName : string;
    readonly resourceExtension : string;

    constructor(filepath:string) {
        let data = path.parse(filepath)
        this.filepath = filepath
        this.directoryPath = data.dir
        this.resourceName = data.name
        this.resourceExtension = data.ext
    }

    get exists():boolean {
        return existsSync(this.filepath)
    }

    isEqual(other:FileEntry) : boolean{
        return other.filepath == this.filepath
    }
    
}

export class RecentFiles {

    private static instance: RecentFiles;
    private constructor() { }
    private static readonly store_key = "welcome.recent_files"
    private static readonly store_limit = 3

    static shared(): RecentFiles {
        if (!RecentFiles.instance) 
            RecentFiles.instance = new RecentFiles();
        return RecentFiles.instance;
    }

    add(entry:FileEntry) {
        try {
            let all:string[] = this.getAll
                .filter( e => e.isEqual(entry) == false)
                .filter( e => e.exists)
                .map( e => e.filepath)

            all.splice(0, 0, entry.filepath)
            all = all.slice(0,3)
            
            new Store().set(RecentFiles.store_key, all)
            console.info(`saved recent file, that now is: ${JSON.stringify(all)}`)
        } catch (e) {
            console.error("can't save recent files\n", e)
        }
    }

    get getAll():FileEntry[]{
        try {
            return new Store()
                .get(RecentFiles.store_key, [])
                .map(e => new FileEntry(e))
                .filter( e => e.exists)
        } catch (e) {
            console.error("can't load recent files\n", e)
            return []
        }
    }
}