/* eslint-disable no-alert */

/***The line below allows us to access the data from the window object.
 * This comes from the data.js file***/
const data = window.data;

/***Before we can begin manipulating the DOM we need to gain access to two DOM Nodes***/
// 1. Declare a variable bigCoffee that holds reference to the element with id 'big_coffee'.
// your code here
const bigCoffee = document.getElementById('big_coffee');

// 2. Declare a variable producerContainer that holds reference to the element with id 'producer_container'.
// your code here
const producerContainer = document.getElementById('producer_container');

/***Don't worry about the specifics of the condition in this if statement for now.
 * Just follow the instructions in it to ensure the application has base functionality.
 * We'll discuss in depth later what process is, but it's not necessary just yet.***/
if (typeof process === 'undefined') {
  /********************
   *   Event Listeners
   ********************/

  /* 1. Add a 'click' event listener to the bigCoffee element(giant coffee emoji) you referenced above.
   * It should call the clickCoffee function below and be passed the global data object.*/
  // your code here
  bigCoffee.addEventListener("click", () => {
      clickCoffee(data);
    });
  /* 2. Add a 'click' event listener to the producerContainer(Coffee Producers panel) you referenced above.
   * It should call the buyButtonClick function below and be passed the browser event and global data object.*/
  // your code here
  producerContainer.addEventListener("click", (event) => {
  buyButtonClick(event, data)
});
  // You don't need to edit this line of code. It calls the tick function passing in the data object every 1000ms or 1s.
  setInterval(() => tick(data), 1000);
}

// Now you're ready to start running the tests. Good luck!

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
const coffeeCounter = document.querySelector('#coffee_counter');
coffeeCounter.innerText = coffeeQty; 

} 

function clickCoffee(data) {
 data.coffee++
 updateCoffeeView(data.coffee);
  renderProducers(data);

}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  for(let i = 0;  i < producers.length; i++ ) {
  let producer = producers[i];
  if(coffeeCount >= (producer.price / 2)){
  producer.unlocked = true;
}
  }
}
function getUnlockedProducers(data) {
 let unlockedProducer = data.producers.filter(producer => producer.unlocked) 
return unlockedProducer;
 
}

function makeDisplayNameFromId(id) {
    const wordSplit = id.split("_");
  const wordJoin = wordSplit
    .map((word) => word[0].toUpperCase() + word.substr(1).toLowerCase())
    .join(" ");
  return wordJoin;

}


// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  Array.from(parent.childNodes)
 .forEach(child => parent.removeChild(child))
}

function renderProducers(data) {
  const producerContain = document.querySelector('#producer_container');
  unlockProducers(data.producers, data.coffee);
  deleteAllChildNodes(producerContain);
  getUnlockedProducers(data).map(producer => makeProducerDiv(producer))
  .forEach(containerDiv => {
    producerContain.append(containerDiv)
  })
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  const producerById = data.producers.filter(
    (producer) => producer.id === producerId
  );
  return producerById[0];
}

function canAffordProducer(data, producerId) {
  let producerPrice = getProducerById(data, producerId).price;
  return producerPrice <= data.coffee;
}

function updateCPSView(cps) {
  document.getElementById('cps').innerText = cps
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice*1.25);
}

function attemptToBuyProducer(data, producerId) {
  if (canAffordProducer(data, producerId)) {
    let producer = getProducerById(data, producerId);
    producer.qty++;
    data.coffee = data.coffee - producer.price;
    producer.price = updatePrice(producer.price);
    data.totalCPS += producer.cps;
    updateCoffeeView(data.coffee);
    updateCPSView(data.totalCPS);
    renderProducers(data);

    return true;
  }
    return false;
}

function buyButtonClick(event, data) {
  const id = String(event.target.id).slice(4);
  const producer = getProducerById(data,id);
  if (event.target.tagName === 'BUTTON') {
    if (canAffordProducer(data,id)) {
      document.getElementById('producer_container').append(producer);
      attemptToBuyProducer(data,id);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    }
    else {
      window.alert("Not enough coffee!")
    }
  }
}

function tick(data) {
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**********************************
 *  Congratulations! You did it!
 **********************************/

// You don't need to edit any of the code below
// If we aren't in a browser and are instead in node
// we'll need to export the code written here so we can import and
// run the tests in Mocha. More on this later.
// Don't worry if it's not clear exactly what's going on here.
if (typeof process !== 'undefined') {
 // console.log('------> process here!!!!!: ', process);
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
