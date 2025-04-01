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

// Helper type to extract the return types of functions in an object (like computed properties)
// It maps over the keys of C and infers the return type R for each function.
type GetComputedValues<C> = {
  [P in keyof C]: C[P] extends (...args: any[]) => infer R ? R : never;
};

// The type of the `this` context available inside methods functions, and also the type of the instance returned by SimpleVue.
// It's an intersection of:
// 1. Data properties (D), defaulting to an empty object {} if D is not provided or undefined.
// 2. Computed property values (derived from C using GetComputedValues), defaulting to {} if C is not provided or undefined.
// 3. Methods (M), defaulting to {} if M is not provided or undefined.
type SimpleVueInstance<D, C, M> = (D extends undefined ? {} : D) &
                                  GetComputedValues<C extends undefined ? {} : C> &
                                  (M extends undefined ? {} : M);

// The type of the `this` context available inside computed functions.
// It should only contain the data properties (D).
// Defaults to an empty object {} if D is not provided or undefined.
type SimpleVueComputedContext<D> = D extends undefined ? {} : D;

// Declare the SimpleVue function signature.
// It uses generics D, C, M to represent the types inferred from the data, computed, and methods options respectively.
// Default values for generics are set to {} to gracefully handle cases where an option (data, computed, or methods) is not provided.
declare function SimpleVue<D = {}, C = {}, M = {}>(
  options: {
    // data: An optional function.
    // `this` context inside the data function is explicitly set to `void`,
    // indicating that it should not have access to any instance properties.
    // This function should return an object of type D, representing the component's initial data state.
    data?(this: void): D;

    // computed: An optional object where keys are computed property names and values are getter functions.
    // The generic `C` captures the structure and types of this computed object.
    // `& ThisType<SimpleVueComputedContext<D>>` uses the ThisType utility to specify that the `this` context
    // within these computed getter functions should be of type SimpleVueComputedContext<D> (i.e., containing only data properties).
    computed?: C & ThisType<SimpleVueComputedContext<D>>;

    // methods: An optional object where keys are method names and values are functions.
    // The generic `M` captures the structure and types of this methods object.
    // `& ThisType<SimpleVueInstance<D, C, M>>` uses the ThisType utility to specify that the `this` context
    // within these methods should be of type SimpleVueInstance<D, C, M> (i.e., containing data properties, computed values, and other methods).
    methods?: M & ThisType<SimpleVueInstance<D, C, M>>;
  }
  // The function returns an object whose type is SimpleVueInstance<D, C, M>.
  // This represents the created Vue-like instance, fully typed with its data properties,
  // computed property values (not functions), and methods.
): SimpleVueInstance<D, C, M>;
```

