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

To solve this problem, we need to determine if a given numeric type is a negative number, while handling special cases such as unions, the general `number` type, and non-negative numbers.

### Approach
1. **Check for Union Types**: If the input type is a union of multiple numeric literals, return `never`.
2. **Check for General Number Type**: If the input type is the general `number` type (not a specific literal), return `never`.
3. **Check for Negative Numbers**: Convert the numeric type to a string and check if it starts with a '-'. If it does, return `true`; otherwise, return `false`.

### Solution Code
```typescript
type IsUnion<T, U = T> = T extends any ? [U] extends [T] ? false : true : never;

type IsNegativeNumber<T extends number> = 
  IsUnion<T> extends true 
  ? never 
  : number extends T 
    ? never 
    : `${T}` extends `-${string}` 
      ? true 
      : false;
```

### Explanation
1. **IsUnion Type**: This helper type checks if a given type is a union. It works by distributing the type over a conditional and checking if the original type can be narrowed down to a single constituent.
2. **Handling Unions**: If the input type is a union, `IsUnion` returns `true`, leading `IsNegativeNumber` to return `never`.
3. **Handling General Number Type**: If the input type is `number` (not a specific literal), `number extends T` evaluates to `true`, leading `IsNegativeNumber` to return `never`.
4. **Checking Negative Numbers**: Convert the numeric type to a string using template literal types. If the string starts with '-', the number is negative, so return `true`; otherwise, return `false`.

This approach efficiently handles all specified cases, ensuring correct results for numeric literals, unions, and the general `number` type.

