<p align="center">
  <br />
  <img
    width="300"
    src="./assets/logo.png"
    alt="Ramen"
  />
</p>

<h2 align="center">
Ramen (ラーメン)
</h2>
<h4 align="center">
Backend API for <a href"https://itmc.i.moneyforward.com/" target="_blank">Accountify</a>
</h4>
<p align="center">
  Made with <3 by <a href="https://app.slack.com/client/T02D9RVN1/C019KFU6C0N" target="_blank">Dylan
  </a>
</p>

## Setup

Please install [Docker Desktop](https://docs.docker.com/desktop/mac/install/) first

```bash
# Start database
$ docker-compose up -d ramen_mysql

# Setup local env variables
$ cp .env.example .env

# Install dependencies
$ yarn install

# Migrate database
$ yarn migration:run

# Seed master data
$ yarn migration:seed:run
```

## Development

### Start server

Quick start up

```bash
$ yarn start:dev
```

If you use VSCode and want to use _breakpoint_ for debugging, start server using `F5` instead.

### Refs

- Framework: [NestJS](https://nestjs.com/) + [TypeORM](https://typeorm.io/)
- Read: [Style guide](./STYLE_GUIDE.md)
- Read: [Database schema](./docs/db-schema/README.md)
- Read: [Database schema MermaidJS](./docs/db-schema-mermaidjs/README.md)
- Read: [Development docs](./docs/README.md)

### Tips

If you are using VSCode, install the following extensions to help with development:

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) (must-have)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) (must-have)
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)

To regenerate database docs, install [tbls](https://github.com/k1LoW/tbls) and run `tbls doc --force`
