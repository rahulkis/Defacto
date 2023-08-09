import React from "react";

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buyMoreThanOneProduct: props.buyMoreThanOneProduct,
      selectedOption: props.defaultVal ? props.defaultVal : "",
      productName: props.productName,
      productPrice: props.productPrice,
      productCount: props.productCount,
      isChecked: props.defaultVal ? true : false,
      minQuantity: "1",
      maxQuantity: "10000000000",
      productList: props.ProductList,
      hideproductprices: props.hideproductprices,
      productSelectedLayout: { value: "list", label: "List" },
      activeSessionClass:
        "btn-raised  Choices__choice--1 choice-theme choice-input",
      InactiveSessionClass:
        "btn-raised  Choices__choice--1 choice-theme choice-input",
      ActiveColor: this.props.ActiveColor,
    };
  }

  componentWillMount() {
    this.setState({
      productSelectedLayout: this.props.productSelectedLayout
        ? this.props.productSelectedLayout
        : this.state.productSelectedLayout,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      buyMoreThanOneProduct: nextProps.buyMoreThanOneProduct,
      selectedOption: nextProps.defaultVal
        ? nextProps.defaultVal
        : this.state.selectedOption,
      productCount: nextProps.productCount,
      productName: nextProps.productName,
      productPrice: nextProps.productPrice,
      productList: nextProps.ProductList,
      hideproductprices: nextProps.hideproductprices,
      productSelectedLayout: nextProps.productSelectedLayout
        ? nextProps.productSelectedLayout
        : this.state.productSelectedLayout,
    });
  }

  handleChange = (e, index) => {
    let i;
    let selectedOption = "";
    let isChecked = false;
    if (e.target.checked) {
      selectedOption = e.target.value;
      isChecked = true;
    } else {
      selectedOption = "";
      isChecked = false;
    }
    let productsList = this.state.productList;
    if (!this.state.buyMoreThanOneProduct) {
      productsList.map((element, ind) => {
        if (index === ind) {
          productsList[ind].isSelected = e.target.checked;
        } else {
          productsList[ind].isSelected = false;
        }
        return productsList[ind].isSelected;
      });
    } else {
      productsList[index].isSelected = e.target.checked;
    }

    this.setState({
      selectedOption: selectedOption,
      isChecked: isChecked,
      productList: productsList,
    });

    if (this.props.from === "settings") {
      this.props.updateArticle("productList", productsList);
    } else {
      i = this.props.index;
      this.props.formJSON[i].productList = productsList;
      this.props.handleSelectedProducts(this.props.id, productsList); // for setting selected Products for submission & checks
    }

    this.props.handleChange(
      productsList,
      this.state.productList[index].SKU,
      this.props.id,
      selectedOption,
      isChecked
    );
  };

  
  removeAnswer = (e) => {
    for (let t = 0; t < this.state.productList.length; t++) {
      if (this.state.productList[t].isSelected === true) {
        // this.state.productList[t].isSelected = false;

        //-------------------------------------------------------------//
        let newProductList = this.state.productList;

        let updatedProductList = { ...newProductList[t], isSelected: false };

        newProductList = updatedProductList;
        this.setState({ productList: newProductList });
        //-------------------------------------------------------------------//
      }
    }
    let productList = this.state.productList.slice();
    this.setState({
      selectedOption: "",
      isChecked: false,
      productList: productList,
    });
    if (this.props.from === "settings") {
      this.props.updateArticle("productList", productList);
    }
  };
  handleInputChange = (e, index) => {
    // this.state.productList[index].productCount = e.target.value;
    //-----------------------------------------------------------------------------------//
    let newProductList = this.state.productList;
    let updatedProductList = {
      ...newProductList[index],
      productCount: e.target.value,
    };
    newProductList = updatedProductList;
    this.setState({ productList: newProductList });
    //--------------------------------------------------------------------------------//
    let productList = this.state.productList.slice();
    this.setState({
      productList: productList,
    });
    this.props.handleInputChange(e, index);
    if (this.props.from === "settings") {
      this.props.updateArticle("productList", productList);
    }
  };
  render() {
    return (
      <div>
        <div className="ProductConfiguration__DefaultBlock">
          <div className="choices">
            {this.state.buyMoreThanOneProduct === true ? (
              this.state.productSelectedLayout.value === "list" ? (
                this.state.productList.map((item, i) => {
                  let inputClass = item.isSelected
                    ? "Choices__choice btn-raised btn-product btn-default  Choices__choice--1 choice-input"
                    : "Choices__choice btn-raised btn-default  Choices__choice--1";
                  let imgLength = item.Images.length;
                  return (
                    <div key={i} className="Choices">
                      {imgLength > 0 && (
                        <div className="col-md-1 p-0">
                          <img
                            alt="..."
                            src={item.Images[0]}
                            className="option-img"
                          />
                        </div>
                      )}
                      <div
                        className={imgLength > 0 ? "col-md-11" : "col-md-12"}
                      >
                        <div className="Product__withquantity">
                          <label className={inputClass}>
                            <div className="Choices__label">
                              <input
                                type="checkbox"
                                value={item.Name}
                                onFocus={
                                  this.props.from !== "settings"
                                    ? this.props.onFocus(this.props.id)
                                    : ""
                                }
                                onBlur={
                                  this.props.from !== "settings"
                                    ? this.props.onBlur(this.props.id)
                                    : ""
                                }
                                className="product-check-box"
                                checked={item.isSelected}
                                onChange={(e) => this.handleChange(e, i)}
                              />
                              <div className="Product-label-wrapper">
                                <div className="Product-label">{item.Name}</div>
                                {this.state.hideproductprices === false && (
                                  <div className="Product__price">
                                    {this.props.currencySymbol || "$"}
                                    {item.Price}
                                  </div>
                                )}
                              </div>
                            </div>
                          </label>
                          {item.isSelected && (
                            <div>
                              <div className="multiply-icon">×</div>
                              <input
                                type="number"
                                className="LiveField__input LiveField__input--manualfocus product-count-input"
                                placeholder="1"
                                onFocus={
                                  this.props.from !== "settings"
                                    ? this.props.onFocus(this.props.id)
                                    : ""
                                }
                                onBlur={
                                  this.props.from !== "settings"
                                    ? this.props.onBlur(this.props.id)
                                    : ""
                                }
                                max={
                                  item.Stock
                                    ? item.Stock
                                    : this.state.MaxQuantity
                                }
                                min={
                                  item.MinQuantity
                                    ? item.MinQuantity
                                    : this.state.minQuantity
                                }
                                defaultValue={item.productCount}
                                style={{ width: "15%" }}
                                onChange={(e) => this.handleInputChange(e, i)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : this.state.productSelectedLayout.value === "card" ? (
                <div className="cards">
                  {this.state.productList.map((val, i) => {
                    let inputClass = val.isSelected
                      ? "Choices__choice btn-raised btn-product btn-default  card-input-box choice-input "
                      : "Choices__choice btn-raised btn-default";
                    let headingClass = val.isSelected
                      ? "card-heading Selected"
                      : "card-heading";
                    // let imgLength = ev.Images.length;
                    return (
                      <div key={i} className={headingClass}>
                        <div className="card-images">
                          {val.Images.length > 0 && (
                            <div className="image-view">
                              <img alt="... " src={val.Images[0]} />
                            </div>
                          )}
                          <label className={inputClass}>
                            <div className="Choices__label">
                              <input
                                onFocus={
                                  this.props.from !== "settings"
                                    ? this.props.onFocus(this.props.id)
                                    : ""
                                }
                                onBlur={
                                  this.props.from !== "settings"
                                    ? this.props.onBlur(this.props.id)
                                    : ""
                                }
                                type="checkbox"
                                value={val.Name}
                                className="product-check-box"
                                checked={val.isSelected}
                                onChange={(e) => this.handleChange(e, i)}
                              />
                              <div className="Product-label-wrapper">
                                <div className="Product-label">{val.Name}</div>
                                {this.state.hideproductprices === false && (
                                  <div className="Product__price">
                                    {this.props.currencySymbol || "$"}
                                    {val.Price}
                                  </div>
                                )}
                              </div>
                            </div>
                          </label>
                        </div>
                        {val.isSelected && (
                          <div>
                            <div className="multiply-icon">×</div>
                            <input
                              onFocus={
                                this.props.from !== "settings"
                                  ? this.props.onFocus(this.props.id)
                                  : ""
                              }
                              onBlur={
                                this.props.from !== "settings"
                                  ? this.props.onBlur(this.props.id)
                                  : ""
                              }
                              type="number"
                              className="LiveField__input LiveField__input--manualfocus product-count-input w-25"
                              placeholder="1"
                              max={
                                val.Stock ? val.Stock : this.state.MaxQuantity
                              }
                              min={
                                val.MinQuantity
                                  ? val.MinQuantity
                                  : this.state.minQuantity
                              }
                              defaultValue={val.productCount}
                              onChange={(e) => this.handleInputChange(e, i)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="gallery">
                  {this.state.productList.map((data, i) => {
                    let inputClass = data.isSelected
                      ? "Choices__choice btn-raised btn-product btn-default  gallery-check-disable choice-input"
                      : "Choices__choice btn-raised btn-default  gallery-check-disable";
                    // let imgLength = ev.Images.length;
                    return (
                      <div key={i} className="gallery-heading">
                        <div className="gallery-images">
                          {data.Images.length > 0 && (
                            <div
                              className="gallery-view"
                              style={{
                                backgroundImage:
                                  "url('" + data.Images[0] + "')",
                              }}
                            />
                          )}
                          <label className={inputClass}>
                            <div className="Choices__label">
                              <input
                                onFocus={
                                  this.props.from !== "settings"
                                    ? this.props.onFocus(this.props.id)
                                    : ""
                                }
                                onBlur={
                                  this.props.from !== "settings"
                                    ? this.props.onBlur(this.props.id)
                                    : ""
                                }
                                type="checkbox"
                                value={data.Name}
                                className="product-check-box"
                                checked={data.isSelected}
                                onChange={(e) => this.handleChange(e, i)}
                              />
                              <div className="Product-label-wrapper">
                                <div className="Product-label">{data.Name}</div>
                                {this.state.hideproductprices === false && (
                                  <div className="Product__price">
                                    {this.props.currencySymbol || "$"}
                                    {data.Price}
                                  </div>
                                )}
                              </div>
                            </div>
                          </label>
                        </div>{" "}
                        {data.isSelected && (
                          <div>
                            <div className="multiply-icon">×</div>
                            <input
                              type="number"
                              className="LiveField__input LiveField__input--manualfocus product-count-input w-25"
                              placeholder="1"
                              onFocus={
                                this.props.from !== "settings"
                                  ? this.props.onFocus(this.props.id)
                                  : ""
                              }
                              onBlur={
                                this.props.from !== "settings"
                                  ? this.props.onBlur(this.props.id)
                                  : ""
                              }
                              max={
                                data.Stock ? data.Stock : this.state.MaxQuantity
                              }
                              min={
                                data.MinQuantity
                                  ? data.MinQuantity
                                  : this.state.minQuantity
                              }
                              defaultValue={data.productCount}
                              onChange={(e) => this.handleInputChange(e, i)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            ) : this.state.productSelectedLayout.value === "list" ? (
              this.state.productList.map((list, i) => {
                return (
                  <div key={i} className="Choices">
                    {list.Images.length > 0 && (
                      <div className="col-md-1 p-0">
                        <img
                          alt="..."
                          src={list.Images[0]}
                          className="option-img"
                        />
                      </div>
                    )}
                    <div
                      className={
                        list.Images.length > 0 ? "col-md-11" : "col-md-12"
                      }
                    >
                      <div className="Product__withquantity">
                        <label
                          className={
                            this.state.selectedOption === list.isSelected
                              ? this.state.InactiveSessionClass
                              : this.state.activeSessionClass
                          }
                          style={{
                            background:
                              this.state.selectedOption === list.isSelected
                                ? ""
                                : `${this.state.ActiveColor}`,
                          }}
                        >
                          <div className="Choices__label">
                            <input
                              type="radio"
                              name="Choice"
                              onFocus={
                                this.props.from !== "settings"
                                  ? this.props.onFocus(this.props.id)
                                  : ""
                              }
                              onBlur={
                                this.props.from !== "settings"
                                  ? this.props.onBlur(this.props.id)
                                  : ""
                              }
                              value={list.Name}
                              className="input-radio"
                              onChange={(e) => this.handleChange(e, i)}
                              checked={list.isSelected}
                            />
                            <div className="Product-label-wrapper">
                              <div className="Product-label"> {list.Name}</div>
                              {this.state.hideproductprices === false && (
                                <div className="Product__price">
                                  {this.props.currencySymbol || "$"}
                                  {list.Price}
                                </div>
                              )}
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : this.state.productSelectedLayout.value === "card" ? (
              <div className="cards">
                {this.state.productList.map((cardVal, i) => {
                  return (
                    <div key={i} className="card-heading">
                      <div className="card-images">
                        {cardVal.Images.length > 0 && (
                          <div className="image-view">
                            <img alt="..." src={cardVal.Images[0]} />
                          </div>
                        )}
                        <label className="Choices__choice btn-raised btn-default choice-input">
                          <div className="Choices__label">
                            <input
                              type="radio"
                              name="Choice"
                              onFocus={
                                this.props.from !== "settings"
                                  ? this.props.onFocus(this.props.id)
                                  : ""
                              }
                              onBlur={
                                this.props.from !== "settings"
                                  ? this.props.onBlur(this.props.id)
                                  : ""
                              }
                              value={cardVal.Name}
                              className="input-radio"
                              onChange={(e) => this.handleChange(e, i)}
                              checked={cardVal.isSelected}
                            />
                            <div className="Product-label-wrapper">
                              <div className="Product-label">
                                {" "}
                                {cardVal.Name}
                              </div>
                              {this.state.hideproductprices === false && (
                                <div className="Product__price">
                                  {this.props.currencySymbol || "$"}
                                  {cardVal.Price}
                                </div>
                              )}
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="gallery">
                {this.state.productList.map((ev, i) => {
                  return (
                    <div key={i} className="gallery-heading">
                      <div className="gallery-images">
                        {ev.Images.length > 0 && (
                          <div
                            className="gallery-view"
                            style={{
                              backgroundImage: "url('" + ev.Images[0] + "')",
                            }}
                          />
                        )}
                        <label className="Choices__choice btn-raised btn-default choice-input">
                          <div className="Choices__label">
                            <input
                              type="radio"
                              name="Choice"
                              onFocus={
                                this.props.from !== "settings"
                                  ? this.props.onFocus(this.props.id)
                                  : ""
                              }
                              onBlur={
                                this.props.from !== "settings"
                                  ? this.props.onBlur(this.props.id)
                                  : ""
                              }
                              value={ev.Name}
                              className="input-radio"
                              onChange={(e) => this.handleChange(e, i)}
                              checked={ev.isSelected}
                            />
                            <div className="Product-label-wrapper">
                              <div className="Product-label"> {ev.Name}</div>
                              {this.state.hideproductprices === false && (
                                <div className="Product__price">
                                  {this.props.currencySymbol || "$"}
                                  {ev.Price}
                                </div>
                              )}
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {this.props.from === "settings" && this.state.isChecked && (
          <span
            className="btn-product remove-btn"
            style={{ position: "relative", zIndex: "2" }}
            onClick={() => this.removeAnswer()}
          >
            Remove Default Answer
          </span>
        )}
      </div>
    );
  }
}

export default Products;
