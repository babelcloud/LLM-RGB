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
        if n == 0:
            return 0
        is_negative = n < 0
        digits = list(str(abs(n)))
        s = 0
        for i, d in enumerate(digits):
            if i == 0 and is_negative:
                s -= int(d)
            else:
                s += int(d)
        return s
    
    sorted_nums = sorted(
        [(digit_sum(num), idx, num) for idx, num in enumerate(nums)],
        key=lambda x: (x[0], x[1])
    )
    
    return [x[2] for x in sorted_nums]

