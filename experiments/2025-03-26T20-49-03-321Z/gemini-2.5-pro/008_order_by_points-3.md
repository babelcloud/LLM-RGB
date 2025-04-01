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
    """
    Write a function which sorts the given list of integers
    in ascending order according to the sum of their digits.
    Note: if there are several items with similar sum of their digits,
    order them based on their index in original list. If the number is negative, the first digit should be negative.

    For example:
    >>> order_by_points([1, 11, -1, -11, -12]) == [-1, -11, 1, -12, 11]. The sum of '-11' is 0 and sum of '-12' is 1.
    >>> order_by_points([]) == []
    """
    def sum_digits(n):
        s = str(n)
        if n == 0:
            return 0
        elif n > 0:
            digit_sum = 0
            for char in s:
                digit_sum += int(char)
            return digit_sum
        else: # n < 0
            # s starts with '-' e.g., "-123"
            digit_sum = -int(s[1]) # First digit is negative
            for char in s[2:]: # Sum the rest of the digits
                digit_sum += int(char)
            return digit_sum

    # Use sorted() which is stable in Python.
    # It preserves the original order of elements that have the same key.
    return sorted(nums, key=sum_digits)
```

