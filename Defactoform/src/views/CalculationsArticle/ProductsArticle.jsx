import React from "react";

class ProductsArticle extends React.Component {
  render() {
    return (
      <div>
        <h3>Variables </h3>
        <p>
          Product questions have some advanced answer piping features available
          that make it easier to work with quantities and SKUs. These extend the
          normal answer piping function and so you start by typing the usual
          answer piping code {"`{{ abcde }}`"}. You can then access the product
          quantities with the following code {"`{{ abcde.quantities.SKU }}`"}{" "}
          where `SKU` is the actual SKU of a product. You can also get an array
          containing all the selected product SKUs like this{" "}
          {`{{ abcde.selectedProducts }}`}.
        </p>
        <div style={{ position: "relative" }}>
          <a href="#pablo" className="a-copy">
            Copy
            <i className="fa fa-clone" />
          </a>
          <div
            className="FormTagInput Calculation__input"
            style={{ position: "relative" }}
          >
            <div className="DraftEditor-root">
              <div className="">
                <div
                  aria-describedby="placeholder-68ugd"
                  className="public-DraftEditor-content calculation-placeHolder"
                  contenteditable="false"
                  spellcheck="false"
                >
                  <div data-contents="true">
                    <div
                      className=""
                      data-block="true"
                      data-editor="68ugd"
                      data-offset-key="8dmub-0-0"
                    >
                      <div
                        data-offset-key="obe7-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span class="prism-token token string">
                          <span data-offset-key="obe7-0-0">
                            <span data-text="true">"You selected "</span>
                          </span>
                        </span>
                        <span data-offset-key="obe7-1-0">
                          <span data-text="true"> </span>
                        </span>
                        <span class="prism-token token operator">
                          <span data-offset-key="obe7-2-0">
                            <span data-text="true">||</span>
                          </span>
                        </span>
                        <span data-offset-key="obe7-3-0">
                          <span data-text="true"> </span>
                        </span>
                        <span class="FormTagInput__tagerror">
                          <span data-offset-key="obe7-4-0">
                            <span data-text="true">
                              {"{{ abcde.quantities.hatSKU }}"}
                            </span>
                          </span>
                        </span>
                        <span data-offset-key="obe7-5-0">
                          <span data-text="true"> </span>
                        </span>
                        <span class="prism-token token operator">
                          <span data-offset-key="obe7-6-0">
                            <span data-text="true">||</span>
                          </span>
                        </span>
                        <span data-offset-key="obe7-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span class="prism-token token string">
                          <span data-offset-key="obe7-8-0">
                            <span data-text="true">" hats"</span>
                          </span>
                        </span>
                        <span data-offset-key="obe7-9-0">
                          <span data-text="true"> </span>
                        </span>
                        <span class="prism-token token comment">
                          <span data-offset-key="obe7-10-0">
                            <span data-text="true">
                              "// shows the number of hats selected"
                            </span>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <a href="#pablo" className="a-copy">
            Copy
            <i className="fa fa-clone" />
          </a>
          <div
            className="FormTagInput Calculation__input"
            style={{ position: "relative" }}
          >
            <div class="DraftEditor-root">
              <div class="">
                <div
                  aria-describedby="placeholder-68ugd"
                  className="public-DraftEditor-content calculation-placeHolder"
                  contenteditable="false"
                  spellcheck="false"
                >
                  <div data-contents="true">
                    <div
                      class=""
                      data-block="true"
                      data-editor="3khqt"
                      data-offset-key="6takv-0-0"
                    >
                      <div
                        data-offset-key="6takv-0-0"
                        class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span class="FormTagInput__tagerror">
                          <span data-offset-key="6takv-0-0">
                            <span data-text="true">
                              {"{{ abcde.selectedProducts }}"}
                            </span>
                          </span>
                        </span>
                        <span data-offset-key="6takv-1-0">
                          <span data-text="true"> </span>
                        </span>
                        <span data-offset-key="6takv-5-0">
                          <span data-text="true"> </span>
                        </span>
                        <span class="prism-token token comment">
                          <span data-offset-key="6takv-6-0">
                            <span data-text="true">
                              "// returns ["hatsSKU", "shirtSKU"]"
                            </span>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductsArticle;
