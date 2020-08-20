#!/bin/bash
rm -f files.sqlite3
sqlite3 files.sqlite3 < schema.txt
