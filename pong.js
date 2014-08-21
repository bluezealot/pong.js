// -------------------------------------------------------------------------
// PONG.js written by joe.v.greathead at gmail dot com
// -------------------------------------------------------------------------
// VERSION 1.0 alpha (aka first version) +++++++++++++++++++++++++++++++++++
// -------------------------------------------------------------------------
// This library was written to insert a game of 1-player playable PONG into
// any web page without additional work. The only requirement for this
// library is jQuery 1.11.0 (tested) though it likely works with jQuery 1.10
// as well (untested).
// -------------------------------------------------------------------------
// CONTROLS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// -------------------------------------------------------------------------
// SPACE - ause/unpause
// Q - Move blue (P1) paddle up
// A - Move blue (P1) paddle down
// R - Reset game
// ESC - Close game
// -------------------------------------------------------------------------
// COMMANDS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// -------------------------------------------------------------------------
// To open the game window and start a game of pong, call
//     
//     PONG.start()
//
// anytime within or after the document is ready. Example usage:
//
//     $(document).ready(function(){
//         PONG.start();
//     });
//
// -------------------------------------------------------------------------
// BUGS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// -------------------------------------------------------------------------
// There are a couple known bugs.
//  - It's possible to stop the ball by sliding the paddle upwards as the
// ball comes down towards the paddle. I thought I fixed this in a previous
// version, but it seems to have come back.
//  - The AI is version 0.2 alpha and as such, isn't always smooth
// in it's movement.
// 
// Whether or not these bugs will be fixed in a future update is tbd.
// -------------------------------------------------------------------------
// LICENSE +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// -------------------------------------------------------------------------
// The MIT License (MIT)
//
// Copyright (c) 2014 Joe.V.Greathead
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// -------------------------------------------------------------------------
// QUESTIONS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// -------------------------------------------------------------------------
// Got questions, comments? Email me at joe.v.greathead@gmail
// -------------------------------------------------------------------------

