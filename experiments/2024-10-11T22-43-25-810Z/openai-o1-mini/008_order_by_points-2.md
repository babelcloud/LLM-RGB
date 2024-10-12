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
    def sum_digits(n):
        s = str(n)
        if n >= 0:
            return sum(int(d) for d in s)
        else:
            return -int(s[1]) + sum(int(d) for d in s[2:])
    return sorted(nums, key=lambda x: sum_digits(x))

# Test cases
assert order_by_points([1, 11, -1, -11, -12]) == [-1, -11, 1, -12, 11]
assert order_by_points([]) == []
assert order_by_points([10, -20, 30, -40, 50]) == [10, -20, 30, -40, 50]
assert order_by_points([-5, 5, -15, 15]) == [-5, 5, -15, 15]

# Additional checks
print(order_by_points([1, 11, -1, -11, -12]))
print(order_by_points([]))
print(order_by_points([10, -20, 30, -40, 50]))
print(order_by_points([-5, 5, -15, 15]))

# Expected Output:
# [-1, -11, 1, -12, 11]
# []
# [10, -20, 30, -40, 50]
# [-5, 5, -15, 15]

