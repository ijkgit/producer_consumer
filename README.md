# Producer Consumer Progress
"Producer Consumer Problem" solved by JavaScript

I have implemented the "Producer-Consumer Problem with Circular Buffer" in JavaScript for this assignment.

The program allows you to input the buffer size and visually observe the production and consumption processes through the Produce and Consume buttons.

![image](https://github.com/ijkgit/producer_consumer/assets/83939775/667025f7-736d-4f79-93e4-cf7d59ddf2ac)

soruce : https://youtu.be/CitsUz-Dx7A?t=114

As JavaScript does not have built-in semaphores, I have implemented a Sleep method to handle the synchronization. The logic of the producer and consumer is implemented based on the provided image.


I have also implemented a critical section using an array to prevent simultaneous access to each buffer index, but it is not reflected in the UI (planned for future updates).


The core part of the producer-consumer problem, including the logic, can be found in the methods produce(), consume(), produceProcess(), and consumeProcess().


![image](https://github.com/ijkgit/producer_consumer/assets/83939775/5479d3bc-6797-413d-bc24-c17969497b25)

The remaining code is related to the UI. 

** Please note ** that there is a bug where the output is not displayed correctly after the buffer completes one cycle. ** This is an area for future improvement. I hope this clarifies the details.