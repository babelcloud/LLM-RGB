from typing import Union
import io
import sys

def remove_first_and_last_line(text):
    lines = text.splitlines()
    return "\n".join(lines[1:-1]) if len(lines) > 2 else ""

def get_assert(output: str, context) -> Union[bool, float, str]:
    # print('Prompt:', context['prompt'])
    # print('Vars', context['vars'])
    score = 0
    if output.strip().startswith('def'):
        score += 0.2
        code = output
    else:
        code = remove_first_and_last_line(output.strip())
    
    #  the code should be a python function called `order_by_points` and should pass the given tests
    code = f'''{code}

def test_order_by_points():
    
    assert order_by_points([]) == []
    assert order_by_points([5, -5, 15, -15, 25]) == [-5, -15, 5, 15, 25]
    assert order_by_points([14, 23, 32, 41, 50]) == [14, 23, 32, 41, 50]
    assert order_by_points([111, 222, -333, 444, -555]) == [111, -333, -555, 222, 444]
    assert order_by_points([1, 11, -1, -11, -12]) == [-1, -11, 1, -12, 11]
    assert order_by_points([0, 99, 45, 123, -234]) == [0, -234, 123, 45, 99]
    print("All tests passed.")

test_order_by_points()'''
    # Execute the code and capture output
    globals_dict = {}
    reason = ''
    try:
        # Capture standard output
        output_capture = io.StringIO()
        sys.stdout = output_capture

        # Execute the code in a controlled global namespace
        exec(code, globals_dict)
        output = output_capture.getvalue()
        
        # Restore standard output
        sys.stdout = sys.__stdout__
        
        # Check for success message in output
        if 'All tests passed.' in output:
            score += 0.8
            reason = 'All tests passed.'
        else:
            reason = f'Tests did not pass. Output: {output}'

    except Exception as e:
        # Restore standard output in case of an error
        sys.stdout = sys.__stdout__
        reason = str(e)

    return {
      'pass': score > 0.5,
      'score': score,
      'reason': reason,
    }# Insert your scoring logic here...