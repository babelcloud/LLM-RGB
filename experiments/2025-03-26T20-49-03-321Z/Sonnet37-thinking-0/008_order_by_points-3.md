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
        if n < 0:
            # Handle negative numbers by making the first digit negative
            digits = [int(d) for d in str(abs(n))]
            digits[0] = -digits[0]
            return sum(digits)
        else:
            return sum(int(d) for d in str(n))
    
    # Create a list of tuples (original_index, number, digit_sum)
    indexed_nums = [(i, num, digit_sum(num)) for i, num in enumerate(nums)]
    
    # Sort by digit sum first, then by original index
    indexed_nums.sort(key=lambda x: (x[2], x[0]))
    
    # Return just the numbers in the new order
    return [num for _, num, _ in indexed_nums]

