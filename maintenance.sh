#!/bin/bash

# say hello because it's polite
echo "hi! this is > lv editor < 's maintenance script"

## available commands

publish_docker(){
    
    while true; do

        echo "will now build and publish a new docker image."
        read -p "it's that okay (y/n)? " yn; echo "--"

        case $yn in
            [Yy]* ) 
                
                docker login
                docker build -t lvedock/lve_runtime ./docker-runtime/
                docker push lvedock/lve_runtime
                echo "there you go!"
                break;;
            [Nn]* )
                echo "ok! bye."
                exit;;
            * ) 
                echo "Please answer yes or no."
        esac
    done
}

loadAngularEngine(){
    echo "will run dev:load-all on a new iTerm window (macos only)"
    ttab -G -a iTerm2 'cd editor-app; npm run dev:load-all'
    echo "done!"
}

loadEditorInstance(){
    echo "will run dev-electron-app on a new iTerm window (macos only)"
    ttab -G -a iTerm2 'cd editor-app; npm run dev-electron-app'
    echo "done!"
}

## what should we do?

 while true; do

        echo "available options are:"
        echo " 1) publish docker image"
        echo " 2) load angular engine (dev)"
        echo " 3) load a new editor instance (dev)"

        read -p "choose one: " opt; echo "--"

        case $opt in
            1 ) publish_docker; break;;
            2 ) loadAngularEngine; break;;
            3 ) loadEditorInstance; break;;
            * ) echo "ok! bye."; exit;;
        esac
done

