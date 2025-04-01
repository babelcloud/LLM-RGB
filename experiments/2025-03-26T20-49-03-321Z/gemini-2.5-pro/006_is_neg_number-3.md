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
    // Use `[T] extends [number]` to ensure T is number-related and prevent distribution over unions in subsequent checks.
    [T] extends [number]
        // Check if T is the general `number` type. `number extends T` is true if T is `number` (or `any`).
        ? number extends T
            ? never // Rule out the generic `number` type.
            : [T] extends [ // Check if T is a union type using the UnionToIntersection pattern.
                             // `[T] extends [UnionToIntersection<T>]` is false if T is a union of distinct types.
                (
                    // Inlined UnionToIntersection<T>: Converts a union type `A | B` into an intersection type `A & B`.
                    // For non-union types or `never`, it results in the type itself. For `any`, it results in `any`.
                    (T extends unknown ? (k: T) => void : never) extends ((k: infer I) => void) ? I : never
                )
              ]
                // If `[T] extends [UnionToIntersection<T>]` is true, T is NOT a union (or it's `never` or `any`).
                ? string extends `${T}` // Check if the template literal `${T}` resolves to the wide `string` type.
                                       // This happens for non-literal number types like branded types or complex intersections involving `number`.
                    ? never // If `${T}` is `string`, T is not a simple numeric literal we can check the sign of.
                    // If `${T}` results in a specific string literal (not the wide `string` type), T is a simple numeric literal.
                    : `${T}` extends `-${string}` // Check if the string representation starts with a hyphen '-'.
                        ? true // If yes, T is a negative number literal.
                        : false // If no, T is a non-negative number literal (0 or positive).
                // If `[T] extends [UnionToIntersection<T>]` is false, T IS a union type.
                : never // Rule out union types.
        // This branch handles cases where the initial `[T] extends [number]` fails.
        // Given the constraint `T extends number`, this typically only happens if T is `never`.
        : never;

```

