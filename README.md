# FPipes (Functional Pipes)

> FPipes is a utility library that provides a way to chain synchronous and asynchronous functions in a readable manner. It simplifies the flow of data through a series of functions, making your code more readable and maintainable.

This is heavily inspired on TC39 Pipe Operator proposal, and may be deprecated in the future if it gets approved

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Basic Usage](#basic-usage)
  - [Chaining Functions](#chaining-functions)
  - [Working with Promises](#working-with-promises)
  - [Behavior of Pipes with Promises](#behavior-of-pipes-with-promises)
- [License](#license)

## Installation

To install FPipes, run the following command:

```shell
npm install --save fpipes
```

## Usage

### Basic Usage

To start a pipe, use the `F.pipe()` function:

```typescript
import { F } from "fpipes"

const initialValue = 42

const pipe = F.pipe(initialValue)
```

To retrieve the final value from a pipe, use the `value()` method:

```typescript
const result = pipe.value()
console.log(result) // 42
```

### Chaining Functions

You can chain functions using the `pipe()` method:

```typescript
import { F } from "fpipes"

const double = (value: number) => value * 2
const addTen = (value: number) => value + 10

const result = F.pipe(5)
  .pipe(double)
  .pipe(addTen)
  .value()

console.log(result) // 20
```

### Working with Promises

FPipes supports chaining functions that return promises:

```typescript
import { F } from "fpipes"

const asyncDouble = async (value: number) => value * 2

const result = await F.pipe(5)
  .pipe(asyncDouble)
  .value()

console.log(result) // 10
```

### Behavior of Pipes with Promises

When you add a function that returns a promise to the pipe chain, the entire pipe chain is treated as a promise. This means that you must use the `await` keyword or the `then()` method on the final value to access the result. All subsequent functions in the pipe chain will also receive the resolved value of the previous promise.

```typescript
import { F } from "fpipes"

const asyncDouble = async (value: number) => value * 2
const asyncAddTen = async (value: number) => value + 10

const result = await F.pipe(5)
  .pipe(asyncDouble) // The result of this function is a promise.
  .pipe(asyncAddTen) // This function receives the resolved value of the previous promise.
  .value() // The final value of the pipe is also a promise.

console.log(result) // 20
```

If you mix synchronous and asynchronous functions in the pipe chain, the pipe will be treated as a promise from the point where the first promise is encountered.

```typescript
import { F } from "fpipes"

const double = (value: number) => value * 2
const asyncAddTen = async (value: number) => value + 10

const result = await F.pipe(5)
  .pipe(double) // This function returns a value.
  .pipe(asyncAddTen) // This function returns a promise, so the whole chain is treated as a promise from this point on.
  .value() // The final value of the pipe is a promise.

console.log(result) // 20
```
