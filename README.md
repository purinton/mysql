# [![Purinton Dev](https://purinton.us/logos/brand.png)](https://discord.gg/QSBxQnX7PF)

## @purinton/mysql [![npm version](https://img.shields.io/npm/v/@purinton/mysql.svg)](https://www.npmjs.com/package/@purinton/mysql)[![license](https://img.shields.io/github/license/purinton/mysql.svg)](LICENSE)[![build status](https://github.com/purinton/mysql/actions/workflows/nodejs.yml/badge.svg)](https://github.com/purinton/mysql/actions)

> A simple, dependency-injectable MySQL connection pool utility for Node.js, supporting both ESM and CommonJS.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [ESM Example](#esm-example)
  - [CommonJS Example](#commonjs-example)
- [API](#api)
- [TypeScript](#typescript)
- [License](#license)

## Features

- Simple async function to create a MySQL connection pool
- Supports both ESM and CommonJS
- Dependency injection for testability (mock MySQL, logger, or env)
- TypeScript type definitions included
- Helpful error logging

## Installation

```bash
npm install @purinton/mysql
```

## Usage

### ESM Example

```js
import { createDb } from '@purinton/mysql';

(async () => {
  const db = await createDb();
  // Use db.query, db.execute, etc.
  await db.end();
})();
```

### CommonJS Example

```js
const { createDb } = require('@purinton/mysql');

(async () => {
  const db = await createDb();
  // Use db.query, db.execute, etc.
  await db.end();
})();
```

## API

### createDb(options?)

Creates and returns a MySQL connection pool.

**Parameters:**

- `options.env` (object, optional): Environment variables (default: `process.env`)
- `options.mysqlLib` (object, optional): mysql2/promise module (default: dynamic import/require)
- `options.logger` (object, optional): Logger instance (default: `@purinton/log`)

**Returns:**

- `Promise<Pool>`: A MySQL connection pool instance

**Throws:**

- If required environment variables are missing
- If pool creation fails

**Example:**

```js
const db = await createDb({
  env: {
    MYSQL_HOST: 'localhost',
    MYSQL_USERNAME: 'root',
    MYSQL_PASSWORD: 'password',
    MYSQL_DATABASE: 'test',
  },
  mysqlLib: require('mysql2/promise'), // or import('mysql2/promise') for ESM
  logger: console,
});
```

## TypeScript

Type definitions are included:

```ts
export interface CreateDbOptions {
  env?: Record<string, string>;
  mysqlLib?: any;
  logger?: any;
}

export function createDb(options?: CreateDbOptions): Promise<any>;
```

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://purinton.us/logos/discord_96.png)](https://discord.gg/QSBxQnX7PF)[![Purinton Dev](https://purinton.us/logos/purinton_96.png)](https://discord.gg/QSBxQnX7PF)

**[Purinton Dev on Discord](https://discord.gg/QSBxQnX7PF)**

## License

[MIT © 2025 Russell Purinton](LICENSE)

## Links

- [GitHub](https://github.com/purinton/mysql)
- [npm](https://www.npmjs.com/package/@purinton/mysql)
- [Discord](https://discord.gg/QSBxQnX7PF)
