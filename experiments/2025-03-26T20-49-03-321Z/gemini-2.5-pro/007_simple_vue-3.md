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

// Helper type to extract the return types from an object of functions (like computed properties).
// It maps an object like { computedKey: () => ReturnType } to { computedKey: ReturnType }.
type ComputedGetters<C> = {
  [K in keyof C]: C[K] extends (...args: any[]) => infer R ? R : never;
};

// Defines the structure and `this` context typing for the options object passed to `SimpleVue`.
// D: The type of the object returned by the `data` function.
// C: The type of the `computed` object (an object where values are functions).
// M: The type of the `methods` object (an object where values are functions).
type SimpleVueOptions<D, C, M> = {
  // The `data` function returns an object of type D.
  // `this` inside `data` is `unknown` because it cannot access component instance properties.
  data?(this: unknown): D;

  // The `computed` object contains functions.
  // `this` inside computed functions refers to the data properties (D).
  // Based on the problem description, computed properties access data, but not other computed or methods.
  computed?: C & ThisType<D>;

  // The `methods` object contains functions.
  // `this` inside methods refers to the combined instance context:
  // data properties (D), evaluated computed property values (ComputedGetters<C>), and other methods (M).
  methods?: M & ThisType<D & ComputedGetters<C> & M>;

  // This ensures that the `SimpleVue` options object itself doesn't have a specific `this` context.
} & ThisType<never>;

// Defines the type of the instance returned by the `SimpleVue` function.
// The instance combines properties from `data` (D), the evaluated values of `computed` properties (ComputedGetters<C>),
// and the `methods` functions themselves (M).
type SimpleVueInstance<D, C, M> = D & ComputedGetters<C> & M;

// Declares the `SimpleVue` function signature.
// It takes an `options` object conforming to `SimpleVueOptions` and returns an instance of type `SimpleVueInstance`.
// The generic types D, C, and M are inferred by TypeScript based on the structure of the `options` argument provided.
declare function SimpleVue<D, C, M>(options: SimpleVueOptions<D, C, M>): SimpleVueInstance<D, C, M>;
```

