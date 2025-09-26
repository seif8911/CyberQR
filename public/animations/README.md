# Streak Pet Animation

This directory contains the animation files for the Streak Pet component.

## Current Setup

The Streak Pet now uses the `@lottiefiles/dotlottie-react` component to display animations.

## Replacing with Your Animation

To use your custom dotLottie animation:

1. Download your animation from [LottieFiles](https://app.lottiefiles.com/animation/a3e08a1a-69e3-4c24-b4ad-470d5d5f2a59)
2. Save it as `streakpet.lottie` in this directory
3. Update the `src` prop in `src/components/PetCompanion.tsx` to point to `/animations/streakpet.lottie`

## File Formats Supported

- `.lottie` files (dotLottie format - recommended)
- `.json` files (Lottie JSON format)

## Current Placeholder

The current `streakpet.json` is a simple placeholder animation with a rotating purple circle. Replace it with your actual animation file.
