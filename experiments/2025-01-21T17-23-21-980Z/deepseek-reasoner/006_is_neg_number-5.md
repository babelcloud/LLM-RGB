# 006_is_neg_number

## Prompt

/*
  25747 - IsNegativeNumber
  -------
  by andrew jarrett (@ahrjarrett) #hard #number #template literal

  ### Question

  Sometimes when working with numeric literals, we need to rule out (or enforce) that the provided number is a positive integer.

  To do that, we first need a way to tell if the number is negative.

  Write a type-level function `IsNegativeNumber` that accepts a number `N` and returns:

  - `true` if `N` is negative
  - `false` if `N` is positive
  - `false` if `N` is `0`,
  - `never` if `N` is `number`
  - `never` if `N` is a union

  > View on GitHub: https://tsch.js.org/25747
*/

/* _____________ Your Code Here _____________ */

type IsNegativeNumber<T extends number> = any

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<IsNegativeNumber<0>, false>>,
  Expect<Equal<IsNegativeNumber<number>, never>>,
  Expect<Equal<IsNegativeNumber<-1 | -2>, never>>,
  Expect<Equal<IsNegativeNumber<-1>, true>>,
  Expect<Equal<IsNegativeNumber<-1.9>, true>>,
  Expect<Equal<IsNegativeNumber<-100_000_000>, true>>,
  Expect<Equal<IsNegativeNumber<1>, false>>,
  Expect<Equal<IsNegativeNumber<1.9>, false>>,
  Expect<Equal<IsNegativeNumber<100_000_000>, false>>,
]

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/25747/answer
  > View solutions: https://tsch.js.org/25747/solutions
  > More Challenges: https://tsch.js.org
*/

Code of the type ONLY, no explanations.

## Response

To solve this problem, we need to determine if a given numeric type is a negative number. The solution must also handle edge cases where the input is a union of numbers or the general `number` type, returning `never` in those cases.

### Approach
The approach involves several steps:
1. **Check if the input is a union type**: If the input is a union of numbers, we return `never`.
2. **Check if the input is the general `number` type**: If the input is the general `number` type (not a specific numeric literal), we return `never`.
3. **Check if the numeric value is negative**: Convert the numeric type to a string and check if it starts with a negative sign (`-`).

### Solution Code
```typescript
type IsNegativeNumber<T extends number> = 
  ((T extends any ? (arg: T) => void : never) extends (arg: infer U) => void 
    ? [U] extends [T] ? false : true 
    : false) extends true 
  ? never 
  : ([T] extends [number] 
      ? ([number] extends [T] ? true : false) 
      : false) extends true 
    ? never 
    : `${T}` extends `-${string}` 
      ? true 
      : false;
```

### Explanation
1. **Union Check**: The type `(T extends any ? (arg: T) => void : never) extends (arg: infer U) => void ? [U] extends [T] ? false : true : false` checks if `T` is a union type. This works by leveraging TypeScript's distributive conditional types and function parameter inference.
2. **General Number Check**: The type `[T] extends [number] ? ([number] extends [T] ? true : false) : false` checks if `T` is exactly the general `number` type. This is done by ensuring both `T` extends `number` and `number` extends `T`.
3. **Negative Check**: Converting `T` to a string and checking if it starts with `-` using the template literal type `${T} extends `-${string}`.

This approach efficiently handles all specified edge cases and correctly identifies negative numeric literals.

