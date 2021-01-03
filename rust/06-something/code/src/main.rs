use regex::Regex;
use std::net::UdpSocket;
use std::str;

fn main() {
    let socket = UdpSocket::bind("192.168.1.128:5001").expect("Could not bind");

    // TODO: choose something larger than max UDP packet size. pull from OS?
    let mut buf = [0; 1024];
    let mut running = true;

    let re = Regex::new(r"[,:]").expect("Failed to compile regex");

    while running {
        
        let (amt, _src) = socket.recv_from(&mut buf).expect("Failed to receive from UDP socket");

        // TODO: shard the metric+tags to a destination statsd server
        // TODO: queue up each line into the list appropriate for the destination server
        // TODO: concurrently send to those when data has arrived, batching up as much as possible,
        // but not for longer than 10 seconds

        // TODO: skip utf8 checks for speed?
        // TODO: properly handle invalid UTF8
        let data = str::from_utf8(&buf[..amt]).unwrap();
        for line in data.lines() {
            // TODO: properly handle empty lines
            let mut parts: Vec<&str> = re.split(line).collect();
            // TODO: handle case where parts isn't a Vec with 2+

            // If we ensure parts has expected num elements, these are safe
            let measurement: &str = parts.remove(0);
            let _measurement_type: &str = parts.pop().unwrap();
            parts.sort();
            // Push measurement back onto the front
            parts.insert(0, measurement);
            let shardable_metric = parts.join(",");

            // TODO: trim whitespace and skip empty lines
            println!("Got line: {}", shardable_metric);
        }
    }

}

