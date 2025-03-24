# Text-a-Mess

It's a web app and also a test.

## Description

Text-a-Mess is a simple web app that does one thing. It messes up the text you input by adding diacritical marks throughout the text. It will visually obscure the text while keeping the text somewhat readable.

It does not encrypt the text in any way.

A simple text search will still find the original text. However, it will severely mess up any text-to-speech software because it will use diacritical marks to alter text pronunciations. Please use it with that in mind.

## Why did I do this?

The idea for this little app occurred to me a few days ago when I was going through my feed on Bluesky. I saw someone using diacritical marks in their text in a funny way, and I thought it would be fun to have an app that lets you mess up your own text.

Then, it had a free Sunday on March 23, 2025, so I decided to build it as fast as I could using some techniques I wanted to test.

What you see here is the result of that day's work.

## What did I learn?

This project was a little test I gave myself.

I've recently been digging back into React out of curiosity after focusing on Vue JS for most of my client work. I think I've got a handle on the basics of React, but I haven't built a client app with it in several years. I'm not coming to React with zero knowledge, but I'm not an expert either.

I've also been playing around with the concept of "Vibe coding" with AI tools. ChatGPT helped me significantly with this app's build.

I wanted to see what I could build in a day with React and ChatGPT and how much I could get done in a day. I'm happy with the result. I could have done more if I had more time, but I'm happy with what I did.

## Vibe coding impressions

The "vibe coding" idea interests me, but it's not without it's faults. I come away from this app-building excersize understanding how the app works, because I asked really specific requests of the AI tool.

The AI often got things wrong and introduced bugs into my code. To fix those bugs, I to understand the basic nature of why the bugs were happening in order to get the AI to fix them. Sometimes I just gave up and fixed the bug myself.

Obviously, AI will continue to improve, but to execute a project and maintain the vision of what you want to achieve, you need to understand the code you're writing. I think AI tools can help you get there faster, but they're not a replacement for understanding the code you're writing.

## What's next?

I might update this app over time, but as it stands now, it does basically what I wanted. The Monday morning after I published it, I did see a visual bug in Safari where the output text diacritical marks were not updating when they were outside the line of text's X height. I fixed that bug in version 1.0.1. That fix still happened within the 24-hour window I gave myself to build this app, so I'll count that as within the timeframe of the original build.

How can you help?

If you have any ideas for improving this app, feel free to open an issue or a pull request. I'm always happy to get feedback and help.

Cheers,

John
