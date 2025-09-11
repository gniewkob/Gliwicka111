# Hero Image Centering Fix

## Problem
The hero section on the home page used the image `hala1.webp` which was not fully covering its placeholder and could appear off‑center on various screen sizes.

## Changes
- Updated the image container to enforce full width with a square aspect ratio and hidden overflow.
- Switched the Next.js `<Image>` configuration to use `fill` with `object-cover` and `object-center` classes.
- Introduced responsive `sizes` attributes and testing IDs for reliable unit and E2E checks.

## Impact
The hero image now scales responsively across mobile, tablet and desktop breakpoints, always covering the placeholder without revealing the background.
