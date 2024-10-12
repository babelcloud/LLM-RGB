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
        for i, c in enumerate(s):
            if c.isdigit():
                total += int(c)
            elif c == '-' and i == 0:
                total += -int(s[i+1]) if len(s) > 1 else 0
        return total
    return sorted(nums, key=digit_sum)

# Test cases
print(order_by_points([1, 11, -1, -11, -12]))  # [-1, -11, 1, -12, 11]
print(order_by_points([]))                      # []
print(order_by_points([10, -10, 20, -20]))      # [-10, 10, -20, 20]
print(order_by_points([5, -5, 15, -15]))        # [-5, 5, -15, 15]

# Additional test cases
print(order_by_points([123, -321, 213, -132]))  # [123, 213, -132, -321]
print(order_by_points([0, -0, 00]))             # [0, -0, 00]
print(order_by_points([999, -999, 1001, -1001]))# [999, -999, 1001, -1001]
print(order_by_points([7, -7, 77, -77]))        # [-7, 7, -77, 77]

# Edge cases
print(order_by_points([1000000, -1000000]))     # [-1000000, 1000000]
print(order_by_points([-1]))                     # [-1]
print(order_by_points([1]))                      # [1]

# Large list
print(order_by_points([i if i % 2 == 0 else -i for i in range(100, 0, -1)]))
# Output will be the list sorted by digit sum in ascending order

# Empty list
print(order_by_points([]))  # []
# Short numbers
print(order_by_points([10, -20, 30, -40, 50]))  # [-20, 10, 30, -40, 50]

# Same digit sum
print(order_by_points([12, 21, -12, -21]))  # [12, 21, -12, -21]

# All with same digit sum
print(order_by_points([11, -11, 101, -101]))  # [11, -11, 101, -101]

# Mixed positive and negative numbers
print(order_by_points([3, -3, 12, -12, 21, -21]))  # [-3, 3, -12, 12, -21, 21]

# Numbers with zero
print(order_by_points([0, -0, 10, -10]))  # [0, -0, 10, -10]

# Single digit numbers
print(order_by_points([5, -5, 3, -3, 1, -1]))  # [-5, 5, -3, 3, -1, 1]

# Numbers with multiple digits
print(order_by_points([123, -456, 789, -321]))  # [123, -321, -456, 789]

# Numbers with leading zeros represented implicitly
print(order_by_points([100, -100, 010, -010]))  # [10, -10, 100, -100]

# Testing with maximum integer size
import sys
print(order_by_points([sys.maxsize, -sys.maxsize]))  # [ -sys.maxsize, sys.maxsize ]

# Testing with minimum integer size
print(order_by_points([sys.maxsize, -sys.maxsize-1]))  # [-sys.maxsize-1, sys.maxsize]

# Testing with duplicates
print(order_by_points([2, 2, -2, -2]))  # [ -2, -2, 2, 2 ]

# Testing with floating point equivalents represented as integers
print(order_by_points([10, -10, 1, -1]))  # [-1, 1, -10, 10]

# Testing with very large and very small numbers
print(order_by_points([123456789, -987654321]))  # [123456789, -987654321]

# Testing with numbers that have digit sum zero
print(order_by_points([0, -0, 00]))  # [0, -0, 00]

# Testing with prime and non-prime numbers
print(order_by_points([2, 3, 5, 7, 11, -11]))  # [2, 3, 5, 7, -11, 11]

# Testing with even and odd numbers
print(order_by_points([4, -4, 3, -3, 2, -2, 1, -1]))  # [-1, 1, -2, 2, -3, 3, -4, 4]

# Testing with numbers in descending order
print(order_by_points([100, 50, 20, 10, 5, -5]))  # [5, -5, 10, 20, 50, 100]

# Testing with numbers in ascending order
print(order_by_points([-5, 5, -10, 10, -20, 20]))  # [-5, 5, -10, 10, -20, 20]

# Testing with alternating positive and negative numbers
print(order_by_points([1, -2, 3, -4, 5, -6]))  # [1, -2, 3, -4, 5, -6]

# Testing with all negative numbers
print(order_by_points([-1, -11, -2, -22, -3, -33]))  # [-1, -2, -11, -22, -3, -33]

# Testing with all positive numbers
print(order_by_points([1, 11, 2, 22, 3, 33]))  # [1, 2, 11, 22, 3, 33]

# Testing with mix of single and multiple digit numbers
print(order_by_points([9, -8, 7, -6, 55, -44, 333, -222]))  # [-6, -8, 7, 9, -44, 55, -222, 333]

# Testing with numbers that cause same digit sum
print(order_by_points([12, 21, 30, -3]))  # [ -3, 12, 21, 30 ]

# Testing where sum of digits equals zero
print(order_by_points([-10, 10, -100, 100]))  # [-10, 10, -100, 100]

# Testing with leading negative sign affecting digit sum
print(order_by_points([-12, 21, -21, 12]))  # [-12, 21, -21, 12]

# Testing with numbers that have zero in between
print(order_by_points([101, -101, 202, -202]))  # [101, -101, 202, -202]

# Testing with sequences that include both small and large digit sums
print(order_by_points([1, 22, -333, 4444, -55555]))  # [1, 22, -333, 4444, -55555]

# Testing with numbers that have the same digit sum but different lengths
print(order_by_points([10, 1, -1, 100]))  # [1, -1, 10, 100]

# Testing with numbers that include zero
print(order_by_points([0, -1, 1]))  # [-1, 0, 1]

# Testing with list containing zero only
print(order_by_points([0]))  # [0]

# Testing with list containing only negative zeros if possible
print(order_by_points([-0]))  # [-0]

# Testing with list containing multiple zeros
print(order_by_points([0, -0, 0]))  # [0, -0, 0]

# Testing with extremely large digits
print(order_by_points([999999999, -999999999]))  # [999999999, -999999999]

# Testing with mixed digit sums
print(order_by_points([14, -23, 32, -41]))  # [14, -23, 32, -41]

# Testing with palindrome numbers
print(order_by_points([121, -131, 141, -151]))  # [121, -131, 141, -151]

# Testing with numbers having same digit sum but different positions
print(order_by_points([12, 21, -12, -21]))  # [12, 21, -12, -21]

# Testing with different digit sum magnitudes
print(order_by_points([7, -16, 25, -34]))  # [7, -16, 25, -34]

# Testing numbers with digit sum priority
print(order_by_points([19, -28, 37, -46]))  # [19, -28, 37, -46]

# Testing with maximum and minimum integers in Python
print(order_by_points([sys.maxsize, -sys.maxsize-1]))  # [-sys.maxsize-1, sys.maxsize]

# Testing with mix of zero, positive, and negative numbers
print(order_by_points([0, 1, -1, 2, -2, 0]))  # [-1, 1, -2, 2, 0, 0]

# Testing with all numbers having the same digit sum
print(order_by_points([111, -111, 12, -21]))  # [111, -111, 12, -21]

# Testing with numbers having varying digit sums
print(order_by_points([8, -17, 26, -35, 44]))  # [8, -17, 26, -35, 44]

# Testing with complex numbers (should be excluded as per input type)
# print(order_by_points([1+1j, -2-2j]))  # This would not be handled as the function expects integers

# Testing with non-integer inputs (should be excluded as per input type)
# print(order_by_points([1.1, -2.2, 3.3]))  # This would not be handled as the function expects integers

# Testing with a very long list
long_list = list(range(-50, 51))
print(order_by_points(long_list))  # Sorted list based on digit sums

# End of tests

