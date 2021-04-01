Welcome back! In our last video we did some defensive programming to handle edge cases in our Rust code. And given that parsing StatsD messages is working well enough, let's review our plan to see what's next ...

We've completed 1 through N. Up next is to work on shading logic.

For our needs, sharding means consistently redirecting a StatsD metric to another StatsD server for processing. We'll make use of a hashing function to map a metric to a server in a consistent fashion.

// talk through Sharding Example section of plan

I found this hashing function created by Dan Bernstein and it looks simple enough so let's give it a try. 

// show djb_hash.c

Let's walk through the C version of the hashing function we'll use and keep in mind how it might need to be different in Rust. First let's talk about types.

* unsigned long - 64 bit integer
* unsigned char *str is pointer to an array of chars, the building blocks of strings in C
* int is 32 bits, can be negative
* line 24 assigment with post-increment, c gets value that the pointer is pointing to. asterisk is a dereference of a pointer, which says: give me the value at this memory address
* bitwise shift left - this will overflow
* adding - this will overflow

Now let's make sure we understand how C handles bitshifting and overflowing add operations. I've made a small C program showcasing the operations we need to port to Rust. I'm using uint8 since they hold a single byte's worth of data and are unsigned. This will make it wasier for us to visualize what's happening at the bit level.

Here we shift a byte with a value of 1 to the left, similarly for 128, and then perform addition that will overflow. Here is the output.

And here's what's happening at the bit level:

// 1 << 1 = 2
0000 0001
0000 0010

// 128 << 1 = 0
1000 0000
0000 0000

So what about the overflowing add? The carry bits get carried off to the left, beyond the size of our type.

// 255 + 1 = 0
1111 1111
0000 0000

For more information on binary addition:
https://en.wikipedia.org/wiki/Binary_number#Addition
https://stackoverflow.com/questions/4068033/add-two-integers-using-only-bitwise-operators

Now let's work through Rust equivalents. First of course I'm going to use Cargo to scaffold out a Rust test application so we can write some code.

`cargo new bitwise`

I've already written naive Rust equivalents to save time, so let's start with those.

1. shift to the left
1. for fun: big shift with obvious overflow
1. overflowing add

That's enough for now. We've figured out how to do the bitwise operations and overflowing adds that are required for our hashing function. In the next video we'll put it all together.
