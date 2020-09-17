
FROM alpine:3.10.3

RUN apk add --update \
    nodejs \
    npm \
    git

# folder structure convention

RUN \
# the same as the project folder on host machine
    mkdir -p -m 777 /lv/project \ 
\
# used by encoder to store intermediate c-stripes files
    mkdir -p -m 777 /lv/artifacts \
\
# the end of encoding pipeline, where the c++ source are put
    mkdir -p -m 777 /lv/lv-game \
\
# used to share information between machines, .shared on host
    mkdir -p -m 777 /lv/shared \
\
# scripts is where build and run .sh files are located
    mkdir -p -m 777 /lv/scripts \
\
# this is the output dir, also is the .bin dir at host machine
    mkdir -p -m 777 /lv/bin

# this line will force the next RUN argument to be created every time
# mainly because during development it will be commom to have a new
# release of this packages on the 1.x.x range
ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache
    
RUN npm i -g \
    @lv-game-editor/lv-cli@"<2.0.0" \
    @lv-game-editor/encoder-lvcode@"<2.0.0" \
    @lv-game-editor/encoder-png@"<2.0.0" \
    @lv-game-editor/encoder-lvproject@"<2.0.0" 