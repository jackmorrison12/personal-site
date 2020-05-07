---
title: Correct-a-Spine
slug: /projects/correct-a-spine
type: Hackathon
homepage: false
description: A device to prevent back pain
tech:
  - C
  - Swift
  - Arduino
startdate: 2019-03-01T23:53:31.982Z
enddate: 2019-03-01T23:53:32.011Z
sources:
  - name: Devpost
    url: https://devpost.com/software/correct-a-spine
    icon: devpost
  - name: GitHub
    url: https://github.com/ricardomokhtari/HealthHack2019
    icon: fab fa-github
---
Correct-a-Spine was a hackathon entry for Imperial College Health Hack 19.

Problems with posture arise because of upper and lower back problems, but the current technologies only focus on monitoring one of these. This means that patients with chronic back pain are not getting the information they need to improve their posture and reduce their pain. Therefore, we decided to use an accelerometer and flex sensor to measure both upper and lower back position, in order to prevent both kinds of back pain with a single device.

This resulted in Correct-a-Spine, an iOS app which can monitor and help you correct your posture to reduce back pain.

The app worked by connecting to an Arduino, which sent data via Bluetooth to the iOS device. Using this data, we could advise the user on how they should change their posture in order to reduce the risk of back pain.

Since this was only a Hackathon project, we only created a rough v1, as you can see in the images, however if continued, Correct-a-Spine would incorporate machine learning in order to learn about its user and give them the best possible advice. We'd achieve this by working alongside medical professionals.

![Correct-a-Spine Accelerometer](/img/cas-1.jpg "Correct-a-Spine Accelerometer")<p class="caption">The accelerometer attached to the patient</p>

![Correct-a-Spine Flex Sensor](/img/cas-2.jpg "Correct-a-Spine Flex Sensor")<p class="caption">The flex sensor attached to the patient</p>