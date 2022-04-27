#!/usr/bin/env python

"""
auth.py

Xiaomi unilateral auth

"""

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend

from constants import *

def auth(key: bytearray, Ch: bytearray) -> bytearray:
    """Generate authentication response
        key shared long term key, 16 byte
        Ch challenge from the MB, 16 byte
        Returns Re, 16 byte

    """
    assert type(key) == bytearray and len(key) == PAIR_KEY_BYTES
    assert type(Ch) == bytearray and len(Ch) == CHAL_BYTES

    encryptor = Cipher(
        algorithms.AES(key),
        modes.ECB(),
        default_backend()
    ).encryptor()
    Re = encryptor.update(Ch)

    return Re


if __name__ == "__main__":

    pass

