#!/bin/bash

# say hello because it's polite
echo "hi! this is > lv editor < 's mantenance script"

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

build_everything_dev(){

    rm -rf editor-app/build

    #main
    tsc --p editor-app/src/main/tsconfig.json
}

## what should we do?

 while true; do

        echo "available options are:"
        echo " 1) publish docker image"
        echo " 2) build editor's everything [dev]"
        echo " 3) build editor's everything [prod]"

        read -p "choose one: " opt; echo "--"

        case $opt in
            1 ) publish_docker; break;;
            2 ) build_everything_dev; break;;
            * ) echo "ok! bye."; exit;;
        esac
done

