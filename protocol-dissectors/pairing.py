#!/usr/bin/env python

"""
pairing.py

Xiaomi pairing v1 and v2

"""
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
import binascii

from constants import *

def kdf(seed: bytearray, mb_a: bytearray) -> bytearray:
    """Generate pairing v2 key
        seed, 16 byte
        mb_a BTADD of the tracker, 6 byte
        Returns key, 16 byte

    """
    assert type(seed) == bytearray and len(seed) == SEED_BYTES
    assert type(mb_a) == bytearray and len(mb_a) == BTADD_LEN

    d = hashes.Hash(hashes.SHA256(),default_backend())
    d.update(mb_a)
    d.update(seed)
    key = bytearray(d.finalize())[0:16]

    assert type(key) == bytearray and len(key) == PAIR_KEY_BYTES
    return key


if __name__ == "__main__":

    pass

