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

def digit_sum(n):
    digits = str(n)
    if digits[0] == '-':
        return -int(digits[1]) + sum(int(d) for d in digits[2:])
    return sum(int(d) for d in digits)

def order_by_points(nums):
    return [x[1] for x in sorted(enumerate(nums), key=lambda x: (digit_sum(x[1]), x[0]))]

