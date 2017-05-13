import React from 'react';
import {connect} from 'react-redux';
import _ from 'underscore';
import { updateProductRate} from '../../../actions/actions';
import RatesOptions from './rateOptions';

class ExpandedProduct extends React.Component{
  constructor(props){
    super(props);
    const rates = this.props.rateInfo[0];
    const levelType1 = rates.Levels;
    const levelType2 =(levelType1 && levelType1.length) ? levelType1[0].Levels : null;
    const levelType3 =(levelType2 && levelType2.length) ? levelType2[0].Levels : null;
    const rateprops = this.getRateInfo([levelType1, levelType2, levelType3]);
    const rate = this.getRates(rateprops);
    const retailRate = this.getRetailRate(rate);
    this.props.dispatch(updateProductRate(retailRate.RetailRate, this.props.product.id));

    this.state = {
      RetailRate: retailRate
    }
  }
   Levels = (levelType, keyType) => {
    if(levelType && levelType.length ){
      return (<div className="row r-small-bottom-margin">
        <p className="r-gray r-bottom-no-margin r-small-text">{levelType[0].LevelType}</p>
        <select className="control-group">
        {levelType.map((item, i) => {
            return <option key={ `${keyType}${item.Desc}${this.props.product.id}${i}`}>{item.Desc}</option>
        })}
        </select>
      </div>);
    }
    return null;

  };

  getRateInfo = (levels) => {
    debugger;
    levels = levels.filter(level => level && level.length);
    if (levels) {
      return levels[levels.length - 1];
    }
  }
  getTerm = (rates, type) =>{
    const product = this.props.product;
    if (product.isRateable) {
  //  if ((product.extension_data && product.extension_data.length < 3) || (!product.extension_data)) {
        return (
            rates.map((item, i) => {
          return <option key={`${item.TermMileage.Term} / ${item.TermMileage.Mileage}${item.TermMileage.TermId + i}`}>{`${item.TermMileage.Term} / ${item.TermMileage.Mileage}`}</option>
        })
      );
  }
  const len =  product.extension_data.length;
  let term =0;
  let mileage =0;
  for (let i = 0; i < len; i++) {
  if(product.extension_data[i].option_name === 'Term'){
    term = product.extension_data[i].option_value;
  }
  if(product.extension_data[i].option_name === 'Mileage'){
    mileage = product.extension_data[i].option_value;
  }
  }
return [<option key={`${term} / ${mileage}`}>{`${term} / ${mileage}`}</option>];
}

  getRates = (rateprops) =>{
    if(rateprops && rateprops.length){
      return  rateprops[0].RateInfo.Rates
    }
  }
  getDeductible = (rates) => {
      const product = this.props.product;
      if (product.isRateable) {
        const DeductAmt = _(rates).groupBy((item) => item.Deductible.DeductAmt);
        const amount = Object.keys(DeductAmt);
        return (
          amount.map((item, i) => {
            return <option key = {
              item + i
            } > {
              item
            } < /option>
          })
        );
      }
      const len = product.extension_data.length;

      for (let i = 0; i < len; i++) {
        if (product.extension_data[i].option_name === 'Deductible') {

          return [ <option key = {`${product.extension_data[i].option_value}`} >
           { `${product.extension_data[i].option_value}`}
           </option>];
          }
        }
      }
  selectionEvent(priceObj) {
    let rate = this.state.RetailRate;
    if (priceObj.checked) {
      rate.RetailRate += priceObj.price;
    } else {
      rate.RetailRate -= priceObj.price;
    }
    rate.OptionId = priceObj.OptionId;
    rate.checked = priceObj.checked;
    this.setState({
      RetailRate: rate
    });
    this.props.dispatch(updateProductRate(rate.RetailRate, this.props.product.id));
  }

