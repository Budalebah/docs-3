import Layout from '@theme/Layout';
import React, { useState } from "react";
import CodeMirror from '@uiw/react-codemirror';
import { keymap } from "@codemirror/view"
import { cpp } from '@codemirror/lang-cpp';
import { dracula } from '@uiw/codemirror-theme-dracula';

export default function Hello() {
  const [value, setValue] = React.useState(`//riv-jit-c (DO NOT REMOVE THIS LINE)
#include <riv.h>

void main() { // entry point
  int x = 128, y = 128; // red dot position
  do { // main loop
    // handle inputs
    if (riv->keys[RIV_GAMEPAD_UP].down) y--;
    if (riv->keys[RIV_GAMEPAD_DOWN].down) y++;
    if (riv->keys[RIV_GAMEPAD_LEFT].down) x--;
    if (riv->keys[RIV_GAMEPAD_RIGHT].down) x++;
    // draw screen
    riv_clear(RIV_COLOR_BLACK); // clear screen
    riv_draw_text("move red dot below the blue line", RIV_SPRITESHEET_FONT_5X7,
                  RIV_CENTER, 128, 96, 1, RIV_COLOR_WHITE); // draw text
    riv_draw_rect_fill(0, 200, 256, 4, RIV_COLOR_BLUE); // draw blue line
    riv_draw_circle_fill(x, y, 8, RIV_COLOR_RED); // draw red dot
    if (y >= 202) { // check if red dot crossed blue line
      riv_draw_text("YOU WON!", RIV_SPRITESHEET_FONT_5X7,
                    RIV_CENTER, 128, 128, 4, RIV_COLOR_GOLD); // draw end screen
      riv->quit = true; // end game
    }
  } while(riv_present()); // refresh screen and wait next frame
}
`);
  const onChange = React.useCallback((val, viewUpdate) => {
    setValue(val);
  }, []);

  return (
    <Layout title="Playground" description="Code cartridges directly in the browser">
        <main>
            <div className="container margin-vert--sm">
              <div className="row row--no-gutters">
                <div className="col col--6">
                  <div align="center">
                    <iframe id="rivemu" src="https://emulator.rives.io/#simple=true&editor=true" allowFullScreen className="rivemu-frame" />
                  </div>
                </div>
                <div className="col col--6">
                  <CodeMirror
                      id="rivemu-unfocus"
                      value={value}
                      height="548px"
                      theme={dracula}
                      onChange={onChange}
                      onCreateEditor={() => {
                        let rivemuFrame = document.getElementById('rivemu');
                        rivemuFrame.addEventListener("load", function() {
                          rivemuFrame.contentWindow.postMessage({code:value}, "*");
                        });
                      }}
                      extensions={[
                          cpp({}),
                          keymap.of([
                            {
                              key: 'Shift-Enter',
                              run: () => {
                                document.getElementById("rivemu").contentWindow.postMessage({code:value, start:true}, "*");
                                return true;
                              },
                            },
                            {
                              key: 'Ctrl-Shift-Enter',
                              run: () => {
                                document.getElementById("rivemu").contentWindow.postMessage({code:value, start:true}, "*");
                                document.getElementById("rivemu").contentWindow.focus();
                                return true;
                              },
                            },
                          ]),
                      ]}
                  />
                  <small>
                    <div><strong>SHIFT + Enter</strong>: Run.</div>
                    <div><strong>CTRL + SHIFT + Enter</strong>: Run and focus canvas.</div>
                    <div><strong>CTRL + SHIFT + I</strong>: Open console output to see syntax errors.</div>
                    <div>If the screen is stuck while loading, means the cartridge has syntax errors or crashed.</div>
                  </small>
                </div>
              </div>
            </div>
        </main>
    </Layout>
  );
}