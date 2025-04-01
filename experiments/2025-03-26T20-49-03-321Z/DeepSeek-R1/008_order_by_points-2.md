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
        s = str(abs(n))
        digits = list(s)
        sum_d = 0
        if n < 0:
            if digits:
                sum_d += -int(digits[0])
                for d in digits[1:]:
                    sum_d += int(d)
        else:
            for d in digits:
                sum_d += int(d)
        return sum_d
    
    indexed_nums = [(digit_sum(num), idx, num) for idx, num in enumerate(nums)]
    sorted_nums = sorted(indexed_nums, key=lambda x: (x[0], x[1]))
    return [num for (s, idx, num) in sorted_nums]

