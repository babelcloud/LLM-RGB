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

// Helper type to convert a union to an intersection
// Source: https://stackoverflow.com/a/50375286/884453
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

// Helper type to check if a type T is a union type
// If T is a union (e.g., 1 | 2), UnionToIntersection<T> becomes their intersection (e.g., 1 & 2 which is never).
// If T is not a union (e.g., 1), UnionToIntersection<T> is T itself (1).
// A type T is a union if T is not assignable to UnionToIntersection<T> (when wrapped in a tuple to prevent distribution).
// Note: This check correctly identifies `boolean` (true | false) as a union.
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

type IsNegativeNumber<T extends number> =
  // 1. Check if T is the broad 'number' type. Return 'never' if it is.
  //    `number extends T` is true only for T = `number` or T = `any`.
  //    We wrap T in a tuple `[T]` in the comparison `[number] extends [T]` to prevent distribution
  //    if T were a union like `1 | number`, although `number extends T` would already handle that.
  //    Using `number extends T` is generally simpler and sufficient for detecting the `number` type.
  number extends T ? never :

  // 2. Check if T is 'never'. Return 'never' if it is.
  [T] extends [never] ? never :

  // 3. Check if T is a union of number literals (e.g., -1 | -2). Return 'never' if it is.
  IsUnion<T> extends true ? never :

  // 4. At this point, T is confirmed to be a single, specific number literal (e.g., 0, 1, -1, 1.5, -2.5).
  //    Check if T is 0. Return 'false' if it is.
  T extends 0 ? false :

  // 5. Convert the number literal T to its string representation `${T}`.
  //    Check if the string starts with a minus sign '-'.
  //    If it does, T is negative. Return 'true'.
  //    If it doesn't, T is positive. Return 'false'.
  `${T}` extends `-${string}` ? true : false;

```

