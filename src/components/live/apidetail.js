import React, { useState } from "react"

import TimeAgo from "react-timeago"

import { SlideDown } from "react-slidedown"
import "react-slidedown/lib/slidedown.css"

export default props => {
  const itemsPerPage = 5

  const indexOfLastItem = props.currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = props.displayFragments.slice(
    indexOfFirstItem,
    indexOfLastItem
  )
  let handleClick = event => {
    props.setCurrentPage(Number(event.target.id))
  }

  const renderItems = currentItems[0]
    ? currentItems.map(item => (
        <div className="row pad-3-b">
          {/* //Change this to show time if more than 1 day ago */}
          {item.image ? (
            <>
              <div className="col-xs-2 col-sm-1 align-self-center">
                <img src={item.image} style={{ width: "100%" }} />
              </div>
              <div className=" col-xs-8 col-sm-9 align-self-center">
                {item.body}
              </div>{" "}
              <div className="col-xs-2 col-sm-2 align-self-center text-align-right is-red">
                {" "}
                <TimeAgo date={item.occur_date} />
              </div>
            </>
          ) : (
            <>
              <div className="col-xs-12 col-sm-10 align-self-center">
                {item.body}
              </div>
              <div className="col-xs-12 col-sm-2 align-self-center text-align-right is-red">
                {" "}
                <TimeAgo date={item.occur_date} />
              </div>
            </>
          )}
        </div>
      ))
    : ""

  // Logic for displaying page numbers
  const pageNumbers = []
  for (
    let i = 1;
    i <= Math.ceil(props.displayFragments.length / itemsPerPage);
    i++
  ) {
    pageNumbers.push(i)
  }

  const renderPageNumbers =
    pageNumbers.length > 1
      ? pageNumbers.map(number => {
          return (
            <h2
              className="link col-xs-1 is-medium-blue text-align-center margin-0-b"
              key={number}
              id={number}
              onClick={handleClick}
              onKeyDown={e => {
                if (e.keyCode == 13) {
                  handleClick(e)
                }
              }}
              role="button"
              tabindex="0"
            >
              {number}
            </h2>
          )
        })
      : ""

  return (
    <>
      <SlideDown closed={!props.displayDetail}>
        <div className="row pad-10-t pad-3-lr container">
          <div className="col-xs-12 col-md-12">
            <div
              role="button"
              tabIndex="0"
              onClick={e => props.setDisplayDetail(false)}
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  props.setDisplayDetail(false)
                }
              }}
              className="link is-medium-blue float-right"
            >
              Close
            </div>
          </div>
        </div>
        <div className="is-grey is-light-grey-bg pad-10-b pad-3-lr">
          <div className="row container ">
            <div className="col-xs-12 ">
              <h1>
                More detail here on {props.selectedAPI} on{" "}
                {new Date(
                  Date.now() - 13 * 86400000 + props.selectedDate * 86400000
                ).formatDDMMYYYY()}
              </h1>

              <div>
                {renderItems}
                <div className="row content-center">{renderPageNumbers}</div>
              </div>
            </div>
          </div>
        </div>
      </SlideDown>
    </>
  )
}
