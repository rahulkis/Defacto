import React from "react";

import { GetData } from "../../stores/requests";

import { PRICING_URLS } from "../../util/constants";

import Loader from "../../components/Common/Loader";

import "../../assets/custom/Pricing.css";

class Pricing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pricingList: [],
      isLoader: false,
      faqList: [],
    };
  }
  componentWillMount() {
    this.setState({ isLoader: true });
    this.getPricingList();
    this.getFAQList();
  }
  getPricingList() {
    try {
      GetData(PRICING_URLS.GET_PRICING_LIST + 1).then((result) => {
        if (result != null) {
          this.setState({ isLoader: false });
          let items = result.data.Items;
          if (items != null) {
            items = items.sort((a, b) =>
              a.Sorting > b.Sorting ? 1 : b.Sorting > a.Sorting ? -1 : 0
            );
          }
          this.setState({ pricingList: items });
        }
      });
    } catch (err) {
      alert("Something went wrong, please try again.");
      this.setState({ isLoader: false });
    }
  }
  getFAQList() {
    try {
      GetData(PRICING_URLS.GET_FAQ_LIST + 1).then((result) => {
        if (result != null) {
          this.setState({ isLoader: false });
          let items = result.data.Items;
          if (items != null) {
            items = items.sort((a, b) =>
              a.CreatedAt > b.CreatedAt ? 1 : b.CreatedAt > a.CreatedAt ? -1 : 0
            );
          }
          this.setState({ faqList: items });
        }
      });
    } catch (err) {
      alert("Something went wrong, please try again.");
      this.setState({ isLoader: false });
    }
  }
  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }
    return (
      <div className="content  pricing-top-margin">
        <div className="max-width mx-auto">
          <h1>Pricing</h1>
          <div className="pricing-module--mobile--3vEjU"> </div>
          <table className="pricing-module--table--2H1dQ">
            <thead>
              <tr>
                <td style={{ width: "30%" }} />
                <th>Essentials</th>
                <th>Pro</th>
                <th>Agency</th>
              </tr>
            </thead>
            <tbody>
              {this.state.pricingList.map((data, index) => (
                <>
                  {data.PricingName === "EmptyString"}

                  {data.PricingName === "PricingStaticText" && (
                    <tr className="pricing-module--prices--1k8PX">
                      <td>
                        <i>
                          You're looking at &nbsp;
                          <b className="pricing-module--interval--1zSTA">
                            Annual
                          </b>{" "}
                          Prices
                          <br />
                          <small>
                            <a
                              href="/#"
                              className="pricing-module--switch--1OiDc"
                            >
                              See Monthly Prices
                            </a>
                          </small>
                        </i>
                      </td>
                      <td>
                        <h3 className="margin0">${data.Essential}</h3>
                        <small>per month</small>
                      </td>
                      <td>
                        <h3 className="margin0">${data.Pro}</h3>
                        <small>per month</small>
                      </td>
                      <td>
                        <h3 className="margin0">${data.Agency}</h3>
                        <small>per month</small>
                      </td>
                    </tr>
                  )}

                  {data.PricingName !== "PricingStaticText" &&
                    data.PricingName !== "EmptyString" && (
                      <tr className="pricing-module--featureRow--P7_mU">
                        {data.IsBold && (
                          <td>
                            <b>{data.PricingName}</b>
                          </td>
                        )}
                        {!data.IsBold && (
                          <td>
                            {data.PricingName}
                            {data.LinkAvailable && (
                              <a href={data.LinkUrl}>
                                <small className="linkMargin">
                                  What's this?
                                </small>
                              </a>
                            )}
                          </td>
                        )}

                        {/* //-------------------------- Essential Section-----------------------  // */}

                        {data.IsAnchorTag && (
                          <td>
                            {" "}
                            <a
                              className="BtnV2 BtnV2--raised pricing-module--btn--30UHX"
                              href="/auth/register?plan=pro"
                              target="_self"
                            >
                              <span>Try Essential</span>
                            </a>
                          </td>
                        )}

                        {!data.IsAnchorTag && (
                          <td className="pricing-module--supportMaybe--SC-vb">
                            {data.Essential === "Yes" && (
                              <svg
                                stroke="currentColor"
                                fill="currentColor"
                                stroke-width="0"
                                viewBox="0 0 24 24"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                              </svg>
                            )}
                            {data.Essential !== "Yes" &&
                              data.Essential !== '""' &&
                              data.Essential}
                          </td>
                        )}

                        {/* //-------------------------- Pro Section-----------------------  // */}
                        {data.Pro === "" && <td />}

                        {data.IsAnchorTag && (
                          <td>
                            {" "}
                            <a
                              className="BtnV2 BtnV2--raised pricing-module--btn--30UHX"
                              href="/auth/register?plan=pro"
                              target="_self"
                            >
                              <span>Try Pro</span>
                            </a>
                          </td>
                        )}
                        {data.Pro !== "" && !data.IsAnchorTag && (
                          <td className="pricing-module--supportMaybe--SC-vb">
                            {data.Pro === "Yes" && (
                              <svg
                                stroke="currentColor"
                                fill="currentColor"
                                stroke-width="0"
                                viewBox="0 0 24 24"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                              </svg>
                            )}
                            {data.Pro !== "Yes" &&
                              data.Pro !== '""' &&
                              data.Pro}
                          </td>
                        )}
                        {/* //-------------------------- Agency Section-----------------------  // */}
                        {data.Agency === "" && <td />}
                        {data.IsAnchorTag && (
                          <td>
                            {" "}
                            <a
                              className="BtnV2 BtnV2--raised pricing-module--btn--30UHX"
                              href="/auth/register?plan=pro"
                              target="_self"
                            >
                              <span>Try Agency</span>
                            </a>
                          </td>
                        )}

                        {data.Agency !== "" && !data.IsAnchorTag && (
                          <td className="pricing-module--supportMaybe--SC-vb">
                            {data.Agency === "Yes" && (
                              <svg
                                stroke="currentColor"
                                fill="currentColor"
                                stroke-width="0"
                                viewBox="0 0 24 24"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                              </svg>
                            )}
                            {data.Agency !== "Yes" &&
                              data.Agency !== '""' &&
                              data.Agency}
                          </td>
                        )}
                      </tr>
                    )}
                </>
              ))}
            </tbody>
          </table>

          <div id="FAQ">
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="pricing-module--faq--2WRF8">
            {this.state.faqList
              .sort((p) => p.CreatedAt)
              .map((data, index) => (
                <div className="FaqQuestion-module--wrapper--2ckNg FaqQuestion-module--wrapperExpanded--lSC1N div-faqQuestion">
                  <div className="FaqQuestion-module--question--1tC85">
                    {data.Question}
                  </div>
                  {
                    <div
                      className="FaqQuestion-module--answer--sFpM5"
                      dangerouslySetInnerHTML={{ __html: data.Answer }}
                    />
                  }
                </div>
              ))}
          </div>
          <p className="p-help-form">
            Need to know more? Search our{" "}
            <a href="https://help.defactoform.co">Help Center</a> to find what
            you’re after, or ask us at{" "}
            <a href="mailto:support@defactoform.co">support@defactoform.co</a>.
          </p>
        </div>
      </div>
    );
  }
}

export default Pricing;
