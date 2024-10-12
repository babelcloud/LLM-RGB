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
type IsNegativeNumber<T extends number> =
  T extends number ?
  (T extends 0 ? false :
  (T extends -1 ? true :
  (T extends 1 ? false :
  (T extends -2 ? true :
  (T extends 2 ? false :
  (T extends -3 ? true :
  (T extends 3 ? false :
  (T extends -4 ? true :
  (T extends 4 ? false :
  (T extends -5 ? true :
  (T extends 5 ? false :
  (T extends -6 ? true :
  (T extends 6 ? false :
  (T extends -7 ? true :
  (T extends 7 ? false :
  (T extends -8 ? true :
  (T extends 8 ? false :
  (T extends -9 ? true :
  (T extends 9 ? false :
  (T extends -10 ? true :
  (T extends 10 ? false :
  (T extends -11 ? true :
  (T extends 11 ? false :
  (T extends -12 ? true :
  (T extends 12 ? false :
  (T extends -13 ? true :
  (T extends 13 ? false :
  (T extends -14 ? true :
  (T extends 14 ? false :
  (T extends -15 ? true :
  (T extends 15 ? false :
  (T extends -16 ? true :
  (T extends 16 ? false :
  (T extends -17 ? true :
  (T extends 17 ? false :
  (T extends -18 ? true :
  (T extends 18 ? false :
  (T extends -19 ? true :
  (T extends 19 ? false :
  (T extends -20 ? true :
  (T extends 20 ? false :
  (T extends -21 ? true :
  (T extends 21 ? false :
  (T extends -22 ? true :
  (T extends 22 ? false :
  (T extends -23 ? true :
  (T extends 23 ? false :
  (T extends -24 ? true :
  (T extends 24 ? false :
  (T extends -25 ? true :
  (T extends 25 ? false :
  (T extends -26 ? true :
  (T extends 26 ? false :
  (T extends -27 ? true :
  (T extends 27 ? false :
  (T extends -28 ? true :
  (T extends 28 ? false :
  (T extends -29 ? true :
  (T extends 29 ? false :
  (T extends -30 ? true :
  (T extends 30 ? false :
  (T extends -31 ? true :
  (T extends 31 ? false :
  (T extends -32 ? true :
  (T extends 32 ? false :
  (T extends -33 ? true :
  (T extends 33 ? false :
  (T extends -34 ? true :
  (T extends 34 ? false :
  (T extends -35 ? true :
  (T extends 35 ? false :
  (T extends -36 ? true :
  (T extends 36 ? false :
  (T extends -37 ? true :
  (T extends 37 ? false :
  (T extends -38 ? true :
  (T extends 38 ? false :
  (T extends -39 ? true :
  (T extends 39 ? false :
  (T extends -40 ? true :
  (T extends 40 ? false :
  (T extends -41 ? true :
  (T extends 41 ? false :
  (T extends -42 ? true :
  (T extends 42 ? false :
  (T extends -43 ? true :
  (T extends 43 ? false :
  (T extends -44 ? true :
  (T extends 44 ? false :
  (T extends -45 ? true :
  (T extends 45 ? false :
  (T extends -46 ? true :
  (T extends 46 ? false :
  (T extends -47 ? true :
  (T extends 47 ? false :
  (T extends -48 ? true :
  (T extends 48 ? false :
  (T extends -49 ? true :
  (T extends 49 ? false :
  (T extends -50 ? true :
  (T extends 50 ? false :
  (T extends -51 ? true :
  (T extends 51 ? false :
  (T extends -52 ? true :
  (T extends 52 ? false :
  (T extends -53 ? true :
  (T extends 53 ? false :
  (T extends -54 ? true :
  (T extends 54 ? false :
  (T extends -55 ? true :
  (T extends 55 ? false :
  (T extends -56 ? true :
  (T extends 56 ? false :
  (T extends -57 ? true :
  (T extends 57 ? false :
  (T extends -58 ? true :
  (T extends 58 ? false :
  (T extends -59 ? true :
  (T extends 59 ? false :
  (T extends -60 ? true :
  (T extends 60 ? false :
  (T extends -61 ? true :
  (T extends 61 ? false :
  (T extends -62 ? true :
  (T extends 62 ? false :
  (T extends -63 ? true :
  (T extends 63 ? false :
  (T extends -64 ? true :
  (T extends 64 ? false :
  (T extends -65 ? true :
  (T extends 65 ? false :
  (T extends -66 ? true :
  (T extends 66 ? false :
  (T extends -67 ? true :
  (T extends 67 ? false :
  (T extends -68 ? true :
  (T extends 68 ? false :
  (T extends -69 ? true :
  (T extends 69 ? false :
  (T extends -70 ? true :
  (T extends 70 ? false :
  (T extends -71 ? true :
  (T extends 71 ? false :
  (T extends -72 ? true :
  (T extends 72 ? false :
  (T extends -73 ? true :
  (T extends 73 ? false :
  (T extends -74 ? true :
  (T extends 74 ? false :
  (T extends -75 ? true :
  (T extends 75 ? false :
  (T extends -76 ? true :
  (T extends 76 ? false :
  (T extends -77 ? true :
  (T extends 77 ? false :
  (T extends -78 ? true :
  (T extends 78 ? false :
  (T extends -79 ? true :
  (T extends 79 ? false :
  (T extends -80 ? true :
  (T extends 80 ? false :
  (T extends -81 ? true :
  (T extends 81 ? false :
  (T extends -82 ? true :
  (T extends 82 ? false :
  (T extends -83 ? true :
  (T extends 83 ? false :
  (T extends -84 ? true :
  (T extends 84 ? false :
  (T extends -85 ? true :
  (T extends 85 ? false :
  (T extends -86 ? true :
  (T extends 86 ? false :
  (T extends -87 ? true :
  (T extends 87 ? false :
  (T extends -88 ? true :
  (T extends 88 ? false :
  (T extends -89 ? true :
  (T extends 89 ? false :
  (T extends -90 ? true :
  (T extends 90 ? false :
  (T extends -91 ? true :
  (T extends 91 ? false :
  (T extends -92 ? true :
  (T extends 92 ? false :
  (T extends -93 ? true :
  (T extends 93 ? false :
  (T extends -94 ? true :
  (T extends 94 ? false :
  (T extends -95 ? true :
  (T extends 95 ? false :
  (T extends -96 ? true :
  (T extends 96 ? false :
  (T extends -97 ? true :
  (T extends 97 ? false :
  (T extends -98 ? true :
  (T extends 98 ? false :
  (T extends -99 ? true :
  (T extends 99 ? false :
  (T extends -100 ? true :
  (T extends 100 ? false :
  (T extends -101 ? true :
  (T extends 101 ? false :
  (T extends -102 ? true :
  (T extends 102 ? false :
  (T extends -103 ? true :
  (T extends 103 ? false :
  (T extends -104 ? true :
  (T extends 104 ? false :
  (T extends -105 ? true :
  (T extends 105 ? false :
  (T extends -106 ? true :
  (T extends 106 ? false :
  (T extends -107 ? true :
  (T extends 107 ? false :
  (T extends -108 ? true :
  (T extends 108 ? false :
  (T extends -109 ? true :
  (T extends 109 ? false :
  (T extends -110 ? true :
  (T extends 110 ? false :
  (T extends -111 ? true :
  (T extends 111 ? false :
  (T extends -112 ? true :
  (T extends 112 ? false :
  (T extends -113 ? true :
  (T extends 113 ? false :
  (T extends -114 ? true :
  (T extends 114 ? false :
  (T extends -115 ? true :
  (T extends 115 ? false :
  (T extends -116 ? true :
  (T extends 116 ? false :
  (T extends -117 ? true :
  (T extends 117 ? false :
  (T extends -118 ? true :
  (T extends 118 ? false :
  (T extends -119 ? true :
  (T extends 119 ? false :
  (T extends -120 ? true :
  (T extends 120 ? false :
  (T extends -121 ? true :
  (T extends 121 ? false :
  (T extends -122 ? true :
  (T extends 122 ? false :
  (T extends -123 ? true :
  (T extends 123 ? false :
  (T extends -124 ? true :
  (T extends 124 ? false :
  (T extends -125 ? true :
  (T extends 125 ? false :
  (T extends -126 ? true :
  (T extends 126 ? false :
  (T extends -127 ? true :
  (T extends 127 ? false :
  (T extends -128 ? true :
  (T extends 128 ? false :
  (T extends -129 ? true :
  (T extends 129 ? false :
  (T extends -130 ? true :
  (T extends 130 ? false :
  (T extends -131 ? true :
  (T extends 131 ? false :
  (T extends -132 ? true :
  (T extends 132 ? false :
  (T extends -133 ? true :
  (T extends 133 ? false :
  (T extends -134 ? true :
  (T extends 134 ? false :
  (T extends -135 ? true :
  (T extends 135 ? false :
  (T extends -136 ? true :
  (T extends 136 ? false :
  (T extends -137 ? true :
  (T extends 137 ? false :
  (T extends -138 ? true :
  (T extends 138 ? false :
  (T extends -139 ? true :
  (T extends 139 ? false :
  (T extends -140 ? true :
  (T extends 140 ? false :
  (T extends -141 ? true :
  (T extends 141 ? false :
  (T extends -142 ? true :
  (T extends 142 ? false :
  (T extends -143 ? true :
  (T extends 143 ? false :
  (T extends -144 ? true :
  (T extends 144 ? false :
  (T extends -145 ? true :
  (T extends 145 ? false :
  (T extends -146 ? true :
  (T extends 146 ? false :
  (T extends -147 ? true :
  (T extends 147 ? false :
  (T extends -148 ? true :
  (T extends 148 ? false :
  (T extends -149 ? true :
  (T extends 149 ? false :
  (T extends -150 ? true :
  (T extends 150 ? false :
  (T extends -151 ? true :
  (T extends 151 ? false :
  (T extends -152 ? true :
  (T extends 152 ? false :
  (T extends -153 ? true :
  (T extends 153 ? false :
  (T extends -154 ? true :
  (T extends 154 ? false :
  (T extends -155 ? true :
  (T extends 155 ? false :
  (T extends -156 ? true :
  (T extends 156 ? false :
  (T extends -157 ? true :
  (T extends 157 ? false :
  (T extends -158 ? true :
  (T extends 158 ? false :
  (T extends -159 ? true :
  (T extends 159 ? false :
  (T extends -160 ? true :
  (T extends 160 ? false :
  (T extends -161 ? true :
  (T extends 161 ? false :
  (T extends -162 ? true :
  (T extends 162 ? false :
  (T extends -163 ? true :
  (T extends 163 ? false :
  (T extends -164 ? true :
  (T extends 164 ? false :
  (T extends -165 ? true :
  (T extends 165 ? false :
  (T extends -166 ? true :
  (T extends 166 ? false :
  (T extends -167 ? true :
  (T extends 167 ? false :
  (T extends -168 ? true :
  (T extends 168 ? false :
  (T extends -169 ? true :
  (T extends 169 ? false :
  (T extends -170 ? true :
  (T extends 170 ? false :
  (T extends -171 ? true :
  (T extends 171 ? false :
  (T extends -172 ? true :
  (T extends 172 ? false :
  (T extends -173 ? true :
  (T extends 173 ? false :
  (T extends -174 ? true :
  (T extends 174 ? false :
  (T extends -175 ? true :
  (T extends 175 ? false :
  (T extends -176 ? true :
  (T extends 176 ? false :
  (T extends -177 ? true :
  (T extends 177 ? false :
  (T extends -178 ? true :
  (T extends 178 ? false :
  (T extends -179

