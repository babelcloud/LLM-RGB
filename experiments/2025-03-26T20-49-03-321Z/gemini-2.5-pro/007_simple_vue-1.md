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
// For an input object C like { prop1: () => number, prop2: () => string },
// ComputedValues<C> will produce { prop1: number, prop2: string }.
type ComputedValues<C> = {
  [K in keyof C]: C[K] extends (...args: any[]) => infer R ? R : never;
};

// Declare the main SimpleVue function signature.
// It uses generics to capture the types from the options object.
declare function SimpleVue<
  // D: Represents the type of the object returned by the `data` function. Defaults to an empty object.
  D = {},
  // C: Represents the type of the `computed` object.
  // It's constrained to ensure that its values are functions (`Record<string, Function>`). Defaults to an empty object.
  C extends Record<string, Function> = {},
  // M: Represents the type of the `methods` object.
  // It's constrained similarly to C. Defaults to an empty object.
  M extends Record<string, Function> = {}
>(
  // The 'options' object passed to SimpleVue.
  options: {
    // data: An optional function.
    // `this: void` indicates that `this` has no context inside the `data` function.
    // It returns an object of type D.
    data?(this: void): D;

    // computed: An optional object containing computed properties (functions).
    // `C & ThisType<D>` ensures that the object matches type C and
    // that `this` inside the computed functions refers to an object of type D (the data properties).
    computed?: C & ThisType<D>;

    // methods: An optional object containing methods (functions).
    // `M & ThisType<D & ComputedValues<C> & M>` ensures the object matches type M and
    // sets the `this` context for methods. Inside methods, `this` provides access to:
    // - D: Properties from the `data` function's return value.
    // - ComputedValues<C>: The evaluated results (return values) of the computed properties.
    // - M: The other methods defined in the `methods` object.
    methods?: M & ThisType<D & ComputedValues<C> & M>;
  }
// The return type of the SimpleVue function.
// It represents the created instance, which combines:
// - D: Data properties.
// - ComputedValues<C>: Evaluated computed properties (as values, not functions).
// - M: Methods (as functions).
): D & ComputedValues<C> & M;
```

