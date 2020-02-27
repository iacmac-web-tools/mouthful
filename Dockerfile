FROM golang:1.10-alpine
ARG MOUTHFUL_VER
ENV CGO_ENABLED=${CGO_ENABLED:-1} \
    GOOS=${GOOS:-linux} \
    MOUTHFUL_VER=${MOUTHFUL_VER:-master}
ADD . /go/src/mouthful
RUN set -ex; \
    apk add --no-cache bash build-base curl git upx nodejs npm  && \
    echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories && \
    echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories && \
    go get -u github.com/golang/dep && \
    cd $GOPATH/src/github.com/golang/dep && \
    go install ./... && \
    apk add --no-cache shadow && chsh -s /bin/bash && exec /bin/bash 
WORKDIR /go/src/mouthful
RUN ./build.sh && \
    cd dist/ && \
    upx --best mouthful

FROM alpine:3.7
COPY --from=0 /go/src/mouthful/dist/ /app/
# this is needed if we're using ssl
RUN apk add --no-cache ca-certificates
WORKDIR /app/
VOLUME [ "/app/data" ]
EXPOSE 8080
CMD ["/app/mouthful"]
