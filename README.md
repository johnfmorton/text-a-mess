# Text-a-Mess

Read the blog post about this app on [SuperGeekery](https://supergeekery.com/blog/text-a-mess). Most of the content below is from that blog post.

## Description

[Text-a-Mess](https://text-a-mess.supergeekery.com/) is a basic web app that does one thing: It messes up the text you enter by adding [diacritical marks](https://en.wikipedia.org/wiki/Diacritic) throughout to obscure it while keeping it somewhat readable visually.

It does not encrypt the text in any way.

A simple text search will still

## Why did I do this?

I got the idea for this little app a few days ago while going through my Bluesky feed. I saw someone using diacritical marks in their status update in a funny way, and I thought it would be fun to have an app that lets you mess up your text as much or as little as you wanted.

Then, on March 23, 2025, it had a free Sunday, so I built it as fast as possible using some techniques I wanted to test.

[Text-a-Mess](https://text-a-mess.supergeekery.com/) is the result of that day's work.

## What did I learn?

This project was a little test I gave myself.

After focusing on Vue JS for most of my client work, I've recently been exploring React again out of curiosity. I understand the basics of React, but I haven't built a client app with it in several years. I'm _not_ an expert in React, but I'm not coming to it with zero knowledge.

I've also been experimenting with the concept of "Vibe coding" with AI tools. I used ChatGPT with its o3-mini-high model while building this app.

I wanted to see how much I could build with React and ChatGPT in a single day. I'm happy with the result. If I had more time, I could have done more, but I'm satisfied with what I did.

## Vibe coding impressions

The "vibe coding" idea interests me, but the AI tools we have now are not perfect. However, I came away from this app-building exercise thinking that I understood how the app works because I had foundational knowledge and knew how to ask the AI tool for specific requests.

The AI often made mistakes and introduced bugs in my code. To fix those errors, I had to understand why the bugs were happening so that I could describe to the AI how I wanted to fix them. Sometimes, I just gave up and fixed the bug myself.

Obviously, AI will continue to improve, but to execute a project and maintain the vision of what you want to achieve, you need to understand the code you're writing. I think AI tools can help you get there faster, but they're not a replacement for understanding the code you're writing.

## What's next?

I might update this app over time, but as it stands now, it does basically what I wanted. The Monday morning after I published it, I did see a visual bug in Safari where the output text diacritical marks were not updating when they were outside the line of text's X height. I fixed that bug in version 1.0.1. That fix still happened within the 24-hour window I gave myself to build this app, so I'll count that as being within the timeframe of the original build.

## How can you help?

If you have any ideas for improving this app, feel free to open an issue or a pull request. I'm always happy to get feedback and help.

Cheers,

John
