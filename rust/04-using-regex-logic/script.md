Welcome back! Last time we used a regular expression to split apart a StatsD message. This allowed us to normalize the tag order, which may vary between messages containing the same metric. We use the normalized tag order to create a normalized metric string, and with this we can ensure that we consistently shard the same metric to the same StatsD server.

The code we wrote last time was standalone, as we worked through how to use Rust's regex library to parse a StatsD message. So let's merge that logic into our existing codebase.

* Copy in
* Refactor
* Any need for functions?
* Where might we put sharding logic?
* Where might we set up queues?

----

http://www.cse.yorku.ca/~oz/hash.html



