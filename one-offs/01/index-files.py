import datetime
import hashlib
import os
import re
import sqlite3
import sys

print(sys.argv[1])

# open sqlite3 database for indexing
def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d
db = sqlite3.connect('./files.sqlite3')
db.row_factory = dict_factory
c = db.cursor()

# from stackoverflow
def file_sha1sum(filename):
    # BUF_SIZE is totally arbitrary, change for your app!
    BUF_SIZE = 65536  # lets read stuff in 64kb chunks!

    sha1 = hashlib.sha1()

    with open(filename, 'rb') as f:
        while True:
            data = f.read(BUF_SIZE)
            if not data:
                break
            sha1.update(data)
        return sha1.hexdigest()

def iterateOverFiles(root):
    for dirpath, dirnames, filenames in os.walk(root):
        for f_name in filenames:
            yield os.path.join(dirpath, f_name)


for filepath in iterateOverFiles(sys.argv[1]):
    #if not filepath[-3:] == 'mkv':
    #    continue
    stat = os.stat(filepath)

    if stat.st_size < 100000:
        print('Skipping small file: ' + filepath)

    # get stat info
    # look up file in files table
    # if found
    #   compare filesystem stat info: bytes, created, modified
    #   if those are the same, assume hash hasn't changed
    # if not found
    #   hash the file
    #   add to files table

    # extract timestamp from filename
    #filename = os.path.basename(filepath)

    stat = os.stat(filepath)
    c = db.cursor()
    c.execute('SELECT sha1,fileSystemCreatedAt,fileSystemModifiedAt,byteLength FROM files WHERE path=?', (filepath,))
    rows = c.fetchmany()
    if len(rows) > 0:
        # compare filesystem stat info: bytes, created, modified
        row = rows[0]
        if stat.st_size == row['byteLength'] and stat.st_mtime == row['fileSystemModifiedAt'] and stat.st_ctime == row['fileSystemCreatedAt']:
            print('Already indexed. Skipping: ' + filepath)
        else:
            # update row
            print('Details changed, perhaps we should update files row: ' + filepath)
    else:
        hash = file_sha1sum(filepath)
        print('Found new file. Indexing: ' + filepath)
        c.execute('INSERT INTO files (sha1,path,fileSystemCreatedAt,fileSystemModifiedAt,byteLength) VALUES(?,?,?,?,?)', (hash, filepath, stat.st_ctime, stat.st_mtime, stat.st_size))
        db.commit()
        
