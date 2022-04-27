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
    ComputedRe   =  auth(key, Ch)
    assert ComputedRe == Re

    key  =  bytearray.fromhex('FB721110280A4394D2B6FCD076B59818')
    Ch   =  bytearray.fromhex('06EABEEFE5CF1C49C1CA859EA9EB197E')
    Re   =  bytearray.fromhex('4F4FD61CBE683EC80E574E4C4FC43A53')
    ComputedRe   =  auth(key, Ch)
    assert ComputedRe == Re

    key  =  bytearray.fromhex('946969452468530E888D7C57AAFC509F')
    Ch   =  bytearray.fromhex('F514B3172333C65F01EC9BDFA16E0DC1')
    Re   =  bytearray.fromhex('061F7C2CB9132B2FF4D3EDEE9F7D3866')
    ComputedRe   =  auth(key, Ch)
    assert ComputedRe == Re

if __name__ == "__main__":

    test_auth()
