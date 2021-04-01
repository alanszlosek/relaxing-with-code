fn main() {
    let mut a: u8;
    let mut b: u8;

    // 1 << 1
    a = 1;
    b = a << 1;
    println!("{}, {}", a, b);


    // 128 << 1
    a = 128;
    b = a << 1;
    println!("{}, {}", a, b);

    /*
    // 1 << 9
    a = 1;
    b = a << 9;
    println!("{}, {}", a, b);
    */


    a = 255;
    //b = a + 1;
    b = a.wrapping_add(1);
    println!("{}, {}", a, b);

    
    /*
    See also:
    overflowing_add()
    saturating_add()

    https://doc.rust-lang.org/std/primitive.u32.html
    */

}
