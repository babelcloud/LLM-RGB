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

def order_by_points(nums):
    def sum_of_digits(n):
        s = str(n)
        digits = []
        if s[0] == '-':
            digits.append(int(s[0] + s[1]))
            s = s[2:]
        else:
            digits.append(int(s[0]))
            s = s[1:]
        for ch in s:
            digits.append(int(ch))
        return sum(digits)
    return [num for idx, num in sorted(enumerate(nums), key=lambda x: (sum_of_digits(x[1]), x[0]))]

