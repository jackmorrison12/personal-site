// This file is based on the tutorial https://swas.io/blog/social-share-button-for-gatsby-blog-pages/

import React from "react"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  RedditShareButton,
  EmailShareButton,
  FacebookShareCount,
  RedditShareCount,
} from "react-share"

const ShareSheet = ({ socialConfig, tags }) => (
  <div className="post-social">
    <FacebookShareButton
      url={socialConfig.config.url}
      quote={socialConfig.config.title + " by Jack Morrison"}
      className="button rounded border-thin-solid pad-3-lr pad-1-tb facebook"
      resetButtonStyle={false}
    >
      <span className="icon pad-2-r">
        <FontAwesomeIcon icon={["fab", "facebook-f"]} />
      </span>
      <span className="bold">Facebook</span>
      <FacebookShareCount url={socialConfig.config.url}>
        {shareCount => <span className="pad-2-l">{shareCount}</span>}
      </FacebookShareCount>
    </FacebookShareButton>
    <TwitterShareButton
      url={socialConfig.config.url}
      className="button rounded border-thin-solid pad-3-lr pad-1-tb twitter"
      title={socialConfig.config.title + " by Jack Morrison"}
      via={socialConfig.author.split("@").join("")}
      hashtags={tags}
      resetButtonStyle={false}
    >
      <span className="icon pad-2-r">
        <FontAwesomeIcon icon={["fab", "twitter"]} />
      </span>
      <span className="bold">Twitter</span>
    </TwitterShareButton>
    <LinkedinShareButton
      url={socialConfig.config.url}
      className="button rounded border-thin-solid pad-3-lr pad-1-tb linkedin"
      title={socialConfig.config.title}
      resetButtonStyle={false}
    >
      <span className="icon pad-2-r">
        <FontAwesomeIcon icon={["fab", "linkedin-in"]} />
      </span>
      <span className="bold">LinkedIn</span>
    </LinkedinShareButton>
    <RedditShareButton
      url={socialConfig.config.url}
      className="button rounded border-thin-solid pad-3-lr pad-1-tb reddit"
      title={socialConfig.config.title + " by Jack Morrison"}
      resetButtonStyle={false}
    >
      <span className="icon pad-2-r">
        <FontAwesomeIcon icon={["fab", "reddit-alien"]} />
      </span>
      <span className="bold">Reddit</span>
      <RedditShareCount url={socialConfig.config.url}>
        {shareCount => <span className="pad-2-l">{shareCount}</span>}
      </RedditShareCount>
    </RedditShareButton>
    <WhatsappShareButton
      url={socialConfig.config.url}
      className="button rounded border-thin-solid pad-3-lr pad-1-tb whatsapp"
      title={socialConfig.config.title}
      resetButtonStyle={false}
    >
      <span className="icon pad-2-r">
        <FontAwesomeIcon icon={["fab", "whatsapp"]} />
      </span>
      <span className="bold">WhatsApp</span>
    </WhatsappShareButton>
    <EmailShareButton
      url={socialConfig.config.url}
      className="button rounded border-thin-solid pad-3-lr pad-1-tb email"
      subject={socialConfig.config.title}
      resetButtonStyle={false}
      body={socialConfig.config.title + " by Jack Morrison \n\n"}
    >
      <span className="icon pad-2-r">
        <FontAwesomeIcon icon={["fab", "whatsapp"]} />
      </span>
      <span className="bold">Email</span>
    </EmailShareButton>
  </div>
)

ShareSheet.propTypes = {
  socialConfig: PropTypes.shape({
    author: PropTypes.string.isRequired,
    config: PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  }).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
}
ShareSheet.defaultProps = {
  tags: [],
}

export default ShareSheet
