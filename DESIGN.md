# Desktop instrument

## Intent

A browser dashboard built as a physical desk instrument: one silver chassis, one smoked display, one bank of tactile keys, and weather and calendar controls printed into the panel. The design uses the user's K.O. II reference as direction, with TE·OS as its own page identity.

## Surfaces and type

- Neutral silver casing with fine grain, visible fasteners, a perforated speaker area, and a continuous rim.
- Graphite keys with a raised edge, downward press motion, white favicon inserts, and small status lights.
- Smoked display with pale seven-segment clock digits. The segment artwork is drawn locally as SVG, so it does not depend on another font or network request.
- One orange accent for active controls. The dark panel uses the same component arrangement.
- Bundled IBM Plex Sans and IBM Plex Mono for labels; Space Grotesk for numeric data; Noto Sans SC for Chinese.

## Controls

- Site keys retain normal links, website icons, keyboard launch shortcuts, and the existing synchronized editor.
- The six vertical weather faders display relative temperatures. Selecting a fader or moving the horizontal hour selector changes the forecast on the main display. These controls select forecast data; they never change the forecast itself.
- The white knob switches temperature units. The orange knob opens city lookup.
- The dot-matrix calendar preserves the corrected adjacent-month dates and midnight updates, and also supports keyboard arrows and Home.
- Desktop uses three control sections. Medium screens put the calendar below the other sections. Small screens stack the sections without clipping the clock or introducing horizontal scrolling.

## Verification

The browser checks cover the original shortcut synchronization, request races, calendar edge cases and keyboard behavior, plus the segment clock, search routing, forecast selection, units, city lookup, theme persistence, and layouts at 1920, 1440, 1024, 390, and 320 pixels. Controlled forecast responses make the interaction checks repeatable; the favicon check uses the live service. The tests use the extension's content security policy in an isolated Chrome profile.
