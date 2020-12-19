Good morning! I hope you're ready because it's regex day. We'll continue our work on a sharding StatsD proxy. This time we're going to lightly parse the StatsD messages using regular expressions. Once parsed we can normalize the message to ensure consistent sharding. If you recall from a previous video that two different StatsD messages might have the same metric name and tags, but with tags specified in a different order. We need to make sure those messages get sharded to the same server, which is why we're going to parse and normalize. More on that later.

When I first thought about using regaular expressions to parse the statsd message I envisioned specying capture groups so I could easily loop over matched tags if there are any. But captures in rust don't seem to support that, as we'll see. So let's start there.

I did a search for regex and rust, and found the regex crate. One of the first examples on the doc seemed to be exactly what I wanted: iterating over capture groups. Here's the example code adapted for parsing StatsD messages.

If you noticed in the regular expression that the 3rd parenthesis starts a capture group that might occur 0 or more times. This is the tag portion of the StatsD message. But it looks like the regex crate only returns the last matched string from that repetiton. Other languages like PHP give you an array of the strings matched by that capture group. Maybe I'm missing something, but it looks like we have to try another approach.

Since the StatsD message format is pretty simple, we can use splitting to separate the different portions of the message. We'll split on comma or colon and that should give us enough data to work with.

* First we're going to split
* Then we'll pull off the leading and trailing items so we're left with tags
* We'll sort that
* Then re-join into a string that we can run through our sharding function



```
use regex::Regex;

fn main() {
    
    let text = "users.logins,host=webserver01,country=US:1|c";
    // First attempt - using captures
    // This doesn't allow us to loop over captured tags
    /*
    let re = Regex::new(r"([^,]+)((,[a-zA-Z0-9=]+)*)(:[0-9]+\|[c])").expect("Failed to compile regex");
    for cap in re.captures_iter(text) {
        println!("Measurement: {}", &cap[2]);
    }
    */

    // Second attempt - splitting
    // let's try splitting on comma or colon instead
    let re = Regex::new(r"[,:]").expect("Failed to compile regex");
    // since we're removing, parts needs to be mutable
    // re split returns an iterator, so maybe collect() returns the underlying data structure
    // since we want to modify the vec, that seems like something to roll with
    let parts: Vec<&str> = re.split(text).collect();
    // TODO: handle case where parts isn't a Vec with 2+

    // If we ensure parts has expected num elements, these are safe
    let metric: &str = parts.remove(0);
    let type_stuff: &str = parts.pop().unwrap();
    
    println!("Metric: {}", &metric);
    println!("Type stuff: {}", &type_stuff);

    // we use an iter to avoid "moving" parts during the for loop
    // quirky, but kinda makes sense
    for part in parts {
        println!("Tag: {}", &part)
    }
    parts.sort();
    for part in parts {
        println!("Tag: {}", &part)
    }
    // Could then pull off first and last elements to prefix and suffix
    // Vec is growable
    // Vec.remove(0) and pop()
    // Then sort remaining array of tags?
    // Vec.sort() ?
    // Find out how to sort array of strings
    // Then concat all together with commas and colon
    // Then concat together with commas minus the colon portion
    // This becomes the portion we'll run through our sharding function
    // We don't want to hash on the later portion, here's an example of why
    // For now our hashing function will be length modulus N
    //If metric is a count, and we increment by 1 in most places but by 2 in another, we want those to has to the same statsd
    //server. Otherwise aggregation will take place on 2 different servers, and the last one to write will squash a previous
    //value in the database

    // Push metric back onto the front
    parts.insert(0, metric);
    let shardable_string = parts.join(r",");
    println!("Joined: {}", &shardable_string);

}
```
