# Contributing to FigForm

Hey there! 👋 \
Thanks for considering contributing to FigForm. Whether you've found a pesky bug or have a brilliant idea for a new
feature, we'd love to hear from you and work together to make this package even better.

## Getting Started

First things first - let's get you set up! The setup process is pretty straightforward. Just grab all the dependencies
and you will be ready to rock:

```sh
npm install
```

That's it! Once that finishes, you're all set. TypeScript will be happy, the dependencies will be linked up properly,
and you can start tinkering with the code.

## Building Things

Since we are using TypeScript, you'll need to compile everything to JavaScript before you can actually use it. We've
got a few build commands ready for you:

- `npm run build:dry` - Perfect for a quick build to check if everything compiles
- `npm run build` - The full production build that creates everything you need

When you run the production build, you'll find all the compiled goodies in the `dist/` folder. Fair warning though - we
don't make any promises about file names staying consistent between versions, so always double-check what gets
generated if you're upgrading!

## Testing Your Changes Locally

Want to see how your changes work in a real project? We've got you covered:

- Use `npm link` to create a symlink between your local FigForm and your test project

This way you can immediately see your changes in action without having to publish anything.

## Writing Tests

Here's the deal: if you're fixing something non-trivial or adding a cool new feature, we really need you to include
tests. We know, we know - nobody loves writing tests, but they're what keep this project stable and give us confidence
that changes won't break everything.

You'll find all the existing tests in the `tests` folder at the project root. Feel free to follow the patterns you see
there!

## Running the Test Suite

Want to make sure you didn't break anything? Easy:

```sh
npm run test
```

Run this from the project root and it'll tell you exactly what's working and what needs some love.

## Keeping Things Clean

We are neat freaks when it comes to code style. Before you submit anything, make sure to run:

```sh
npm run lint
```

This will catch any style issues and keep the codebase looking consistent. Your future self (and ours!) will thank you.

## For Contributors Outside the Team

We absolutely love getting contributions from the community! If you want to contribute something, just open a PR
against the `main` branch and we'll take a look as soon as we can.

A few friendly reminders:

- Follow good commit practices (clear, descriptive messages are your friend)
- Include tests for any substantial changes - seriously, we can't stress this enough!
- Don't be afraid to ask questions if you're unsure about anything

Looking forward to seeing what awesome things you come up with!
