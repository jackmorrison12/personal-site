---
type: article
baseurl: "/articles/"
title: Adding GitHub Project Pages as Subdomains of my Site
slug: github-project-subdomains
date: 2020-06-23T22:26:37.457Z
hidden: false
hero: /img/github-project-subdomains.png
description: A guide on how I hosted old versions of my site under subdomains of jackmorrison.xyz
topics:
  - Netlify DNS
  - Gatsby
  - GitHub Pages
  - Subdomain
---

Over the years, I've created many different versions of this website, using varying technologies. When uploading this version, I thought it would be a shame for the rest of them to go to waste, and so I decided I wanted to host them as subdomains of my current site.

I assumed this would be a simple task, however I actually spent quite a while trying to find to get it to work, and so I wanted to write a short article to help anyone else who was wondering how to host a GitHub Project Page as a subdomain of another site.

The first thing I had to do was to update the DNS records on Netlify DNS, which is how I host my site. It's actually pretty simple - all I had to do was add a new CNAME record with the appropriate subdomain, and then set the value to my main GitHub pages URL (which is just `{username}.github.io`). I made one CNAME record for each project page I wanted to host, but they all pointed to the same URL.

![The Netlify DNS Record](/img/github-project-subdomains-1.jpg "The Netlify DNS Record")

This meant the Netlify side of stuff was done. Easy!

The second thing to do is head on over to GitHub, and set the custom domain of each project you want to host. All this involves is... typing in a URL. This then sets the CNAME file in the repo to the new URL.

![Custom Domain on GitHub Project Page](/img/github-project-subdomains-2.jpg "Custom Domain on GitHub Project Page")

And that's it! It may take while for DNS servers to update and caches to clear, but eventually all your sites are hosted properly!

You can find my personal examples at the subdomains

- [v0.jackmorrison.xyz](https://v0.jackmorrison.xyz)
- [v1.jackmorrison.xyz](https://v1.jackmorrison.xyz)
- [v2.jackmorrison.xyz](https://v2.jackmorrison.xyz)
- [v3.jackmorrison.xyz](https://v3.jackmorrison.xyz)

and more detail on these previous site iterations on my [archive page](https://jackmorrison.xyz/archive).
