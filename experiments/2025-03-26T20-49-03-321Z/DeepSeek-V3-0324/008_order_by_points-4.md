# 008_order_by_points

## Prompt

def order_by_points(nums):
    """
    Write a function which sorts the given list of integers
    in ascending order according to the sum of their digits.
    Note: if there are several items with similar sum of their digits,
    order them based on their index in original list. If the number is negative, the first digit should be negative.

    For example:
    >>> order_by_points([1, 11, -1, -11, -12]) == [-1, -11, 1, -12, 11]. The sum of '-11' is 0 and sum of '-12' is 1.
    >>> order_by_points([]) == []
    """

Code directly, no explanations, no code block wrappers.

## Response

```python
def order_by_points(nums):
    def sum_digits(n):
        s = str(n)
        if s[0] == '-':
            total = -int(s[1])
            for d in s[2:]:
                total += int(d)
        else:
            total = 0
            for d in s:
                total += int(d)
        return total
    
    # Create a list of tuples: (sum of digits, original index, number)
    indexed_nums = [(sum_digits(num), i, num) for i, num in enumerate(nums)]
    # Sort by sum of digits, then by original index
    indexed_nums.sort(key=lambda x: (x[0], x[1]))
    # Extract the numbers in the new order
    return [num for (_, _, num) in indexed_nums]
```

