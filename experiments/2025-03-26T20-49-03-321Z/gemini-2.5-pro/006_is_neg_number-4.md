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

// This type checks if T is a negative number literal.
// It returns true for negative literals, false for positive or zero literals.
// It returns never for the general 'number' type and for union types.
type IsNegativeNumber<T extends number> =
  // 1. Check if T is the general 'number' type. This is done using the
  //    standard 'number extends T' check. If T is 'number', number extends T is true.
  //    If T is a specific literal like 1, number extends 1 is false.
  number extends T ? never
  // 2. If T is not 'number', convert T to its string representation S using template literals.
  //    If T is a literal (e.g., -1), S will be a single string ("-1").
  //    If T is a union (e.g., -1 | -2), S will be a union of strings ("-1" | "-2").
  : `${T}` extends infer S
    // 3. Check if the resulting string type S is a union of strings.
    //    This uses an inline union check pattern: it compares the distributed constituents
    //    of S (captured as Item) back to the original S. If they differ in a specific way,
    //    it indicates S was a union.
    //    `(S extends S ? ... : never)` ensures distribution over S if it's a union.
    //    `([S extends infer Item ? Item : never] extends [S] ? false : true)` compares
    //    the distributed item `Item` (wrapped in a tuple) with the original `S` (wrapped in a tuple).
    //    `[OriginalUnion] extends [Item]` will be false if OriginalUnion contains more than Item.
    //    If this whole check results in `true`, it means S was a union.
    ? (S extends S ? ([S extends infer Item ? Item : never] extends [S] ? false : true) : never) extends true
      // 4. If S is a union string (meaning T was a union of numbers), return never.
      ? never
      // 5. If S is not a union string (meaning T was a single number literal),
      //    check if the string S starts with a hyphen '-'.
      : S extends `-${string}` ? true : false
    // 6. This path should theoretically be unreachable because T is constrained to number,
    //    and `${T}` should always produce a string type (or never if T is never).
    : never;

```

