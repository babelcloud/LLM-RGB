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

To solve this problem, we need to create a type definition for the `SimpleVue` function that properly infers the `this` context inside the `data`, `computed`, and `methods` fields. The goal is to ensure that each of these fields has the correct access to the properties and methods defined within the Vue-like component.

### Approach
1. **Data Function**: The `data` function should return an object, and within this function, the `this` context should not be accessible to any other computed values or methods. This is achieved by setting the `this` type to `void`.
2. **Computed Properties**: These are functions that take the combined context of the data properties, other computed properties (as their resolved values), and methods. The resolved values of computed properties should be accessible as plain values.
3. **Methods**: These are functions that can access data properties, computed properties (as values), and other methods. Methods are exposed as-is, meaning they remain functions.

To model the `this` context correctly, we use TypeScript's `ThisType` utility type, which allows us to set the `this` type for all functions within an object. This helps in ensuring that computed properties and methods have access to the correct context.

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
- **Generics**: The function is generic over three types: `D` (data return type), `C` (computed properties), and `M` (methods).
- **Data Function**: The `data` function is defined to return `D` and has its `this` type set to `void`, ensuring no access to other properties or methods.
- **Computed Properties**: The computed properties (`C`) are constrained to be an object of functions. The `ThisType` utility is used to set the `this` context for these functions to include the data (`D`), the resolved values of computed properties, and methods (`M`).
- **Methods**: Similar to computed properties, methods (`M`) have their `this` context set to include data, computed values, and other methods.

This approach ensures that within computed properties and methods, the `this` context correctly includes all necessary properties and methods, providing proper type inference and error checking as required.

