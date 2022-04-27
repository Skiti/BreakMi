#!/usr/bin/env python

"""
pairing_tests.py

Tests Xiaomi pairing

"""

from pairing import *

def test_pairing_v2():
    """Test Xiaomi pairing v2."""


    seed  =  bytearray.fromhex('69DF29231C52F948EC0A1188803E9EA7')
    mb_a  =  bytearray.fromhex('E0C4A3D6D13E ')
    key  =  bytearray.fromhex('C33D3EF72CD974853857F9201A65F252')
    Computedkey   =  kdf(seed, mb_a)
    assert Computedkey == key


    seed  =  bytearray.fromhex('B44C80DD44080896516C74DF90EFF4A7')
    mb_a  =  bytearray.fromhex('E0C4A3D6D13E ')
    key  =  bytearray.fromhex('FB721110280A4394D2B6FCD076B59818')
    Computedkey   =  kdf(seed, mb_a)
    assert Computedkey == key


    seed  =  bytearray.fromhex('E4B0A3B5F40BF12FE411B17963C67C89')
    mb_a  =  bytearray.fromhex('E0C4A3D6D13E ')
    key  =  bytearray.fromhex('946969452468530E888D7C57AAFC509F')
    Computedkey   =  kdf(seed, mb_a)
    assert Computedkey == key


if __name__ == "__main__":

    test_pairing_v2()
