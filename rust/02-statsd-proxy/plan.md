# PLAN

* listen for UDP
* parse messages
    * might be more than 1 metric in message, separated by newline
    * parse statsd format
        * perhaps using regular expression matching so we can learn how to do that in rust. hopefully it uses slices behind the scenes, and provides us an easy way to loop over values without having to keep track of character positions ourselves
        * OR, FOR FUN write parsing logic by hand since StatsD is pretty simple
* normalize statsd metric data
    * tags might be sent in inconsistent order
    * need to normalize so we shard correctly
* choose hash/sharding function to map normalized statsd message to one of N destination servers
* queue up in the server's queue
* send those messages off to the correct destination server
    * with concurrency, eventually
    * make use of # cpu cores (threads, something)





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
