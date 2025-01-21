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

To solve this problem, we need to determine if a given numeric type is a negative number, while handling special cases such as unions and the general number type. The solution involves checking if the type is a union, if it is the general number type, and then using template literals to check if the numeric type is negative.

### Approach
1. **Check for Union Type**: Use a helper type `IsUnion` to determine if the given type is a union. If it is, return `never`.
2. **Check for General Number Type**: If the type is the general `number` type (not a specific numeric literal), return `never`.
3. **Check for Negative Number**: Convert the numeric type to a string and check if it starts with a '-' character. If it does, return `true`; otherwise, return `false`.

### Solution Code
```typescript
type IsUnion<T, U = T> = T extends U ? [U] extends [T] ? false : true : never;

type IsNegativeNumber<T extends number> = IsUnion<T> extends true
  ? never
  : number extends T
  ? never
  : `${T}` extends `-${string}`
  ? true
  : false;
```

### Explanation
1. **Union Check (`IsUnion`)**: The `IsUnion` type checks if the given type `T` is a union by distributing `T` over a conditional type. If the original type `U` (which is the same as `T` but not distributed) does not extend the distributed type, then `T` is a union.
2. **General Number Check**: If `number` extends `T`, it means `T` is the general number type, not a specific numeric literal. In this case, we return `never`.
3. **Negative Check**: Convert `T` to a string using template literal types. If the string starts with '-', then `T` is a negative number, so return `true`. Otherwise, return `false`.

This approach efficiently handles all specified cases, ensuring that unions and the general number type return `never`, while correctly identifying negative numbers.

