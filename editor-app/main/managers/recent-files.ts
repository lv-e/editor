
import { existsSync } from "fs";
import * as path from "path";

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

    static shared(): RecentFiles {
        if (!RecentFiles.instance) 
            RecentFiles.instance = new RecentFiles();
        return RecentFiles.instance;
    }

    get getAll():FileEntry[]{
        let response:FileEntry[] = []
        response.push(new FileEntry("/tmp/github/games/pokemon.lvproject"))
        response.push(new FileEntry("/tmp/github/deltas/pokemon.lvproject"))
        return response
    }
}