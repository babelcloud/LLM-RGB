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
    return sum(int(d) for d in str(n) if d.isdigit()) - (int(str(n)[1]) if str(n).startswith('-') and len(str(n)) > 1 else 0)

def order_by_points(nums):
    return sorted(nums, key=lambda x: (sum_of_digits(x), nums.index(x)))

