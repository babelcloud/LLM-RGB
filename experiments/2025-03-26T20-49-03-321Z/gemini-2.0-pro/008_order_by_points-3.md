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
    def calculate_digit_sum(n):
        if n == 0:
            return 0
        s = str(abs(n))
        if n < 0:
            # First digit is negative
            digit_sum = -int(s[0])
            if len(s) > 1:
                digit_sum += sum(int(digit) for digit in s[1:])
        else:
            # All digits are positive
            digit_sum = sum(int(digit) for digit in s)
        return digit_sum

    # Use sorted() which is stable, preserving original order for equal keys
    return sorted(nums, key=calculate_digit_sum)
```

