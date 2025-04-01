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
    def calculate_digit_sum(n):
        s = str(n)
        digit_sum = 0
        if n < 0:
            # For negative numbers, the first digit after '-' is negative
            digit_sum -= int(s[1])
            # Add the remaining digits
            for digit in s[2:]:
                digit_sum += int(digit)
        else:
            # For non-negative numbers, sum all digits
            for digit in s:
                digit_sum += int(digit)
        return digit_sum

    # sorted() is stable in Python, so items with the same key
    # (digit sum) will retain their original relative order.
    return sorted(nums, key=calculate_digit_sum)
```

