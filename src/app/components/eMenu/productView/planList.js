import React, { Component } from 'react';

class PlanOption extends Component {
  constructor() {
    super();
    this.renderPlan=this.renderPlan.bind(this);
  }

  renderPlan(planList){
            var moreProductOptions = planList,
            listProducts =  moreProductOptions.map((moreProduct, index) =>
              <div className ="span3" key={"itmVl"+index}>
              <div className ="r-panel1" key={"itmVl1"+index}>
                <p>{moreProduct.title}</p>
                <span className="prod-tot">Cost</span>
               <div className="input-prepend input-append cus-input default-margin-tp-btm">
                <span className="add-on" id="sizing-addon2">$</span>
                <input type="text" className="form-control"/>
               </div>
               <span className="prod-tot">Price</span>
              <div className="input-prepend input-append cus-input">
                <span className="add-on" id="sizing-addon2">$</span>
                <input type="text" className="form-control"/>
               </div>
              </div>
              </div>
            );
            return listProducts;
  }
  render() {
      return (
         <div>
          {this.renderPlan([{title: 'PLATINUM'}, {title: 'GOLD'}, {title: 'SILVER'},{title: 'BASIC'}])}
          <hr/>
           <button className="btn btn-primary pull-right p-btn">presentation mode</button>
         </div>
          )
          }
}
export default PlanOption;