  getRateOptions = (Rates) => {
    const options  =[];
      Rates[0].Options.map((opt, i) => {
      const selected =  this.state.RetailRate.OptionId === opt.OptionId ? this.state.RetailRate.checked : opt.IsSelected;
      options.push(
                <RatesOptions key ={opt.OptionDesc+i}
                isSelected={selected}
                OptionDesc={opt.OptionDesc}
                IsSurcharge ={opt.IsSurcharge}
                opt ={opt}
                onSelect ={event => this.selectionEvent(event)}
                />);
      });
      return options;

  }
  getCost = rate => {
    let cost = 0;
    if(rate){
     cost = rate[0].DealerCost;
    rate[0].Options.map(item => {
      if(item.IsSelected){
        cost+=item.NetRate;
      }
    })
  }
    return cost + this.state.RetailRate.RetailRate;
  }
  getRetailRate = rate => {
    let retailPrice = {
      error:false,
      errorMessage:'',
      RetailRate:0,
      isDisabled : false,
      OptionId: 0,
      checked: false,
      min: 0,
      max: 0
    };
    if(rate&&rate.length){
    let RetailRate = rate[0].RetailRate;
    const RegulatedRuleId = rate[0].RegulatedRuleId;
      retailPrice.RetailRate=RetailRate,
      retailPrice.min = rate[0].MaxRetailRate,
      retailPrice.max = rate[0].MaxRetailRate


    rate[0].Options.map(item => {
      if(item.IsSelected){
        RetailRate+=item.RetailRate;
      }
    })
    if(RegulatedRuleId){
    const max =  rate[0].MaxRetailRate;
      const min = rate[0].MinRetailRate;
      if(RegulatedRuleId === 5){
          if(RetailRate < min || RetailRate > max ){
            retailPrice.error =true;
            retailPrice.errorMessage = `Price sholud be in the range of ${min}  and ${max}`;
          }
      }
      if(RegulatedRuleId === 3){
        retailPrice.isDisabled = true;
      }
    }
  }

    return retailPrice;
  }

