---
type: blog
baseurl: "/blog/"
blogseries: automation
title: What were those lyrics?
slug: shazam-lyrics
date: 2020-10-21T20:30:00.000Z
hidden: false
description: "A shortcut which tells me the lyrics I just heard in a song"
tags:
  - iOS
  - Shortcuts
  - Shazam
  - Automation
  - Music
---

Another pet peeve of mine is when you're listening to a song, and you can't understand what they're saying. Sure, you can go look up the lyrics, but that takes time, and you have to scroll through and try to figure out which part of the song it was.

I wanted a way to just click a button and see what they're saying... and it was Shazam to the rescue!

Here's what the widget setup looks like in the Shortcuts app:

![Shazam Automation Widget in Shortcuts App](/img/shazam-lyrics-1.png "Shazam Automation Widget in Shortcuts App")

The first thing to do is identify the song using the 'Shazam it' action.

This also captures the lyrics which were heard, and can them return them! I wanted to show these in a notification, and so I added the 'Show Notification' action.

I set it to show the 'Shazam Media', and the scrolled down to 'Lyric Snippet Synced', and show that in the notification.

I also set the 'Title' and 'Attachment' to 'Shazam Media' in the dropdown, so it shows the name of the song, as well as the album artwork, which is pretty handy! ( I also turned off 'Play Sound' as not to interrupt the music!)

![Homescreen Widgets](/img/shazam-lyrics-2.png "Homescreen Widgets")

Now you'll never have to wonder what someone's saying in a song again!

If you're running an iOS device, you can [download the shortcut here](https://www.icloud.com/shortcuts/2063808fe5b445b5add539cd460efabb)! (Note: You need to 'Allow Untrusted Shortcuts' in settings to download it, or just recreate it yourself!)
