use regex::Regex;

fn main() {
    
    let text = "users.logins,host=webserver01,country=US:1|c";
    //         "users.logins,country=US,host=webserver01:2|c";

    // Second attempt - splitting
    // let's try splitting on comma or colon instead
    let re = Regex::new(r"[,:]").expect("Failed to compile regex");

    // since we're removing, parts needs to be mutable
    // re split returns an iterator, so maybe collect() returns the underlying data structure
    // since we want to modify the vec, that seems like something to roll with
    let mut parts: Vec<&str> = re.split(text).collect();
    // TODO: handle case where parts isn't a Vec with 2+

    // If we ensure parts has expected num elements, these are safe
    let metric: &str = parts.remove(0);
    let type_stuff: &str = parts.pop().unwrap();
    
    println!("Metric: {}", &metric);
    println!("Type stuff: {}", &type_stuff);

    // we use an iter to avoid "moving" parts during the for loop
    // quirky, but kinda makes sense
    for part in parts.iter() {
        println!("Tag: {}", &part);
    }
    parts.sort();
    for part in parts.iter() {
        println!("Tag: {}", &part);
    }

    // Push metric back onto the front
    parts.insert(0, metric);
    let shardable_string = parts.join(",");
    println!("Joined: {}", &shardable_string);

}
