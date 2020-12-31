Good morning, and Happy New Year!

If you're new to this series of videos, I am writing a sharding StatsD proxy in Rust as a way to learn the language. And today we're going to handle some edge cases to avoid crashes

I think I remarked in 2 previous videos about the collect() function. This one here, where we collect our Regex split() results int a Vec. So I finally looked it up, and it does what you'd expect: it turns an iterable into a collection. See here: https://doc.rust-lang.org/std/iter/trait.Iterator.html#method.collect If you want to get technical, the split() function returns a Split struct, which implements the Iterator trait, which is why we can use the collect() function.

Talk about MTU, and finding it on linux. Haven't found programmatic way to query it from Rust yet.

Talk thorugh string length
Show lines function in docs
Show len() function

Looks like line.len() -- which returns bytes -- should be sufficient. Other option is to use chars().count(), which interprets bytes as unicode characters. Doesn't seem necessary since the present of any bytes indicates we have something to parse.

Check that parts length is at least 2. Not a robust check, but hopefully good enough

Seems good for now
