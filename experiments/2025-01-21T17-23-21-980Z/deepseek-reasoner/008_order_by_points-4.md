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
    def digit_sum(n):
        s = str(n)
        total = 0
        if s[0] == '-':
            if len(s) > 1:
                total = -int(s[1])
                for c in s[2:]:
                    total += int(c)
        else:
            for c in s:
                total += int(c)
        return total
    sorted_nums = sorted(enumerate(nums), key=lambda x: (digit_sum(x[1]), x[0]))
    return [num for idx, num in sorted_nums]

