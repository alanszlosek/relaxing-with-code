Hi all! In this video I wanted to share a way to do JPEG "movies" in the browser. It's not very efficient in terms of bandwidth or CPU usage, but it's cool nevertheless.

1. here's what it looks like: images flipping in the browser with minimal html, no client-side javascript
    - show page source
    - python app serving this page and the image
    - to serve jpeg, loops over folder of images sending each as the "new data" for the image
2. this is possible because of a HTTP protocol feature called multipart, specifically multipart/x-mixed-replace

3. but first here's what a normal HTTP GET request looks like, stripped to the bare minimum
    cat http-index.txt | nc 127.0.0.1 8080
4. open two terminals
    - left with main.py running
    - right with netcat to index.html

5. now show multiple response body

6. now show the webserver init at the bottom
7. then the index.html handling code

8. show signal handling

9. show image reading into list of images, each element being array of JPEG encoded bytes,
    stored in memory so we can quickly write out in response

10. now the multipart code
    - show terminal with multipart output next to the code

11. change frame rate

that's it!

Now, keep in mind these are full JPEGs sent the browser repeatedly. So they consume much more bandwidth than a video would. Also, if you try to send large images quickly, the browser likely won't be able to keep up with decoding the JPEG and displaying it. So keep that in mind.

Alright, thanks for watching!
