import React from 'react';
import {getDealerRates, updateProductRate} from '../../../actions/actions';
import ExpandedProduct from './ExpandedProduct';
import {connect} from 'react-redux';

function getPrice(rateInfo) {
return  rateInfo.length ? getDealerCost(rateInfo[0]) : 0;
}

function getDealerCost(rateInfo) {
  debugger;
  let dealerCost = 0;
  let levelLookUp = rateInfo.Levels[0];
  while(levelLookUp){
    if(levelLookUp.RateInfo && levelLookUp.RateInfo.Rates[0] ){
      dealerCost = levelLookUp.RateInfo.Rates[0].DealerCost;
      levelLookUp.RateInfo.Rates[0].Options.map(item => {
        if(item.IsSelected){
          dealerCost+=item.NetRate;
        }
      })
    }
    levelLookUp = levelLookUp.Levels[0];
  }
  return dealerCost;
}

class Product extends React.Component{
  constructor(props){
    super(props);
      this.state = {
          imageUrl: this.props.optType.imageUrl,
          title: this.props.optType.title,
          showMore: false,
          platinum: this.props.optType.platinum,
          gold: this.props.optType.gold,
          silver: this.props.optType.silver,
          basic: this.props.optType.basic,
          providerCode: props.optType.providerList[0].provider_code
      }

  }
  componentWillMount(){
    this.props.dispatch(updateProductRate(getPrice(this.props.rateInfo), this.props.optType.id));
    this.props.dispatch(getDealerRates());
  }
  // componentWillReceiveProps(nextProps){
  //   const price = getPrice(nextProps.rateInfo);
  //     this.setState({price: price});
  // }
  updateShowMore(event) {
    this.setState({ showMore: !this.state.showMore });
  }
  getRates(event){
   this.setState({providerCode :  this.props.optType.providerList[selectedIndex].provider_code});
  }
  render(){
    const id = this.props.optType.id;
    return(
      <div className="">
        <div className="row-fluid product">
          <div className="span4">
          <img src={this.props.optType.imageUrl ? this.props.optType.imageUrl.toString() : ""} width="100%" />
        </div>
        <div className="span4">
         <div className="prov-list">
          <p className="r-no-bottom-margin"><b>{this.state.title}</b></p>
          <p className="r-gray">{this.props.price.get(id)}</p>
          <p className="r-no-bottom-margin r-gray r-medium-text">Provider</p>
          <select className="control-group prod-form" onChange={(event) => this.getRates(event)}>
          {this.props.optType.providerList.map((provider, i) => <option key={provider.providerName+provider.providerId+i}>{provider.providerName}</option>)})}
          </select>
          <p className="r-small-top-margin"><a className="anchor-pointer" onClick={this.updateShowMore.bind(this)}>{this.state.showMore == false ? 'Show More' : 'Show Less'}</a></p>
         </div>
      </div>
        <div className="span4 r-checkbox-margin-top">
          <span className="row">
            <input className="prodbx" type="checkbox" key="platinum" value={this.state.platinum} />
            <input className="prodbx" type="checkbox" key="gold" value={this.state.gold} />
            <input className="prodbx" type="checkbox" key="silver" value={this.state.silver}/>
            <input className="prodbx" type="checkbox" key="basic" value={this.state.basic} />
          </span>
        </div>
      </div>
      {
        this.state.showMore && <ExpandedProduct key={"Expanded" + this.props.key} product ={this.props.optType} />
      }
      <hr/>

    </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({dispatch });
const mapStateToprops = state =>({
  rateInfo: state.rates.ratesInfo,
  price: state.rates.productPrice
});

export default connect(mapStateToprops, mapDispatchToProps)(Product);
