
FROM alpine:3.10.3

RUN apk add --update \
    nodejs \
    npm \
    git
    
RUN npm i -g \
    @lv-game-editor/lv-cli@"<2.0.0" \
    @lv-game-editor/encoder-lvcode@"<2.0.0" \
    @lv-game-editor/encoder-lvproject@"<2.0.0" 