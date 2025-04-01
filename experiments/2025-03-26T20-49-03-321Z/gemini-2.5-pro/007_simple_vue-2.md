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

// Helper type to extract return types from computed properties
// It maps an object of functions `C` to an object with the same keys,
// but where values are the return types of the corresponding functions.
type ComputedValues<C> = {
  [P in keyof C]: C[P] extends (...args: any[]) => infer R ? R : never;
};

// Declare the SimpleVue function signature using generics for data (D), computed (C), and methods (M) types.
// Defaults are provided (`{}`) for cases where these properties might be missing in the options object,
// ensuring correct type inference even when `data`, `computed`, or `methods` are absent.
declare function SimpleVue<D = {}, C = {}, M = {}>(
  options: {
    // The `data` property is an optional function.
    // `this` inside the data function is explicitly typed as `unknown`
    // to prevent access to instance properties (data, computed, methods) during initialization.
    // The function returns an object of type `D`, which represents the component's data state.
    data?: (this: unknown) => D;

    // The `computed` property is an optional object `C` containing computed property getter functions.
    // `ThisType<D>` specifies that `this` inside computed functions refers only to the data properties `D`.
    // This prevents accessing other computed properties or methods within a computed getter's definition,
    // matching the behavior described and tested.
    // The `& C` part ensures that the structure of `computed` matches the inferred type `C`.
    computed?: C & ThisType<D>;

    // The `methods` property is an optional object `M` containing method functions.
    // `ThisType<D & ComputedValues<C> & M>` specifies that `this` inside methods
    // has access to data properties (`D`), the resolved values of computed properties (`ComputedValues<C>`),
    // and other methods (`M`), representing the full instance context.
    // The `& M` part ensures the structure matches the inferred type `M`.
    methods?: M & ThisType<D & ComputedValues<C> & M>;
  }
  // The function returns an object representing the Vue instance.
  // This instance type is an intersection of the data properties (`D`),
  // the computed properties' resolved values (`ComputedValues<C>`),
  // and the methods (`M`). This allows type-safe access to all instance members.
): D & ComputedValues<C> & M;

```

