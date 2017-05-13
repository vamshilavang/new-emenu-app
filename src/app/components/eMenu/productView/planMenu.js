  import React, { Component } from 'react';

  class PlanMenu extends Component {
    constructor() {
      super();
      this.renderPlan=this.renderPlan.bind(this);
    }
  rendorPlan(planList){
                var listProducts =  planList.map((itm, index) =>
                  <div className ="btn prod-menu" key={"itmVl1"+index} >
                   <span className="">{itm.title}</span>
                  </div>
                );
                return listProducts;
  }
  render() {
    return (
      <div className="plan-menu">
        <span id="prod-head">Products</span>
        <div className="menu-options">
          {this.rendorPlan([{title: 'PLATINUM'}, {title: 'GOLD'}, {title: 'SILVER'},{title: 'BASIC'}])}
        </div>
     </div>
     )
   }
}
export default PlanMenu;
