pong.js
=======

Demo Page: https://www.left-right-up-down.com

VERSION 1.0
-------------------------------------------------------------------------
This library was written to insert a game of 1-player playable PONG into
any web page without additional work. The only requirement for this
library is jQuery 1.11.0 (tested) though it likely works with jQuery 1.10
as well (untested).

CONTROLS
-------------------------------------------------------------------------
SPACE - ause/unpause
Q - Move blue (P1) paddle up
A - Move blue (P1) paddle down
R - Reset game
ESC - Close game

COMMANDS
-------------------------------------------------------------------------
To open the game window and start a game of pong, call
    
    PONG.start()

anytime within or after the document is ready. Example usage:

    $(document).ready(function(){
        PONG.start();
    });


BUGS
-------------------------------------------------------------------------
There are a couple known bugs.
 - It's possible to stop the ball by sliding the paddle upwards as the
ball comes down towards the paddle. I thought I fixed this in a previous
version, but it seems to have come back.
 - The AI is version 0.2 alpha and as such, isn't always smooth
in it's movement.

Whether or not these bugs will be fixed in a future update is tbd.

LICENSE
-------------------------------------------------------------------------
The MIT License (MIT)

Copyright (c) 2014 Joe.V.Greathead

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

QUESTIONS
-------------------------------------------------------------------------
Got questions, comments? Email me at joe.v.greathead@gmail.com
