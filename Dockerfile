FROM alpine:3.20

ARG PB_VERSION=0.23.4

RUN apk add --no-cache unzip ca-certificates wget && \
    wget -q "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip" \
         -O /tmp/pb.zip && \
    unzip /tmp/pb.zip pocketbase -d /pb/ && \
    rm /tmp/pb.zip && \
    chmod +x /pb/pocketbase && \
    apk del unzip wget

COPY pb_public/     /pb/pb_public/
COPY pb_migrations/ /pb/pb_migrations/

EXPOSE 8080

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080", "--dir=/pb/pb_data"]
