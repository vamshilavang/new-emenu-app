import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App/>,document.getElementById('root'));

 let queryparam =  function(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
       vars[hash[0]] = hash[1];
    }
    return vars;
}
// console.log('window.location.href', window.location.href, queryparam().deal_type)
// window.dealerData.deal_type = queryparam().deal_type
console.log('dealer_code',window.dealerData)



// let dealId = document.getElementById('dealid').value;

// let dealjacketid = document.getElementById('dealjacketid').value;

//

// localStorage.setItem("dealjacketid", dealjacketid)

// localStorage.setItem("dealid", dealId)
