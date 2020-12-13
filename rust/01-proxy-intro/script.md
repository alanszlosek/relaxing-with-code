Welcome! I've wanted to learn the Rust programming language for a while and the best way for me to learn is by working on a small project.
So that's what this series of videos will cover. 
The tool I want to create is inspired by a challenge encountered at work regarding StatsD metrics. 
Let's walk through the problem first, and then we'll dive into Rust, likely in the second vid

We'll use Mermaid to visualize while I talk:

https://mermaid-js.github.io/mermaid-live-editor/#/edit/dW5kZWZpbmVk

MERMAID WEBSERVERS TO STATSD

graph TD
	LoadBalancer --> Webserver1
	LoadBalancer --> Webserver2
	LoadBalancer --> Webserver3
	Webserver1 -->|login metric| StatsD
	Webserver2 -->|login metric| StatsD
	Webserver3 -->|login metric| StatsD
	StatsD -->|aggregated metrics| InfluxDB

Here we have three webservers all handling website requests. 
With a webapp, one measurement that's helpful to keep track of is the number of user logins per minute. 
A lightweight way to track this information is by using StatsD metrics. 
It's much lighter than having each webserver attempt to increment a counter in a database. 
Here's how it works:

Webapp code is modified to send a UDP message to central StatsD server whenever a login occurs. 
The message body says there was a login event, and here's what the StatsD message might look like:

users.logins,country=US,host=web-hostA:1|c

The StatsD server queues up the messages it receives from each webserver. 
Then every 10 seconds it does aggregation. In this case it will add the login counts together then save to a timeseries database like Influx.

But if your site is high traffic, and your code emits many different types of metrics, the single StatsD server might get overwhelmed with the different StatsD metrics it's receiving. 
Perhaps it's not able to queue up and process 100k+ metrics in a timely fashion every 10 seconds. 
In this case, it might be a good idea to proxy and split the data to more than 1 StatsD server. 
That's what our project will do. And here's what that architecture might look like.

MERMAID WEBSERVERS TO STATSD PROXY

graph TD
	LoadBalancer --> Webserver1
	LoadBalancer --> Webserver2
	LoadBalancer --> Webserver3
	Webserver1 -->|login metric| StatsDProxy
	Webserver2 -->|login metric| StatsDProxy
	Webserver3 -->|login metric| StatsDProxy
	StatsDProxy -->|metrics shard1| StatsD1
	StatsDProxy -->|metrics shard2| StatsD2
	StatsD1 -->|aggregated metrics shard1| InfluxDB
	StatsD2 -->|aggregated metrics shard2| InfluxDB

We're going to implement the StatsDProxy piece in Rust.

Here's the plan ... let's walk through it

Brief aside on why sharding is necessary... aggregation and saving to DB

END VIDEO near 10 minute mark

talk thorugh udb socket sample code
? error propagation operation is not what i want right now
loop and receive, splitting lines
show using slice and not







Let's learn Rust by doing.  using a fairly complex project.

use case is a statsd proxy. let's give quick overview of what app metrics are

- bunch of webservers all handling user logins ... how do you efficiently keep count of the number of logins per minute?
- show stasd pag4e, sample metric message
- send fire and forget message to central server to increment a named counter
- in memory
- not stored in DB yet ... memory IO is much faster than incrementing counter on disk or in database
- persist to disk periodically



- error handling
	- Rust Lang book has some good info. but since it tries to be thorough it's a bit verbose. that's to say the info is there, just have to do some reading. 
	- ? is for if you want to propagate up ... which we don't weant to do right now, so fel we should use expect
	


origin said slow fumble through rust, but stumble sounds better
slow stumble through rust
