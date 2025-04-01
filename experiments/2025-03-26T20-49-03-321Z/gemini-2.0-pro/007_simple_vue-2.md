# 007_simple_vue

## Prompt

/*
  6 - Simple Vue
  -------
  by Anthony Fu (@antfu) #hard #this #application #vue

  ### Question

  Implement a simpiled version of a Vue-like typing support.

  By providing a function name `SimpleVue` (similar to `Vue.extend` or `defineComponent`), it should properly infer the `this` type inside computed and methods.

  In this challenge, we assume that SimpleVue take an Object with `data`, `computed` and `methods` fields as it's only argument,

  - `data` is a simple function that returns an object that exposes the context `this`, but you won't be accessible to other computed values or methods.

  - `computed` is an Object of functions that take the context as `this`, doing some calculation and returns the result. The computed results should be exposed to the context as the plain return values instead of functions.

  - `methods` is an Object of functions that take the context as `this` as well. Methods can access the fields exposed by `data`, `computed` as well as other `methods`. The different between `computed` is that `methods` exposed as functions as-is.

  The type of `SimpleVue`'s return value can be arbitrary.

  ```ts
  const instance = SimpleVue({
    data() {
      return {
        firstname: 'Type',
        lastname: 'Challenges',
        amount: 10,
      }
    },
    computed: {
      fullname() {
        return this.firstname + ' ' + this.lastname
      }
    },
    methods: {
      hi() {
        alert(this.fullname.toLowerCase())
      }
    }
  })
  ```

  > View on GitHub: https://tsch.js.org/6
*/

/* _____________ Your Code Here _____________ */

declare function SimpleVue(options: any): any

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

SimpleVue({
  data() {
    // @ts-expect-error
    this.firstname
    // @ts-expect-error
    this.getRandom()
    // @ts-expect-error
    this.data()

    return {
      firstname: 'Type',
      lastname: 'Challenges',
      amount: 10,
    }
  },
  computed: {
    fullname() {
      return `${this.firstname} ${this.lastname}`
    },
  },
  methods: {
    getRandom() {
      return Math.random()
    },
    hi() {
      alert(this.amount)
      alert(this.fullname.toLowerCase())
      alert(this.getRandom())
    },
    test() {
      const fullname = this.fullname
      const cases: [Expect<Equal<typeof fullname, string>>] = [] as any
    },
  },
})

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/6/answer
  > View solutions: https://tsch.js.org/6/solutions
  > More Challenges: https://tsch.js.org
*/

Code of the type ONLY, no explanations.

## Response

```typescript
/* _____________ Your Code Here _____________ */

// Helper type to extract the return types from the computed properties object.
// It maps over the keys of the computed object `C`.
// For each key `P`, if `C[P]` is a function, it infers its return type `R`.
// Otherwise, it resolves to `never` (though this case shouldn't ideally happen
// if `C` is correctly typed).
type GetComputed<C> = {
  [P in keyof C]: C[P] extends (...args: any) => infer R ? R : never;
};

// Declare the signature of the SimpleVue function.
// It uses generics D, C, M to represent the types inferred from the
// `data`, `computed`, and `methods` options respectively.
// Default types `{}` are provided for cases where an option is omitted.
declare function SimpleVue<
  D = {},
  C = {},
  M = {}
>(
  // The `options` object argument.
  options: {
    // `data`: An optional function. `this` inside this function is typed as `void`
    // to prevent access to the instance context before it's fully formed.
    // It returns an object of type `D`.
    data?: (this: void) => D;

    // `computed`: An optional object `C`. `ThisType<D>` is used to specify that
    // `this` inside each computed function should refer to the properties returned
    // by the `data` function (type `D`).
    computed?: C & ThisType<D>;

    // `methods`: An optional object `M`. `ThisType<D & GetComputed<C> & M>` specifies
    // that `this` inside each method function should refer to the combined context
    // including data properties (`D`), evaluated computed values (`GetComputed<C>`),
    // and other methods (`M`).
    methods?: M &

