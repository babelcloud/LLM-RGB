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
type DataFn<T> = () => T;
type ComputedFn<T, K extends keyof T> = (this: T) => T[K];
type MethodsFn<T> = {
  [K in keyof T]?: (this: T) => any;
};

type SimpleVueOptions<T> = {
  data: DataFn<T>;
  computed?: {
    [K in keyof T]?: ComputedFn<T, K>;
  };
  methods?: MethodsFn<T>;
};

type SimpleVueInstance<T> = {
  [K in keyof T | keyof (typeof options['computed']) | keyof (typeof options['methods']): K extends keyof (typeof options['computed'])
    ? ReturnType<Extract<SimpleVueOptions<T>['computed'], { [P in K]: any }>[K]>
    : K extends keyof (typeof options['methods'])
    ? (...args: any[]) => ReturnType<Extract<SimpleVueOptions<T>['methods'], { [P in K]: any }>[K]>
    : T[K]>
} & {
  [K in keyof (typeof options['methods']): K extends keyof (typeof options['methods'])
    ? (...args: any[]) => ReturnType<Extract<SimpleVueOptions<T>['methods'], { [P in K]: any }>[K]>
    : never
};

const options: SimpleVueOptions<any> = null as any;

function SimpleVue<T>(options: SimpleVueOptions<T>): SimpleVueInstance<T> {
  const data = options.data();
  const computed = options.computed || {};
  const methods = options.methods || {};

  for (const key in computed) {
    data[key] = computed[key].call(data);
  }

  return new Proxy(data, {
    get(target, prop: string) {
      if (prop in methods) {
        return (...args: any[]) => methods[prop].call(target, ...args);
      }
      return target[prop];
    },
  }) as SimpleVueInstance<T>;
}
```

