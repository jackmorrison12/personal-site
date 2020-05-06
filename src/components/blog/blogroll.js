import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql, StaticQuery } from 'gatsby'

class BlogRoll extends React.Component {
  render() {
    const { data } = this.props;
    const { edges: posts } = data.allMarkdownRemark;

    return (
        
        <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
        <div className="row container ">
          <div className="col-xs-12 ">
            <h1 className="is-hero-menu margin-0-t">Lets have a kiki</h1>
            <div className="line margin-3-t margin-10-b" />
          </div>
          <div className="col-xs-12 col-md-12">
        {posts &&
          posts.map(({ node: post }) => (
            <Link to={"/" + post.frontmatter.slug} className="link" id="path">
            <div className="grow row margin-5-b">
              <div className="col-xs-12 margin-5-t">
                <h1 className="margin-0 is-red">{post.frontmatter.title}</h1>
                <p className="margin-0 margin-2-b is-black">
                  {post.frontmatter.date}
                </p>
                <div className="line-sm is-black margin-3-b" />
                <p className="margin-0 is-black">{post.excerpt}</p>
              </div>
            </div>
          </Link>
          ))}
      </div>
      </div>
      </div>
    )
  }
}

BlogRoll.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
};

export default () => (
  <StaticQuery
    query={graphql`
      query BlogRollQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: {fileAbsolutePath: {regex: "/blog/"  }}
        ) {
          edges {
            node {
              excerpt(pruneLength: 300)
              id
              frontmatter {
                slug
                title
                date(formatString: "MMMM DD, YYYY")
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <BlogRoll data={data} count={count} />}
  />
)