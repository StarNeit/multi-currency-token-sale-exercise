// libraries
import BigNumber from 'bignumber.js';
const readline = require('readline');
const { once } = require('events');
const rl = readline.createInterface({
  input: process.stdin,
});

//settings
const fmt = {
    "prefix": '',
    "decimalSeparator": '.',
    "groupSeparator": '',
    "groupSize": 3,
    "secondaryGroupSize": 0,
    "fractionGroupSeparator": ' ',
    "fractionGroupSize": 0,
    "suffix" : ''
  }
BigNumber.config({ FORMAT: fmt })




// main

export const readInput = async function():Promise<Array<Array<string>>> {
    let result:Array<Array<string>> = [];
    rl.on('line', (line) => {
        const lineData = line.split(" ");
        result.push(lineData);
    });
    await once(rl, 'close');
    return result;
}

export const processInput = function (inputData:Array<Array<string>>):Array<string> {
    let result:Array<string> = [];
    let btcUsdRate:BigNumber = new BigNumber(inputData[0][0]);
    let ethUsdRate:BigNumber = new BigNumber(inputData[0][1]);
    let dogeUsdRate:BigNumber = new BigNumber(inputData[0][2]);

    for (let index = 1; index < inputData.length; index++) {
        const purchaseData = inputData[index];
        const ethSaleRate :BigNumber = new BigNumber(purchaseData[0]);
        const saleDecimalPlaces:number = parseInt(purchaseData[1]) ;
        const purchaseCurrency:string =purchaseData[2];
        const purchaseAmount:BigNumber = new BigNumber(purchaseData[3]);
        let currencyEth:BigNumber;

        switch (purchaseCurrency) {
            case 'ETH': 
                currencyEth = new BigNumber(1);
                break;

            case 'BTC':
                currencyEth = btcUsdRate.dividedBy(ethUsdRate);
                break;

            case 'DOGE':
                currencyEth = dogeUsdRate.dividedBy(ethUsdRate);
                break;
        }
        const currencySale:BigNumber = ethSaleRate.multipliedBy(purchaseAmount).multipliedBy(currencyEth);
        const formatedCurrencySale:string = currencySale.toFormat(saleDecimalPlaces, BigNumber.ROUND_DOWN, fmt);
        result.push(formatedCurrencySale);
    }
    return result; 
}


export const get_sales = async  function():Promise<Array<string>>  {
    const input = await readInput();
    return processInput(input);
}


get_sales().then((output) => {
    console.log(output);
})
