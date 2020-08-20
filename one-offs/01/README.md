# Finding Duplicate Files

Use these scripts to calculate sha1 sums for all files within a folder and store the results in an sqlite3 database. Then you can query the database for duplicates based on the hash.

## Setup

1. setup.sh
2. python3 index-files.py /folder/to/index
3. sqlite3 files.sqlite3
4. select sha1,path from files where sha1 in (select sha1 from files group by sha1 having count(sha1) > 1) order by sha1,path;

