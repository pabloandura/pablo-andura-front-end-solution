# Introduction to my take on the challenge!

by Pablo Andura


## Short summary

I noticed each folder had `html` files with the acceptance criteria. So I hacked them a little bit to provide the most simple and familiar reviewing experience.
For the svelte section I have the `svelte-solution` folder which is a sibling of this documentation, you can look at the README.md file in there for more information.


## Workflow

### First steps

Initially I worked on all four HTML + CSS + JS challenges. 

I pondered along the way how to include these inside of an SPA with Svelte. They really are a Set, they could all be in one page!

We will worry about that after completing our, previously mentioned, first part of the challenge.

### Challenge 1 - Navigation Hover

For this challenged I was tempted to put underlines and fancy fade in/out animations but then I noticed that our reference Image showed a detail. 

Navigation Items that were not selected did not display much transition at all, it seemed static/unchanged upon its `hover state`.

Therefore I took that seriously and I attempted to recreate the same but with interactivity!

I took a quick second swing at it after the first commit to consider accessibility and responsiveness. 

Made sure that it would not disrupt the sample image idea by disabling keyboard UI changes until a key was touched. ARIA users can still get fully accessible interactions with their screen readers.

### Challenge 2 - Gradient background logo

Here my solution is much simpler. The requirements read as a basic html + css solution. So I did not include any javascript external file.

```md
Recreate this gradient background with a centered logo
```

I made sure to consider accessibility and responsiveness so I gave aria tags, mobile-first and prefers-reduced-motion settings awareness.