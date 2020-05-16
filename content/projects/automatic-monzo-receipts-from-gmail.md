---
title: Automatic Monzo Receipts from Gmail
slug: /projects/monzo-receipts
type: Hackathon
homepage: false
cv: false
hidden: true
description: Integrating Gmail receipts into the Monzo app
tech:
  - Python
  - Flask
  - SQLite
startdate: 2019-01-01T00:46:00.000Z
enddate: 2019-01-01T00:46:00.000Z
sources:
  - name: GitHub
    url: https://github.com/et-tamen-compilat/monzo-receipts
    icon: fab fa-github
  - name: Devpost
    url: https://devpost.com/software/monzo-receipts
    icon: devpost
---
This app was created as part of Cambridge Hack 4D.

It displays recent transactions to the user, and if the user clicks the "Add Receipt" button, then it will use the Gmail API to scan their emails, find the correct one, and gather the receipt data, adding this to the Monzo application.

It is also possible to have pictures of receipts if they are physical and not in the emails, and then the same algorithm is run on the text data gathered from the receipt using Microsoft Azure OCR to get the equivalent information and add it to the transaction in the Monzo app.

![Monzo Receipts Example](/img/monzo-receipts.png "Monzo Receipts Example")<p class="caption">A demo receipt in the Monzo app</p>

