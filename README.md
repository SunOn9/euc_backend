# Backend EUC

## NOTE: For Linux or MacOS. Window need use WSL

### Run docker ENV

`bash script/setup_docker.sh`

### Create Database

`echo "CREATE DATABASE <YOUR_DATABASE_NAME> CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" | docker exec -i mysql /usr/bin/mysql -u root --password=<YOUR_PASSWORD>
` or ...

### Install yarn & nestjs

#### Yarn : https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable

Via NPM : `npm install --global yarn`

#### NestJS : https://docs.nestjs.com/

Via NPM : `npm i -g @nestjs/cli`

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

`yarn gen-proto` or `bash script/generate_proto.sh`

### Env

`Copy file 'env.example' to new file name '.env'`
`Add SECRET`
`Add Database Name, Password, Username , ...`

### Data

`Open folder data`
`Copy file 'sessions.example.json' to new file name 'sessions.json'`

### RUN

`yarn start:dev`

## License

Nest is [MIT licensed](LICENSE).
