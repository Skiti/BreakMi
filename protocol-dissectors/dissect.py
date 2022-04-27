"""
dissect.py

tracker (tra) is the BLE peripherl and application (app) is the BLE central.

"""

import os
from scapy.all import *
from constants import *


class PairInit(Packet):
    version = b"\x01"
    name = "PairInit: app -> tra"
    fields_desc = [
        XNBytesField("pair_init", 0x0100, 2),
    ]


class PairRespV1(Packet):
    version = b"\x01"
    name = "PairRespV1: tra -> app"
    fields_desc = [
        XNBytesField("pair_resp",  0x1001, 2),
        XByteField("pair_v1", 0x04),
    ]


class PairRespV2(Packet):
    version = b"\x01"
    name = "PairRespV2: tra -> app"
    fields_desc = [
        XNBytesField("pair_resp",  0x1001, 2),
        XNBytesField("pair_v2", 0x8101, 2),
        XNBytesField("const_pub_key", 0x1863c2cce5d159413bed92c4b163c279, 16),
    ]


class PairKeyRes(Packet):
    version = b"\x01"
    name = "PairKeyRes: app -> tra"
    fields_desc = [
        XNBytesField("kr",  0x0100,  2),
        XNBytesField("key",  None,  16),
    ]


class PairSeedReq(Packet):
    version = b"\x01"
    name = "PairSeedReq: app -> tra"
    fields_desc = [
        XNBytesField("sr",  0x8200,  2),
        XByteField  ("sr2", 0x02),
    ]


class PairSeedRes(Packet):
    version = b"\x01"
    name = "PairSeedRes: tra -> app"
    fields_desc = [
        XNBytesField("sr",  0x1082,  2),
        XByteField  ("sr2", 0x01),
        XNBytesField("seed",  None,  16),
    ]


class PairCompleteV1(Packet):
    version = b"\x01"
    name = "PairCompleteV1: tra -> app"
    fields_desc = [
        XNBytesField("pcom",  0x1001,  2),
        XByteField  ("pcom2", 0x01),
    ]


class PairCompleteV2(Packet):
    version = b"\x01"
    name = "PairCompleteV2: tra -> app"
    fields_desc = [
        XNBytesField("pcom",  0x1083,  2),
        XByteField  ("pcom2", 0x01),
    ]


class AuthReqV1(Packet):
    version = b"\x01"
    name = "AuthReqV1: app -> tra"
    fields_desc = [
        XNBytesField("ar",  0x0200,  2),
        XByteField  ("ar2", 0x02),
    ]


class AuthReqV2(Packet):
    version = b"\x01"
    name = "AuthReqV2: app -> tra"
    fields_desc = [
        XNBytesField("ar",  0x8200,  2),
        XByteField  ("ar2", 0x02),
    ]


class AuthChalV1(Packet):
    version = b"\x01"
    name = "AuthChalV1: tra -> app"
    fields_desc = [
        XNBytesField("ac",  0x1002,  2),
        XByteField  ("ac2", 0x01),
        XNBytesField("ch",  None,  16),
    ]


class AuthChalV2(Packet):
    version = b"\x01"
    name = "AuthChalV2: tra -> app"
    fields_desc = [
        XNBytesField("ac",  0x1082,  2),
        XByteField  ("ac2", 0x01),
        XNBytesField("ch",  None,  16),
    ]


class AuthRespV1(Packet):
    version = b"\x01"
    name = "AuthRespV1: app -> tra"
    fields_desc = [
        XNBytesField("ar",  0x0300,  2),
        XNBytesField("re",  None,  16),
    ]


class AuthRespV2(Packet):
    version = b"\x01"
    name = "AuthRespV2: app -> tra"
    fields_desc = [
        XNBytesField("ar",  0x8300,  2),
        XNBytesField("re",  None,  16),
    ]

if __name__ == "__main__":

     # NOTE: pairing v1
    prv1 = PairRespV1()
    pk = PairKeyRes(key=os.urandom(PAIR_KEY_BYTES))

    # NOTE: pairing v2
    pi = PairInit()
    prv2 = PairRespV2()
    sreq = PairSeedReq()
    sres = PairSeedRes(seed=os.urandom(SEED_BYTES))

    pc = PairCompleteV2()
    
    # NOTE: auth

    ach = AuthChalV2(ch=os.urandom(CHAL_BYTES))
    are = AuthRespV2(re=os.urandom(RESP_BYTES))

