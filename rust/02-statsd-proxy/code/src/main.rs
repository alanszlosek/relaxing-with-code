use std::net::UdpSocket;
use std::str;

fn main() {
    let socket = UdpSocket::bind("192.168.1.128:5001").expect("Could not bind");

    // TODO: choose something larger than max UDP packet size
    let mut buf = [0; 1024];
    let mut running = true;

    while running {
        
        let (amt, src) = socket.recv_from(&mut buf).expect("Failed to receive from UDP socket");

        // TODO: how do we walk the buffer, noting end of metric+tags, looking for end of line
        // TODO: parse the tags, sort and create a unique tag set
        // TODO: shard the metric+tags to a destination statsd server
        // TODO: queue up each line into the list appropriate for the destination server
        // TODO: concurrently send to those when data has arrived, batching up as much as possible,
        // but not for longer than 10 seconds

        // TODO: skip utf8 checks for speed?
        // TODO: properly handle invalid UTF8
        // TODO: exclude bytes beyond amt .... slice of array somehow?
        let data = str::from_utf8(&buf[..amt]).unwrap();
        for line in data.lines() {
            // TODO: trim whitespace and skip empty lines
            println!("Got line: {}", line);
        }
    }

}

