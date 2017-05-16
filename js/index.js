var request = require('request')
const dbUrl = 'https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=1&sess=1&stype=1&ctype=&starfr=&starto=&pscalefr=&pscaleto=&linkmarkerfr=&linkmarkerto=&atkfr=&atkto=&deffr=&defto=&othercon=2&keyword='
const cardUrl = 'http://yugiohprices.com/api/card_data/'
const imageUrl = 'http://yugiohprices.com/api/card_image/'
const dbRegex = /<strong>(.+)<\/strong>/g

function handleEnter(e) {
  if(e.keyCode === 13){
    searchCards()
  } 
}

function searchCards() {
  request(dbUrl + document.getElementById('searchbox').value, function (error, response, body) {
    var matches, output = []
    while (matches = dbRegex.exec(body)) {
      output.push(matches[1])
    }
    // output stores official cardnames
    for(let i = 0; i < output.length; i++) {
      request(cardUrl + output[i], function (error, response, body) {
        var cardInfo = JSON.parse(body).data
        var cardImage = imageUrl + output[i]
        var cards = document.getElementById('cards')
        
        var img = document.createElement('img')
        img.src = cardImage
        img.alt = cardInfo.name
        img.className = 'card'

        cards.appendChild(img)
      })
    }
  })
}