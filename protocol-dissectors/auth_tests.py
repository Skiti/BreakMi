#!/usr/bin/env python

"""
auth_tests.py

Tests Xiaomi unilateral auth

"""

from auth import *

def test_auth():
    """Test Xiaomi authentication."""

    key  =  bytearray.fromhex('C33D3EF72CD974853857F9201A65F252')
    Ch   =  bytearray.fromhex('90983782D557B2F77C79D78630482154')
    Re   =  bytearray.fromhex('A20D47A3B2A1D0B35343950A79FA293D')
    print('Xiaomi key is C33D3EF72CD974853857F9201A65F252')
    print('Xiaomi challenge is 90983782D557B2F77C79D78630482154')
    print('The expected response is A20D47A3B2A1D0B35343950A79FA293D')
    ComputedRe   =  auth(key, Ch)
    print('We calculate the following response: ' + ComputedRe.hex().upper())
    assert ComputedRe == Re
    print('Test 1 passed\n')

    key  =  bytearray.fromhex('FB721110280A4394D2B6FCD076B59818')
    Ch   =  bytearray.fromhex('06EABEEFE5CF1C49C1CA859EA9EB197E')
    Re   =  bytearray.fromhex('4F4FD61CBE683EC80E574E4C4FC43A53')
    print('Xiaomi key is FB721110280A4394D2B6FCD076B59818')
    print('Xiaomi challenge is 06EABEEFE5CF1C49C1CA859EA9EB197E')
    print('The expected response is 4F4FD61CBE683EC80E574E4C4FC43A53')
    ComputedRe   =  auth(key, Ch)
    assert ComputedRe == Re
    print('We calculate the following response: ' + ComputedRe.hex().upper())
    print('Test 2 passed\n')

    key  =  bytearray.fromhex('946969452468530E888D7C57AAFC509F')
    Ch   =  bytearray.fromhex('F514B3172333C65F01EC9BDFA16E0DC1')
    Re   =  bytearray.fromhex('061F7C2CB9132B2FF4D3EDEE9F7D3866')
    print('Xiaomi key is 946969452468530E888D7C57AAFC509F')
    print('Xiaomi challenge is F514B3172333C65F01EC9BDFA16E0DC1')
    print('The expected response is 061F7C2CB9132B2FF4D3EDEE9F7D3866')
    ComputedRe   =  auth(key, Ch)
    assert ComputedRe == Re
    print('We calculate the following response: ' + ComputedRe.hex().upper())
    print('Test 3 passed\n')

if __name__ == "__main__":

    test_auth()
