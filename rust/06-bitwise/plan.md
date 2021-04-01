# PLAN

1. listen for UDP
1. parse messages
    * might be more than 1 metric in message, separated by newline
    * parse statsd format
        * perhaps using regular expression matching so we can learn how to do that in rust. hopefully it uses slices behind the scenes, and provides us an easy way to loop over values without having to keep track of character positions ourselves
        * OR, FOR FUN write parsing logic by hand since StatsD is pretty simple
1. normalize statsd metric data
    * tags might be sent in inconsistent order
    * need to normalize so we shard correctly
1. create hash/sharding function to map normalized statsd metrics to one of N destination servers
1. add messages to the server's queue according to sharding
1. send those messages off to the correct destination server
    * with concurrency, eventually
    * make use of # cpu cores (threads, something)


# SHARDING EXAMPLE

These two metrics must go to the same backend server since the measurement and tag tuple are "the same".

`users.logins,country=US,host=1.2.3.4:1|c`

`users.logins,host=1.2.3.4,country=US:1|c`

If there are more than 1 backend servers, this might shard to a different one:

`users.logins,host=5.6.7.8,country=US:1|c`





# TODO

choose something larger than max UDP packet size

walk the buffer, noting end of metric+tags, looking for end of line

parse the tags, sort and create a unique tag set

shard the metric+tags to a destination statsd server

queue up each line into the list appropriate for the destination server

concurrently send to those when data has arrived, batching up as much as possible, but not for longer than 10 seconds

Should we skip utf8 checks (when converting recieved bytes) for speed?

properly handle invalid UTF8

exclude bytes beyond amt .... slice of array somehow?
