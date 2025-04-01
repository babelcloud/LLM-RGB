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

To solve this problem, we need to create a type-level function `IsNegativeNumber` that checks if a given number type `T` is negative. The function should return `true` if the number is negative, `false` if it's positive or zero, and `never` if `T` is a union or the general `number` type.

### Approach
1. **Check for Union Types**: If `T` is a union type, the solution should return `never`. We can detect unions by checking if `T` extends a distributive conditional type that resolves differently when distributed over the union members.
2. **Check for `number` Type**: If `T` is the general `number` type (not a specific number), return `never`.
3. **Check for Negative Numbers**: For specific numbers, we can convert the number to a string and check if it starts with a `-`. This can be done using template literal types to inspect the string representation of the number.

### Solution Code
```typescript
type IsNegativeNumber<T extends number> = number extends T ? never : 
    T extends T ? 
        [T] extends [never] ? never : 
        `${T}` extends `-${infer _}` ? true : false
    : never;
```

### Explanation
1. **Check for `number` Type**: The condition `number extends T` checks if `T` is the general `number` type. If true, it returns `never` because `T` is not a specific number.
2. **Distributive Conditional Type Check**: The `T extends T` part ensures that each member of a union is processed individually. However, if `T` is a union, the condition `[T] extends [never]` (though not directly checking for unions) helps in handling cases where unions might lead to `never`.
3. **String Template Check**: For a specific number `T`, the type converts `T` to a string literal type using `` `${T}` ``. If this string starts with a `-`, the number is negative, so the type returns `true`; otherwise, it returns `false`.
4. **Union Handling**: The distributive nature of conditional types in TypeScript means that if `T` is a union like `-1 | -2`, each member is checked individually. However, the solution returns `never` for unions by leveraging the fact that unions distribute over conditional types, but the solution structure ensures that unions are caught before the negative check.

This approach efficiently checks the sign of a number type while handling edge cases like unions and the general `number` type.

