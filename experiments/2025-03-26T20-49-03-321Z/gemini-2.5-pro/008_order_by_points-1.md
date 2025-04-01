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
import math

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
    if not nums:
        return []

    def calculate_digit_sum(n):
        s = str(n)
        if n < 0:
            # Handle negative numbers, skip the '-' sign at s[0]
            if len(s) == 2: # Single digit negative number like -1, -5
                 return -int(s[1])
            else: # Multi-digit negative number like -12, -11
                 # First digit is negative, rest are positive
                 return -int(s[1]) + sum(int(d) for d in s[2:])
        else:
            # Handle non-negative numbers
            # This handles 0 correctly as sum('0') = 0
            return sum(int(d) for d in s)

    # Use sorted() with the custom key. Python's sorted() is stable,
    # ensuring elements with the same sum maintain original relative order.
    result = sorted(nums, key=calculate_digit_sum)
    return result
```

