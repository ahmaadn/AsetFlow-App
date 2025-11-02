# My Utility Package

A utility package designed for use in both Nuxt and Express applications. This package provides a set of utility functions for string, array, and object manipulation, along with TypeScript types for enhanced type safety.

## Installation

To install the package, use npm or yarn:

```bash
npm install my-utility-package
```

or

```bash
yarn add my-utility-package
```

## Usage

### Importing Utilities

You can import the utilities directly from the package:

```typescript
import { capitalize, unique } from 'my-utility-package';
```

### String Utilities

- **capitalize**: Capitalizes the first letter of a string.
- **trim**: Removes whitespace from both ends of a string.
- **toLowerCase**: Converts a string to lowercase.

### Array Utilities

- **unique**: Returns an array of unique values.
- **flatten**: Flattens a nested array.
- **chunk**: Splits an array into chunks of a specified size.

### Object Utilities

- **merge**: Merges two or more objects.
- **deepClone**: Creates a deep clone of an object.
- **pick**: Creates a new object with only the specified keys.

## TypeScript Support

This package is written in TypeScript and provides type definitions for all utility functions. You can use it seamlessly in your TypeScript projects.

## Running Tests

To run the tests, use the following command:

```bash
npm test
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.