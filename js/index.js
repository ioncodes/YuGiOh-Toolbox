var request = require('request')
const dbUrl = 'https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=1&sess=1&stype=1&ctype=&starfr=&starto=&pscalefr=&pscaleto=&linkmarkerfr=&linkmarkerto=&atkfr=&atkto=&deffr=&defto=&othercon=2&keyword='
const cardUrl = 'http://yugiohprices.com/api/card_data/'
const imageUrl = 'http://yugiohprices.com/api/card_image/'
const priceUrl = 'http://yugiohprices.com/api/get_card_prices/'
const dbRegex = /<strong>(.+)<\/strong>/g
const dbLanguageRegex = /value="(card_search.+)">/g
const dbEnglishNameRegex = /<span>(.+)<\/span>/

function handleEnter(e) {
  if(e.keyCode === 13){
    searchCards()
  } 
}

function searchCards() {
  request(dbUrl + encodeURI(document.getElementById('searchbox').value), function (error, response, body) {
    var matches, output = []
    while (matches = dbRegex.exec(body)) {
      output.push(matches[1])
    }
    if(!document.getElementById('language').checked) {
      // TODO: fix this; somehow doesnt work via this script. It returns a page without results
      // get the english name from the detail page
      var matches, lngs = []
      while (matches = dbLanguageRegex.exec(body)) {
        lngs.push('https://www.db.yugioh-card.com/yugiohdb/' + matches[1])
      }
      for(let i = 0; i < lngs.length; i++) {
        request(lngs[i], function (error, response, body) {
          var enName = body.match(dbEnglishNameRegex)[1]
          output[i] = enName
        })
      }
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
        img.onmouseover = function() {
          getPrice(cardInfo.name)
        }
        cards.appendChild(img)
      })
    }
  })
}

function getPrice(name) {
  request(priceUrl + name, function (error, response, body) {
    var json = JSON.parse(body).data[0].price_data.data.prices
    var txt = '$' + json.average
    document.getElementById('price').textContent = txt
  })
}