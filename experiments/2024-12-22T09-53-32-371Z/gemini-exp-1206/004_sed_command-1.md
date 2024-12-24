# 004_sed_command

## Prompt

You will be provided with some examples delimited by triple hashtags.
###
CODE_TO_BE_FIXED:
```TypeScript
export default async function () {
  return {
    age,
    fistName: 'Benny',
    lastName: 'Neugebauer',
  };
}
```
INSTRUCTION:
Add declaration for the shorthand property 'age'.

SED_COMMAND:
sed '/export default async function () {/a\\
    let age = 25;' filename.ts
###
CODE_TO_BE_FIXED:
```TypeScript
const months: {
  [month: number]: string;
} = {
  1: 'January',
  2: 'February',
};

for (const month of months) {
  console.log(month);
}
```
INSTRUCTION:
Replace 'for (const month of months)' with 'for (const month in months)'. The 'for-of' statement requires the object to be iterable which is not the case for objects in JavaScript. The 'for-in' statement should be used to iterate over the properties of an object.

SED_COMMAND:
sed 's/for (const month of months)/for (const month in months)/g' filename.ts
###
CODE_TO_BE_FIXED:
```TypeScript
import { sun } from "#elements"

export default async function () {
  return sum(1, 1);
}
```
INSTRUCTION:
Replace 'sun' with 'sum' in the import statement.

SED_COMMAND:
sed 's/import { sun }/import { sum }/g' filename.ts
###
CODE_TO_BE_FIXED:
```TypeScript
export default async function () {
  const objectLiteral = {
    name: 'Benny',
    name: 'Sofia',
  };
}
```
INSTRUCTION:
Remove the duplicate property 'name' from the object literal.

SED_COMMAND:
sed '/name: '\''Sofia'\''/d' filename.ts
###

Now, please generate the SED_COMMAND.

CODE_TO_BE_FIXED: 
export default async function () {
    return "hello babel
}
INSTRUCTION: 
Fix the unterminated string literal on line 2. Close the string with a quotation mark.
SED_COMMAND:

## Response

```sed
sed 's/hello babel/hello babel\"/g' filename.ts
```

