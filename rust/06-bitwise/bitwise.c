#include <stdio.h>

void main() {
    unsigned char a;
    unsigned char b;

    /*
    1 << 1 = 2
    0000 0001
    0000 0010
    */
    a = 1;
    b = a << 1;
    printf("%d, %d\n", a, b); // should be 2

    /*
    128 << 1 = 0
    1000 0000
    0000 0000
    */
    a = 128;
    b = a << 1;
    printf("%d, %d\n", a, b); // should be 0

    /*
    1 << 9 = 0
    0000 0001
    0000 0000
    */
    a = 1;
    b = a << 9;
    printf("%d, %d\n", a, b); // should be 0

    /*
    255 + 1 = 0
    1111 1111
    0000 0000
    */
    a = 255;
    b = a + 1;
    printf("%d, %d\n", a, b); // should be 0

}
