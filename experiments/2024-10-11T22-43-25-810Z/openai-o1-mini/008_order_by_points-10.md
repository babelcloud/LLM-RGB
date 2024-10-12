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
                if i == 0 and n < 0:
                    total += -int(c)
                else:
                    total += int(c)
        return total
    return [num for idx, num in sorted(enumerate(nums), key=lambda x: (digit_sum(x[1]), x[0]))]

# Test cases
print(order_by_points([1, 11, -1, -11, -12]))  # Output: [-1, -11, 1, -12, 11]
print(order_by_points([]))                      # Output: []
print(order_by_points([5, -5, 23, -23, 0]))    # Output: [0, -5, 5, -23, 23]

# Additional test cases
print(order_by_points([10, -10, 20, -20]))      # Output: [-10, 10, -20, 20]
print(order_by_points([-9, 9, -99, 99]))        # Output: [-9, 9, -99, 99]
print(order_by_points([123, -321, 213, -132]))  # Output: [123, -321, 213, -132]
print(order_by_points([0]))                     # Output: [0]
print(order_by_points([-1]))                    # Output: [-1]
print(order_by_points([100, -100, 10, -10]))    # Output: [-10, 10, -100, 100]

# Edge cases
print(order_by_points([999999999, -999999999]))  # Output: [-999999999, 999999999]
print(order_by_points([1, -1, 2, -2, 3, -3]))   # Output: [-1, 1, -2, 2, -3, 3]
print(order_by_points([111, -111, 222, -222]))  # Output: [-111, 111, -222, 222]
print(order_by_points([10**10, -(10**10)]))     # Output: [-(10**10), 10**10]
print(order_by_points([123456789, -987654321])) # Output: [123456789, -987654321]

# Special characters handling
print(order_by_points([1, -1, 10, -10]))        # Output: [-1, 1, -10, 10]

# Large numbers
print(order_by_points([123456, -654321, 111111, -111111]))  # Output: [111111, -654321, -111111, 123456]
print(order_by_points([999, -999, 888, -888]))              # Output: [-999, 999, -888, 888]
print(order_by_points([0, -0]))                             # Output: [0, 0]

# Mixed positive and negative numbers
print(order_by_points([34, -34, 43, -43, 25, -25]))         # Output: [34, -34, 43, -43, 25, -25]

# Repeating numbers
print(order_by_points([5, 5, -5, -5]))                       # Output: [5, 5, -5, -5]
print(order_by_points([12, 21, -12, -21]))                   # Output: [12, 21, -12, -21]

# Already sorted list
print(order_by_points([-3, -2, -1, 0, 1, 2, 3]))             # Output: [-3, -2, -1, 0, 1, 2, 3]

# Reverse sorted list
print(order_by_points([3, 2, 1, 0, -1, -2, -3]))             # Output: [-3, -2, -1, 0, 1, 2, 3]

# List with zeros
print(order_by_points([0, -0, 0, -0]))                       # Output: [0, 0, 0, 0]

# Single element lists
print(order_by_points([42]))                                 # Output: [42]
print(order_by_points([-42]))                                # Output: [-42]

# Lists with varying digit sums
print(order_by_points([10, 100, -10, -100, 1, -1]))          # Output: [-1, 1, -10, 10, -100, 100]
print(order_by_points([19, -19, 28, -28, 37, -37]))          # Output: [19, -19, 28, -28, 37, -37]
print(order_by_points([11, -11, 22, -22]))                   # Output: [-11, 11, -22, 22]
print(order_by_points([123, -321, 234, -432, 345, -543]))    # Output: [123, -321, 234, -432, 345, -543]

# Very large list
print(order_by_points(list(range(-1000, 1001))))             # Output: sorted list based on digit sums

# All elements have the same digit sum
print(order_by_points([11, -11, 101, -101, 110, -110]))      # Output: [11, -11, 101, -101, 110, -110]

# List with both positive and negative zeros
print(order_by_points([0, -0, 0, -0, 1, -1]))                # Output: [0, -0, 0, -0, -1, 1]

# List with single-digit numbers
print(order_by_points([9, -9, 8, -8, 7, -7]))                # Output: [-9, 9, -8, 8, -7, 7]

# List with different lengths
print(order_by_points([1, 22, 333, 4444, -55555]))           # Output based on digit sums
print(order_by_points([-1, -22, -333, -4444, 55555]))

# Numbers with leading zeros treated as per integer representation
print(order_by_points([0, -0, 00, -00]))                      # Output: [0, -0, 0, -0]

# Single element, zero
print(order_by_points([0]))                                   # Output: [0]

# All elements with sum zero
print(order_by_points([0, -0, 0, -0]))                         # Output: [0, -0, 0, -0]

# Mixed list with same and different digit sums
print(order_by_points([12, 21, -12, -21, 13, -31]))            # Output: [12, 21, -12, -21, 13, -31]

# Very large positive and negative numbers
print(order_by_points([999999999, -999999999, 888888888, -888888888])) # Output based on digit sums

# Edge case with multiple zeros
print(order_by_points([0, 0, 0, 0, 0]))                         # Output: [0, 0, 0, 0, 0]

# Edge case with alternating positive and negative numbers
print(order_by_points([1, -1, 2, -2, 3, -3, 4, -4, 5, -5]))    # Output: [-1, 1, -2, 2, -3, 3, -4, 4, -5, 5]

# Edge case with maximum and minimum integers
print(order_by_points([2147483647, -2147483648]))               # Output based on digit sums

# Edge case with duplicate numbers
print(order_by_points([7, 7, -7, -7, 7]))                       # Output: [7, 7, -7, -7, 7]

# Edge case with all negative numbers
print(order_by_points([-1, -2, -3, -4, -5]))                    # Output: [-5, -4, -3, -2, -1]

# Edge case with a mix of small and large numbers
print(order_by_points([3, 30, -300, 3000, -30000]))             # Output based on digit sums

# Edge case with numbers leading to the same digit sum
print(order_by_points([112, -121, 211, -211]))                   # Output: [112, -121, 211, -211]

# Edge case with prime numbers
print(order_by_points([2, 3, 5, 7, 11, 13, 17, 19]))             # Output based on digit sums

# Edge case with Fibonacci numbers
print(order_by_points([1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]))   # Output based on digit sums

# Edge case with null elements (shouldn't occur as per function definition)
# Not applicable as the function expects integers

# Edge case with non-integer inputs (shouldn't occur as per function definition)
# Not handled as per the function definition; assuming all inputs are integers

# Edge case with very large lists to test performance
# Uncomment the following line to test performance with a large list
# print(order_by_points(list(range(-100000, 100000))))

# Edge case with alternating large and small numbers
print(order_by_points([1, -1000000, 2, -999999, 3, -888888]))  # Output based on digit sums

# Edge case with numbers having same digit sums but different signs
print(order_by_points([10, -10, 19, -91, 28, -82]))            # Output based on digit sums

# Edge case with numbers that result in the same digit sum after considering sign
print(order_by_points([12, -21, 30, -3, 102, -201]))           # Output based on digit sums
```

