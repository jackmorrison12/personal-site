---
type: article
baseurl: /articles/
title: Should we be deploying code every day?
slug: daily-deployment
date: 2021-02-24T21:10:34.448Z
hidden: false
hero: /img/daily-deployment.png
logo: /img/daily-deployment-logo.png
description: Written with Joe Rackham and Julie Emile
tags:
  - Continuous Delivery
  - UI
  - Web Dev
---

Many big names in tech are evangelists for frequent deployment. At one point Amazon claimed to deploy every 11.6 seconds and the likes of Google and Facebook aren't far behind \cite{amazon-daily}. However, many companies also choose to release updates to their software far less frequently. Are these teams lagging behind, or do they have a good reason for slower iteration?

Developers can feel hesitant to release updates with design changes, but with some good reason; research shows developers are wrong about user preferences about 90\% of the time \cite{ms-data-driven}. Any substantial changes to the UI of Instagram or Facebook prompts social-media outrage and guides to reversing changes \cite{insta-ui} \cite{old-facebook}. This could be solved by in-house user testing, but users are often equally unreliable at knowing what they want \cite{myth}. A better solution is A/B testing, which allow developers to monitor the real user experience and directly compare metrics against the existing choices. Skyscanner has built this type of experimentation into their culture, they use a custom tool, Dr. Jekyll, to simplify the process and empower developers without a statistics background to get quantitative feedback on their design decision \cite{skyscanner}.

Regardless of the quality, the way changes are delivered can also provoke reaction. Web services have the luxury of being able to deploy a new version invisibly, but native apps involve the user in the process. A recent Call of Duty update angered players by stopping them from playing until a 30GB update was installed \cite{cod-patch}. The update was so large because Activation was following a release road-map designed to keep players engaged (and spending) over a longer period of time \cite{cod-roadmap}. Tesla approaches this differently; instead of having a strict seasonal release schedule, they rely on small frequent updates. Once a commit has been through an automated testing pipeline, manual acceptance testing is done on the roads a few times a day, and then an update is deployed automatically over the air. These user updates are non-blocking and user-scheduled, to be minimally disruptive \cite{vost2016}. However, implementing this kind of release schedule did impose some obstacles. In 2013, Tesla had to roll back their recently released “smart air suspension” feature, as it was linked to the explosion of three cars \cite{blank2017}. Automating an extensive testing pipeline is only as good as the quality of the tests it runs. Fortunately, Tesla can roll-back changes as efficiently as they release them, which in 2013 prevented insufficient testing from causing further incidents.

In more established industries, regulation tries to prevent these kinds of accidents. The banking sector is a prime example; developers have to deal with data-residency laws and ensure the safety of their users' finances. Whilst important, these regulations have led to an over-reliance on safe legacy infrastructure. Many dependencies are embedded in financial systems; this makes it harder for software engineers to automate end-to-end testing and limits the rate of deployment. To address this bottleneck, multiple banks including Lloyds \cite{lloyds-vault} have migrated some of their legacy services to a banking infrastructure by Thought Machine \cite{vault}. Vault is a cloud-native core banking platform built on a micro-service architecture, which supports build, testing and deployment automation. Whilst these solutions can't completely remove the burden of regulation, they can still accelerate the rate of deployment in banking.

Deploying infrequently can be caused by marketing strategies, legacy systems or fear of user reaction, but it is rarely motivated by improving the product. However, making small changes doesn't excuse carelessness; a fast rate of iteration needs to be supported by a solid testing pipeline and the facility to roll back changes. Avoiding Activation's large updates doesn't excuse Tesla blowing up cars; avoiding the UI outrage faced by Facebook doesn't mean you couldn't benefit from doing A/B testing like Skyscanner.

This article was co-authored by [Joe Rackham](https://joealexanderrackham.co.uk/) and [Julie Emile](https://www.linkedin.com/in/julie-emile-213685167/).

<bibliography>
@misc{cod-patch,
   title   = "Gamers are fed up after another massive Call of Duty: Warzone patch dropped",
   url="https://ftw.usatoday.com/2020/05/call-of-duty-warzone-patch-size-reaction",
   note    = "[Accessed 24th January 2021]"
}
@misc{insta-ui,
title = "Instagram launches risky redesign – and users aren't happy",
url="https://www.creativebloq.com/news/instagram-redesign-unhappy",
note = "[Accessed 24th January 2021]"
}
@misc{old-facebook,
title = "How to get old Facebook back and switch to the ‘classic’ look",
url="https://metro.co.uk/2020/07/01/how-get-old-facebook-back-switch-classic-look-12928598/",
note = "[Accessed 24th January 2021]"
}
@misc{dentist,
title = "Deploying your software shouldn’t feel like visiting the dentist",
url="https://www.red-gate.com/blog/software-development/software-deployment",
note = "[Accessed 24th January 2021]"
}
@inproceedings{ms-data-driven,
author = {Fabijan, Aleksander and Dmitriev, Pavel and Olsson, Helena Holmstr\"{o}m and Bosch, Jan},
title = {The Evolution of Continuous Experimentation in Software Product Development: From Data to a Data-Driven Organization at Scale},
year = {2017},
isbn = {9781538638682},
publisher = {IEEE Press},
url = {https://doi.org/10.1109/ICSE.2017.76},
doi = {10.1109/ICSE.2017.76},
booktitle = {Proceedings of the 39th International Conference on Software Engineering},
pages = {770–780},
numpages = {11},
location = {Buenos Aires, Argentina},
series = {ICSE '17}
}
@misc{skyscanner,
title = "Fostering a Culture of Experimentation at Skyscanner",
url = "https://medium.com/@SkyscannerEng/fostering-a-culture-of-experimentation-at-skyscanner-81b7a0096e20",
note = "[Accessed 24th January 2021]"
}
@misc{lloyds-vault,
title = "Thought Machine nabs $83M for a cloud-based platform that powers banking services",
url = "https://techcrunch.com/2020/03/01/thought-machine-nabs-83m-for-a-cloud-based-platform-that-powers-banking-services/",
note = "[Accessed 24th January 2021]"
}
@misc{vault,
title = "Why microservices are the future of banking",
url = "https://thoughtmachine.net/blog/why-microservices-are-the-future-of-banking",
note = "[Accessed 24th January 2021]"
}
@misc{amazon-daily,
title = "Velocity 2011: Jon Jenkins - Velocity Culture",
url = "https://www.youtube.com/watch?v=dxk8b9rSKOo",
note = "[Accessed 25th January 2021]"
}
@misc{blank2017,
title={Steve Blank When Product Features Disappear – Amazon, Apple and Tesla and the Troubled Future for 21st Century Consumers}, 
url={https://tinyurl.com/sei-disappearing-features},
author={Blank, Steve},
year={2017},
month={Apr},
note = "[Accessed 22nd January 2021]"}
@misc{vost2016,
title={Towards Continuous Integration and Continuous Delivery in the Automotive Industry},
author={Sebastian Vöst and Stefan Wagner},
year={2016},
url="https://arxiv.org/pdf/1612.04139.pdf",
note="[Accessed 22nd January 2021]"
}
@misc{myth,
title = "Myth #21: People can tell you what they want",
url = "https://uxmyths.com/post/746610684/myth-21-people-can-tell-you-what-they-want",
note = "[Accessed 25th January 2021]"
}
@misc{cod-roadmap,
title = "Call of Duty: Black Ops: Cold War: Season-1",
url ="https://www.callofduty.com/uk/en/blackopscoldwar/season-1",
note = "[Accessed 25th January 2021]"
}
</bibliography>
