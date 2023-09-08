# Backend EUC

### Run docker ENV

`bash script/setup_docker.sh`

### Create Database

`echo "CREATE DATABASE euc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" | docker exec -i mysql /usr/bin/mysql -u root --password=190501
`

### Install yarn & nestjs

`google.com`

### Install package

`yarn`

### Install protoc

#### Linux, using apt or apt-get, for example:

`apt install -y protobuf-compiler`

`protoc --version # Ensure compiler version is 3+`

#### MacOS, using Homebrew:

`brew install protobuf`

`protoc --version # Ensure compiler version is 3+`

### Build Proto

`yarn gen-proto`

### Env

`Copy file 'env.example' to new file name '.env'`

### RUN

`yarn start:dev`

## License

Nest is [MIT licensed](LICENSE).
