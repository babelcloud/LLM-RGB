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

```typescript
/* _____________ Your Code Here _____________ */

type IsNegativeNumber<T extends number> =
  // Check if T is the generic `number` type. `number extends T` is true if T is `number`.
  number extends T ? never :
  // Check if T is a union type.
  // We use the property that for a non-union type T, [T] is assignable to [UnionToIntersection<T>],
  // but for a union type T (like A | B), [A | B] is usually not assignable to [UnionToIntersection<A | B>] (which often evaluates to `never`).
  // `UnionToIntersection<T>` is defined as `(T extends any ? (k: T) => void : never) extends ((k: infer I) => void) ? I : never`.
  // The tuple `[T]` prevents distribution of the `extends` check over `T` if `T` is a union.
  [T] extends [((T extends any ? (k: T) => void : never) extends ((k: infer I) => void) ? I : never)]
    // If the condition is true, T is NOT a union. Proceed to check its sign.
    ? `${T}` extends `-${string}` // Convert the number literal T to a string literal and check if it starts with '-'.
      ? true // If it starts with '-', it's a negative number.
      : false // Otherwise, it's a positive number or zero.
    // If the condition is false, T IS a union type. Return never.
    : never;
```

