# Protocol Dissectors

## Pairing and Authentication Tests

Given inputs and outputs that we retrieved from real capture files, we can test that we correctly reversed the logic behind Pairing and Authentication.

## Dissect

The [scapy](https://scapy.net/) classes we developed for dissecting Xiaomi proprietary Pairing and Authentication protocols.

## Makefile

An utility that makes it easier to run the other scripts. Just run `make`, `make tests` or `make dissect`.
The script running without errors, means that the expected output of the test is consistent with the real output (given to the script together with the input).
