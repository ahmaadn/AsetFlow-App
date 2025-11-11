# @asetflow/logger

Logger package untuk Express services. Dibangun dengan Winston dan mendukung daily log rotation.

## Installation

```bash
pnpm install
```

## Usage

### Basic Usage

```typescript
import { logger } from '@asetflow/logger';

// Log messages
logger.info('Application started');
logger.warn('This is a warning');
logger.error('An error occurred', { userId: 123, action: 'login' });
logger.debug('Debug information');
logger.http('HTTP request received');
```

### Custom Logger Instance

```typescript
import { Logger } from '@asetflow/logger';

const customLogger = new Logger({
  level: 'debug',
  enableConsole: true,
  enableFile: true,
  logDir: 'custom-logs',
  datePattern: 'YYYY-MM-DD-HH',
  maxFiles: '30d',
  maxSize: '50m',
});

customLogger.info('Custom logger message');
```

### Configuration Options

```typescript
interface LoggerConfig {
  level?: 'error' | 'warn' | 'info' | 'http' | 'debug'; // Default: 'info'
  silent?: boolean; // Default: false
  enableConsole?: boolean; // Default: true
  enableFile?: boolean; // Default: true
  logDir?: string; // Default: 'logs'
  datePattern?: string; // Default: 'YYYY-MM-DD'
  maxFiles?: string; // Default: '14d' (14 days)
  maxSize?: string; // Default: '20m' (20 megabytes)
}
```

## Log Levels

- `error`: Error messages
- `warn`: Warning messages
- `info`: Informational messages
- `http`: HTTP request/response logging
- `debug`: Debug information

## File Structure

File logs disimpan dengan daily rotation:

- `error-YYYY-MM-DD.log`: Error-level logs saja
- `combined-YYYY-MM-DD.log`: Semua logs

File otomatis di-rotate berdasarkan `maxFiles` dan `maxSize`.

## Build

```bash
pnpm build
```

## License

MIT
