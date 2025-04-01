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

// Helper type: Extracts the return types from an object of functions (intended for computed properties).
// Example: ComputedGetters<{ foo: () => number }> becomes { foo: number }
// It iterates over keys K in C. If C[K] is a function accepting `this` and no other arguments,
// it extracts the return type R. Otherwise, it results in `never`.
type ComputedGetters<C> = {
  [K in keyof C]: C[K] extends (this: any, ...args: never[]) => infer R ? R : never;
};

// Type constraints: Define the expected structure for `computed` and `methods` objects.
// Computed properties are functions that should only depend on `this`.
type ComputedOptions = Record<string, (this: any) => any>;
// Methods are functions that operate on `this` and can accept additional arguments.
type MethodOptions = Record<string, (this: any, ...args: any[]) => any>;

// Combined `this` type: Calculates the type of the `this` keyword inside `computed` and `methods`.
// It's an intersection of:
// - D: The type of the object returned by the `data` function.
// - ComputedGetters<C>: An object mapping computed property names to their return types (the computed values).
// - M: The type of the `methods` object itself (methods are accessed as functions).
type CombinedThis<D, C, M> = D & ComputedGetters<C> & M;

// Options type: Defines the type for the configuration object passed to `SimpleVue`.
// It uses generics D, C, and M to represent the types inferred from the actual options object.
// `ThisType<T>` is a utility type that specifies the contextual `this` type for functions within an object type.
type SimpleVueOptions<D, C extends ComputedOptions, M extends MethodOptions> = {
  // The `data` function returns an object of type D.
  // Inside `data`, `this` is explicitly typed as `unknown` to prevent access to instance properties,
  // matching the behavior described and tested.
  data?(this: unknown): D;
  // The `computed` object contains functions. `ThisType` sets their `this` context to `CombinedThis<D, C, M>`,
  // allowing access to data, computed results, and methods.
  computed?: C & ThisType<CombinedThis<D, C, M>>;
  // The `methods` object contains functions. `ThisType` similarly sets their `this` context to `CombinedThis<D, C, M>`.
  methods?: M & ThisType<CombinedThis<D, C, M>>;
};

// `SimpleVue` function declaration: A generic function that accepts the options object.
// It infers the types D (from data return), C (from computed object), M (from methods object)
// from the provided `options`.
// The return type of `SimpleVue` represents the created instance, which has the `CombinedThis<D, C, M>` type,
// exposing data properties, computed values, and methods.
declare function SimpleVue<D, C extends ComputedOptions, M extends MethodOptions>(
  options: SimpleVueOptions<D, C, M>
): CombinedThis<D, C, M>;
```

