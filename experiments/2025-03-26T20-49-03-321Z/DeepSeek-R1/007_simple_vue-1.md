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

To solve this problem, we need to implement a simplified version of Vue-like typing support for the `SimpleVue` function. The goal is to correctly infer the `this` type inside computed properties and methods, ensuring that data, computed properties, and methods are accessible in the appropriate contexts.

### Approach
The key challenge is to correctly type the `this` context for the data, computed properties, and methods. Here's the breakdown of the approach:

1. **Data Function**: The data function should return an object that becomes part of the instance context. However, during its execution, it should not have access to computed properties or methods. This is achieved by setting the `this` type of the data function to `void`.

2. **Computed Properties**: These are functions that return values based on the data and other computed properties. The `this` context for computed properties should include the data, other computed properties (as their return values), and methods. This is achieved using TypeScript's `ThisType` utility to set the `this` context for all computed functions.

3. **Methods**: These are functions that can access data, computed properties, and other methods. Similar to computed properties, the `this` context for methods is set using `ThisType`.

By combining these elements, we create an instance type that includes data, computed properties (as their return values), and methods. The `ThisType` utility ensures that the `this` context within computed properties and methods is correctly inferred.

### Solution Code
```typescript
declare function SimpleVue<D, C extends Record<string, (this: any) => any>, M>(
  options: {
    data: (this: void) => D;
    computed: C;
    methods: M;
  } & ThisType<D & { [K in keyof C]: ReturnType<C[K]> } & M>
): any;
```

### Explanation
- **Data Function**: The `data` function is typed to return an object `D` and has its `this` context set to `void`, ensuring it cannot access computed properties or methods during its execution.
- **Computed Properties**: The `computed` object is typed such that each function's `this` context includes the data (`D`), the return types of all computed properties, and methods (`M`). This is achieved using `ThisType<D & { [K in keyof C]: ReturnType<C[K]> } & M>`.
- **Methods**: The `methods` object is similarly typed to ensure each method's `this` context includes data, computed properties, and other methods.

This approach ensures that the `this` context within computed properties and methods is correctly inferred, allowing access to data, computed values, and other methods as required.

