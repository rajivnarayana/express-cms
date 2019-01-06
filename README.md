# Express CMS

This plugin to have admin CMS pages up and running quickly in your Express JS application.

## Installation

```shell
npm install express-cms
```

## Introduction

Admin managed pages are mounted by the `adminRouter` and public facing pages are mounted by `router`

```javascript
const express = require("express")
const app = express();
const {adminRouter : cmsAdminRouter, router : cmsRouter} = require("express-cms");

app.use('/', cmsRouter);
app.use('/admin/cms', cmsAdminRouter);

```
## Development

Start tsc watcher.
```bash
cd src
npm link
npm run plugin.tscwatch
```

To run demo

```bash
cd demo
npm link express-cms
node --preserve-symlinks main.js
```

## License

Apache License Version 2.0, January 2004
