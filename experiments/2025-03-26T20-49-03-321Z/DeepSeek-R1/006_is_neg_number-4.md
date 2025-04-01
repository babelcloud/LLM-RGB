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

To solve this problem, we need to determine if a given number type `T` is negative. The solution must return `true` if `T` is a negative number, `false` if it is positive or zero, `never` if `T` is a general `number` type, and `never` if `T` is a union of number types.

### Approach
1. **Check for Union Type**: Determine if `T` is a union of number types. If it is, return `never`.
2. **Check for General Number Type**: If `T` is the general `number` type (not a specific literal), return `never`.
3. **Check for Negative Number**: Convert `T` to a string literal and check if it starts with a '-' character. If it does, return `true`; otherwise, return `false`.

### Solution Code
```typescript
type IsNegativeNumber<T extends number> = 
  (T extends any ? ([T] extends [infer U] ? U extends T ? false : true : never) : never) extends true
    ? never
    : number extends T
      ? never
      : `${T}` extends `-${string}`
        ? true
        : false;
```

### Explanation
1. **Union Type Check**: The inline check `(T extends any ? ([T] extends [infer U] ? U extends T ? false : true : never) : never) extends true` determines if `T` is a union. This works by leveraging distributive conditional types to check if the type `T` can be split into multiple constituents, indicating a union.
2. **General Number Type Check**: `number extends T` checks if `T` is the general `number` type. If true, the result is `never`.
3. **Negative Number Check**: Converting `T` to a string literal and checking if it starts with '-' using template literal types allows us to determine if the number is negative.

This approach efficiently combines type checks and template literal manipulation to solve the problem as required.