var PONG = (function(){
    var body =
        '<div id="game-pong-wrapper" style="width:100%; height:100%;position:absolute;top:0;left:0;">'
            + '<div id="game-pong-modal-bg" style="width:100%; height:100%;z-index:1000000;background-color:#CCC;opacity:0.6;"></div>'
            + '<div id="game-pong-field" style="width:50%;height:50%;position:absolute;left:25%;top:25%;overflow:hidden;border:1px solid #000;z-index:1000001;background-color:#FFF;">'
                + '<div id="game-pong-top" style="width:100%;height:1px;position:absolute;top:-1px;left:0px;"></div>'
                + '<div id="game-pong-left" style="width:1px;height:100%;position:absolute;top:0px;left:-1px;"></div>'
                + '<div id="game-pong-score" style="position: absolute; left: 25%; top: 10px; width: 50%; display: block;padding: 0 auto;">'
                    + '<div id="game-pong-p1Score" style="float: left;">0</div>'
                    + '<div id="game-pong-p2Score" style="float: right;">0</div>'
                + '</div>'
                + '<p id="game-pong-extraMsg" style="position:absolute;left:35%;top:30%;width:30%;text-align:center;"></p>'
                + '<div style="position:absolute;left:35%;top:60%;width:30%;text-align:center;">'
                    + '<p id="game-pong-pausedMsg">PAUSED</p>'
                    + '<p id="game-pong-startMsg">Press SPACE to un-pause.</p>'
                + '</div>'
                + '<div id="game-pong-blue" style="border-radius: 0 5px 5px 0;background-color: blue; height: 30%; width: 10px; position: absolute; left: 0px; top: 35%;"></div>'
                + '<div id="game-pong-red" style="border-radius: 5px 0 0 5px;background-color: red; height: 30%; width: 10px; position: absolute; right: 0px; top: 35%;"></div>'
                + '<div id="game-pong-ball" style="border-radius:5px;background-color: black; height: 10px; width: 10px; position: absolute; left: 50%; top: 50%;"></div>'
                + '<div id="game-pong-right" style="width:1px;height:100%;position:absolute;top:0px;right:-1px;"></div>'
                + '<div id="game-pong-bottom" style="width:100%;height:1px;position:absolute;bottom:-1px;left:0px;"></div>'
                + '<div id="game-pong-exit" style="cursor: pointer;position:absolute;left:45%;bottom:10px;width:10%;text-align:center;border:1px solid #000;border-radius:5px;">exit game</div>'
            + '</div>'
        + '</div>',
        GAME_SPEED = 5,
        BLUE_SPEED = 3,
        RED_SPEED = 3,
        BALL_SPEED = 4,
        GAME_WIN = 10,
        P1UP = 81,
        P1DO = 65,
        P2UP = 80,
        P2DO = 76,
        SPAC = 32,
        RSET = 82,
        ESC = 27,
        pausedMsg,
        startMsg,
        extraMsg,
        red,
        blue,
        ball,
        wrapper,
        field,
        top_bor,
        bottom_bor,
        left_bor,
        right_bor,
        exit,
        dir_x,
        dir_y,
        paused,
        p1Score,
        p2Score,
        p1Score_label,
        p2Score_label,
        collide,
        playGame,
        odd,
        start,
        endTime,
        // sumTime = 0,
        // countLoop = 0,
        //------
        keyMap = {
            keys: [P1UP, P1DO, P2UP, P2DO, SPAC, RSET]
        },
        collision = function(blue, red, angle){
            // blue is generally the ball
            var r_left = Math.round(red.offset().left),
                b_left = Math.round(blue.offset().left),
                r_top = Math.round(red.offset().top),
                b_top = Math.round(blue.offset().top),
                r_x = [r_left, r_left + red.width()],
                b_x = [b_left, b_left + blue.width()],
                r_y = [r_top, r_top + red.height()],
                b_y = [b_top, b_top + blue.height()],
                radian;

            var collision = !((r_x[0] <= b_x[0] && r_x[1] <= b_x[0])
                           || (r_x[0] >= b_x[1] && r_x[1] >= b_x[1])
                           || (r_y[0] <= b_y[0] && r_y[1] <= b_y[0])
                           || (r_y[0] >= b_y[1] && r_y[1] >= b_y[1]));

            if(collision && angle){
                // take red's top off of blue's bottom
                // take red's top off of red's bottom and add 10 for blue's height
                // multiple by 0.8 and add 0.1 for a range of 0.1 - 0.9 PI radians
                radian = ((b_y[1] - r_y[0]) / (r_y[1] - r_y[0] + 10) * 0.80 + 0.1) * Math.PI;
            }

            return collision ? { radian: radian } : false;
        },
        gameStart = function(){
            red = $('#game-pong-red'),
            blue = $('#game-pong-blue'),
            ball = $('#game-pong-ball'),
            pausedMsg = $('#game-pong-pausedMsg'),
            startMsg = $('#game-pong-startMsg'),
            extraMsg = $('#game-pong-extraMsg'),
            wrapper = $('#game-pong-wrapper'),
            field = $('#game-pong-field'),
            top_bor = $('#game-pong-top'),
            bottom_bor = $('#game-pong-bottom'),
            left_bor = $('#game-pong-left'),
            right_bor = $('#game-pong-right'),
            p1Score_label = $('#game-pong-p1Score'),
            p2Score_label = $('#game-pong-p2Score'),
            exit = $('#game-pong-exit'),
            dir_x = -1,
            dir_y = -1,
            paused = true,
            p1Score = 0,
            p2Score = 0,
            playGame = true,
            odd = true;

            ball.css({ left: '50%', top: '50%' });
            blue.css('top', '35%' );
            red.css('top', '35%' );
            p1Score_label.text(p1Score);
            p2Score_label.text(p2Score);
            pausedMsg.show();
            startMsg.show();
            extraMsg.text('');
        },
        gameLoop = function(){
            start = new Date();

            if(!playGame){
                wrapper.remove();
                return;
            }
            odd = !odd;
            if(keyMap[RSET]){
                gameStart();
            }

            if(!paused){

                if(!(keyMap[P1UP] && keyMap[P1DO])){
                    if(keyMap[P1UP]){
                        if((blue.position().top - BLUE_SPEED) > 0){
                            blue.css('top', blue.position().top - BLUE_SPEED);
                        }else{
                            var diff = blue.position().top;
                            if(diff > 1 && diff < BLUE_SPEED){
                                blue.css('top', 0);
                            }
                        }
                    }
                    if(keyMap[P1DO]){
                        if((blue.position().top + blue.height() + BLUE_SPEED) < field.height()){
                            blue.css('top', blue.position().top + BLUE_SPEED);
                        }else{
                            var diff = (field.height() - blue.position().top - blue.height());
                            if(diff > 1 && diff < BLUE_SPEED){
                                blue.css('top', blue.position().top + diff);
                            }
                        }
                    }
                }

                if(dir_x > 0){
                    if(Math.random() > 0.25){
                        var direction = (red.position().top + (red.height() * 0.5)) <= ball.position().top;
                        if(Math.random() > 0.95){
                            direction = !direction;
                        }
                        if(direction){
                            if((red.position().top + red.height() + RED_SPEED) < field.height()){
                                red.css('top', red.position().top + RED_SPEED);
                            }else{
                                var diff = (field.height() - red.position().top - red.height());
                                if(diff > 1 && diff < RED_SPEED){
                                    red.css('top', red.position().top + diff);
                                }
                            }
                        }else{
                            if((red.position().top - RED_SPEED) > 0){
                                red.css('top', red.position().top - RED_SPEED);
                            }else{
                                var diff = red.position().top;
                                if(diff > 1 && diff < RED_SPEED){
                                    red.css('top', 0);
                                }
                            }
                        }
                    }
                }

                // move the ball around
                var left = ball.position().left,
                    top = ball.position().top;

                ball.css({
                    left: left + (BALL_SPEED * dir_x),
                    top: top + (BALL_SPEED * dir_y)
                });

                if(collision(ball, top_bor) || collision(ball, bottom_bor) ){
                    ball.css({ left: left, top: top });
                    dir_y *= -1;
                }
                if(collision(ball, left_bor)){
                    // back to start, made a score
                    dir_x = 1,
                    dir_y = -1;
                    ball.css({ left: '50%', top: '50%' });
                    p2Score_label.text(++p2Score);
                    if(p2Score >= GAME_WIN){
                        gameStart();
                        extraMsg.text('P2 Wins!');
                    }
                } else if(collision(ball, right_bor)){
                    // back to start, made a score
                    dir_x = -1,
                    dir_y = -1;
                    ball.css({ left: '50%', top: '50%' });
                    p1Score_label.text(++p1Score);
                    if(p1Score >= GAME_WIN){
                        gameStart();
                        extraMsg.text('P1 Wins!');
                    }
                }else if(collide = (collision(ball, blue, true) || collision(ball, red, true)).radian ){
                    // reset position before giving new direction
                    ball.css({ left: left, top: top });

                    var cos = Math.cos(collide),
                        sin = Math.sin(collide);
                    dir_y = collide >= (Math.PI / 2) ? Math.abs(cos) : Math.abs(cos) * -1 ;
                    dir_x = dir_x < 0 ? Math.abs(sin) : Math.abs(sin) * -1 ;
                }

            }

            endTime = (new Date()) - start;

            // sumTime += endTime;
            // countLoop++;
            // console.log(sumTime, countLoop, sumTime / countLoop);

            var nextLoop = GAME_SPEED - endTime;
            if(nextLoop < 0){
                nextLoop = 0;
            }
            setTimeout(gameLoop, nextLoop);
        },
        close = function(){
            playGame = false;
        },
        start = function(){
            $('body').prepend(body);
            gameStart();
            exit.click(close);
            setTimeout(gameLoop, GAME_SPEED);
        };

    $(document).keydown(function(e){
        if(keyMap.keys.indexOf(e.which) != -1){
            keyMap[e.which] = true;
        }
        if(e.which === SPAC){
            paused = !paused;
            paused ? pausedMsg.show() : pausedMsg.hide();
            startMsg.hide();
            extraMsg.text('');
        }
        if(e.which === ESC){
            close();
        }
    });

    $(document).keyup(function(e){
        if(keyMap.keys.indexOf(e.which) != -1){
            keyMap[e.which] = false;
        }
    });

    return { start: start, close: close };
})();