  render(){
    if(this.props.rateInfo && !this.props.rateInfo.length){
      return <span/>;
    }
    const rates = this.props.rateInfo[0];
    const levelType1 = rates.Levels;
    const levelType2 =(levelType1 && levelType1.length) ? levelType1[0].Levels : null;
    const levelType3 =(levelType2 && levelType2.length) ? levelType2[0].Levels : null;
    const rateprops = this.getRateInfo([levelType1, levelType2, levelType3]);
    const rate = this.getRates(rateprops);
    const termMilage = rate ? this.getTerm(rate): [];
    const deductible = rate ?  this.getDeductible(rate) : [];
    const rateOptions = rate ? this.getRateOptions(rate) :[] ;

    return(
      <div className="row-fluid">
        <div className="span3 r-small-right-left-margin">
          <div className="rcorners">
            <div className="row r-small-bottom-margin-h"><b>PLATINUM</b></div>
            {this.Levels(levelType1, 'program')}
            {this.Levels(levelType2, 'coverage')}
            {this.Levels(levelType3, 'plan')}
            <div className="row r-small-bottom-margin">
              <p className="r-gray r-bottom-no-margin r-small-text">Term/Miles</p>
              <select className="control-group">
              {termMilage.map(item => item)}

              </select>
            </div>
            <div className="row r-small-bottom-margin">
              <p className="r-gray r-bottom-no-margin r-small-text">Deductible</p>
              <select className="control-group">

            {deductible.map(item => item)}
              </select>
            </div>
            <div className="row r-small-bottom-margin">
              <p className="r-gray r-small-text">Options</p>
              {rateOptions.map(item => item)}
            </div>
            <span className="prod-c">Cost</span>
     <div className="input-prepend input-append default-margin-tp-btm cus-input">
      <span className="add-on" id="sizing-addon2">$</span>
      <input value={this.getCost(rate)} type="text" className="control-group" onChange={() => {}}/>
     </div>
     <span className="prod-c">Price</span>
     <div className="input-prepend input-append default-margin-tp-btm cus-input">
        <span className="add-on" id="sizing-addon2">$</span>
      <input value ={this.state.RetailRate.RetailRate} type="text" className="control-group" onChange={() => {}}/>
     </div>
          </div>
        </div>
        <div className="span3 r-small-right-left-margin">
          <div className="rcorners">
            <div className="row r-small-bottom-margin-h"><b>GOLD</b></div>
            {this.Levels(levelType1)}
            {this.Levels(levelType2)}
            {this.Levels(levelType3)}
            <div className="row r-small-bottom-margin">
              <p className="r-gray r-bottom-no-margin r-small-text">Term/Miles</p>
              <select className="control-group">
                {termMilage}
                {termMilage.map(item => item)}
              </select>
            </div>
            <div className="row r-small-bottom-margin">
              <p className="r-gray r-bottom-no-margin r-small-text">Deductible</p>
              <select className="control-group">
                {deductible.map(item => item)}
              </select>
            </div>
            <div className="row r-small-bottom-margin">
              <p className="r-gray r-small-text">Options</p>
              {rateOptions.map(item => item)}
            </div>
            <span className="prod-c">Cost</span>
           <div className="input-prepend input-append default-margin-tp-btm cus-input">
            <span className="add-on" id="sizing-addon2">$</span>
            <input value={this.getCost(rate)} type="text" className="control-group" onChange={() => {}}/>
           </div>
           <span className="prod-c">Price</span>
           <div className="input-prepend input-append default-margin-tp-btm cus-input">
            <span className="add-on" id="sizing-addon2">$</span>
            <input value ={this.state.RetailRate.RetailRate} type="text" className="control-group" onChange={() => {}}/>
           </div>
          </div>
       </div>
        <div className="span3 r-small-right-left-margin">
          <div className="rcorners">
            <div className="row r-small-bottom-margin-h"><b>SILVER</b></div>
            {this.Levels(levelType1)}
            {this.Levels(levelType2)}
            {this.Levels(levelType3)}
            <div className="row r-small-bottom-margin">
              <p className="r-gray r-bottom-no-margin r-small-text">Term/Miles</p>
              <select className="control-group">
              {termMilage.map(item => item)}
              </select>
            </div>
            <div className="row r-small-bottom-margin">
              <p className="r-gray r-bottom-no-margin r-small-text">Deductible</p>
              <select className="control-group">
            {deductible.map(item => item)}
              </select>
            </div>
            <div className="row r-small-bottom-margin">
              <p className="r-gray r-small-text">Options</p>
              {rateOptions.map(item => item)}
            </div>
            <span className="prod-c">Cost</span>
     <div className="input-prepend input-append default-margin-tp-btm cus-input">
      <span className="add-on" id="sizing-addon2">$</span>
      <input value={this.getCost(rate)} type="text" className="control-group" onChange={() => {}}/>
     </div>
     <span className="prod-c">Price</span>
     <div className="input-prepend input-append default-margin-tp-btm cus-input">
      <span className="add-on" id="sizing-addon2">$</span>
      <input value ={this.state.RetailRate.RetailRate} type="text" className="control-group" onChange={() => {}}/>
     </div>
          </div>
        </div>
        <div className="span3 r-small-right-left-margin">
          <div className="rcorners">
            <div className="row r-small-bottom-margin-h"><b>BASIC</b></div>
            {this.Levels(levelType1)}
            {this.Levels(levelType2)}
            {this.Levels(levelType3)}
            <div className="row r-small-bottom-margin">
              <p className="r-gray r-bottom-no-margin r-small-text">Term/Miles</p>
              <select className="control-group">
                {termMilage.map(item => item)}
              </select>
            </div>
            <div className="row r-small-bottom-margin">
              <p className="r-gray r-bottom-no-margin r-small-text">Deductible</p>
              <select className="control-group">
              {deductible.map(item => item)}
              </select>
            </div>
            <div className="row r-small-bottom-margin">
              <p className="r-gray r-small-text">Options</p>
              {rateOptions.map(item => item)}
            </div>
            <span className="prod-tot">Cost</span>
             <div className="input-prepend input-append default-margin-tp-btm cus-input">
              <span className="add-on" id="sizing-addon2">$</span>
              <input value={this.getCost(rate)} type="text" className="form-control" onChange={() => {}}/>
             </div>
             <span className="prod-tot">Price</span>
            <div className="input-prepend input-append cus-input">
              <span className="add-on" id="sizing-addon2">$</span>
              <input value ={this.state.RetailRate.RetailRate} type="text" className="form-control" onChange={() => {}}/>
             </div>
          </div>
        </div>

      </div>
    );
  }
}
const mapStateToprops = state =>({
  rateInfo: state.rates.ratesInfo
});
const mapDispatchToProps = dispatch => ({dispatch });

export default connect(mapStateToprops, mapDispatchToProps)(ExpandedProduct);
