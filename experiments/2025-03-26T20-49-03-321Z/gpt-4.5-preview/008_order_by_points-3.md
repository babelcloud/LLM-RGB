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

def sum_of_digits(n):
    digits = str(abs(n))
    total = int(digits[0]) if n >= 0 else -int(digits[0])
    total += sum(int(d) for d in digits[1:])
    return total

def order_by_points(nums):
    return [num for num, _ in sorted(enumerate(nums), key=lambda x: (sum_of_digits(x[1]), x[0]))] if nums else []

