/* ===== CHEFBOT SCRIPT.JS ===== */

// ---- State ----
var order = [];
var orderTotal = 0;

// ---- Menu Data ----
var menu = {
  pizza: [
    { e: "🍕", n: "Margherita",       d: "Tomato & mozzarella",   p: "$12.99", v: 12.99 },
    { e: "🔥", n: "Spicy Pepperoni",  d: "Double pepperoni",       p: "$15.99", v: 15.99 },
    { e: "🧀", n: "4-Cheese Special", d: "4 premium cheeses",      p: "$14.99", v: 14.99 }
  ],
  burger: [
    { e: "🍔", n: "Classic Burger",   d: "Double beef patty",      p: "$9.99",  v: 9.99  },
    { e: "🌶️", n: "Spicy Chicken",   d: "Crispy + sriracha",      p: "$11.99", v: 11.99 },
    { e: "🥑", n: "Avocado Burger",   d: "Fresh avocado",          p: "$13.99", v: 13.99 }
  ],
  deals: [
    { e: "🎉", n: "Family Feast",     d: "2 pizzas + 4 burgers",   p: "$39.99", v: 39.99 },
    { e: "💑", n: "Date Night",       d: "Pizza + pasta + dessert", p: "$29.99", v: 29.99 },
    { e: "⚡", n: "Lunch Deal",       d: "Burger + fries + drink",  p: "$12.99", v: 12.99 }
  ]
};

// ---- Utility ----
function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ---- Add message ----
function addMessage(text, isUser, menuItems) {
  var c = document.getElementById('msgs');
  var d = document.createElement('div');
  d.className = 'msg ' + (isUser ? 'user' : 'bot');

  var cardsHTML = '';
  if (menuItems && menuItems.length) {
    cardsHTML = '<div class="menu-cards">' +
      menuItems.map(function(item) {
        return '<div class="item-card" onclick="addToOrder(\'' + item.n + '\',' + item.v + ')">' +
          '<div class="ic-emoji">' + item.e + '</div>' +
          '<div class="ic-name">' + item.n + '</div>' +
          '<div class="ic-sub">' + item.d + '</div>' +
          '<div class="ic-sub" style="font-weight:700;margin-top:3px">' + item.p + '</div>' +
          '<button class="ic-btn">+ Add</button>' +
          '</div>';
      }).join('') + '</div>';
  }

  var formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');

  d.innerHTML =
    '<div class="msg-av">' + (isUser ? '👤' : '🍕') + '</div>' +
    '<div><div class="bubble">' + formatted + cardsHTML + '</div>' +
    '<div class="msg-time">' + getTime() + '</div></div>';
  c.appendChild(d);
  c.scrollTop = c.scrollHeight;
}

// ---- Typing ----
function showTyping() {
  var c = document.getElementById('msgs');
  var d = document.createElement('div');
  d.className = 'typing-wrap'; d.id = 'typingDots';
  d.innerHTML =
    '<div class="msg-av" style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#e06000,#ff8c00);display:flex;align-items:center;justify-content:center;font-size:12px;">🍕</div>' +
    '<div class="typing-bub"><span></span><span></span><span></span></div>';
  c.appendChild(d); c.scrollTop = c.scrollHeight;
}
function removeTyping() {
  var t = document.getElementById('typingDots'); if (t) t.remove();
}

// ---- Add to order ----
function addToOrder(name, price) {
  order.push({ name: name, price: price });
  orderTotal = parseFloat((orderTotal + price).toFixed(2));
  document.getElementById('oc').textContent =
    order.length + ' item' + (order.length > 1 ? 's' : '') + ' — $' + orderTotal.toFixed(2);
  addMessage('✅ **' + name + '** added!\nTotal: **$' + orderTotal.toFixed(2) + '**', false);
}

// ---- Place order ----
function placeOrder() {
  if (!order.length) {
    addMessage('Cart is empty! Let me show the menu. 🍕', false);
    return;
  }
  var summary = order.map(function(i) { return '✅ ' + i.name + ' — $' + i.price.toFixed(2); }).join('\n');
  addMessage(
    '🎉 **Order Placed!**\n\n' + summary +
    '\n\n**Total: $' + orderTotal.toFixed(2) + '**\n🚗 Delivery in 25-40 min!', false
  );
  order = []; orderTotal = 0;
  document.getElementById('oc').textContent = '0 items — $0.00';
}

// ---- Get reply ----
function getReply(msg) {
  var m = msg.toLowerCase();
  if (m.includes('menu') || m.includes('what'))         return { text: '🍽️ Our full menu:', items: [...menu.pizza, ...menu.burger] };
  if (m.includes('pizza'))                              return { text: '🍕 Our delicious pizzas:', items: menu.pizza };
  if (m.includes('burger'))                             return { text: '🍔 Juicy burgers:', items: menu.burger };
  if (m.includes('deal') || m.includes('special'))     return { text: '🔥 Today\'s deals:', items: menu.deals };
  if (m.includes('deliver') || m.includes('time'))     return { text: '🚗 Delivery: **25-40 minutes**\nFee: $2.99 (Free over $30!)\nArea: Within 10km' };
  if (m.includes('veg') || m.includes('vegetar'))      return { text: '🥗 Vegetarian options:\n• Margherita $12.99\n• 4-Cheese $14.99\n\nFresh daily!' };
  if (m.includes('hi') || m.includes('hello'))         return { text: '👋 Welcome to **Bella Italia**! I\'m ChefBot. What would you like to eat? 😋' };
  return { text: 'I can show menu, take orders, or answer questions.\nTry: "Show me pizza" 🍕' };
}

// ---- Send ----
function send() {
  var input = document.getElementById('ci');
  var msg = input.value.trim();
  if (!msg) return;
  document.getElementById('qr').style.display = 'none';
  input.value = '';
  addMessage(msg, true);
  showTyping();
  var r = getReply(msg);
  setTimeout(function() {
    removeTyping();
    addMessage(r.text, false, r.items || null);
  }, 900);
}

function sq(msg) { document.getElementById('ci').value = msg; send(); }
document.getElementById('ci').addEventListener('keypress', function(e) { if (e.key === 'Enter') send(); });
document.getElementById('hamBtn').addEventListener('click', function() { document.getElementById('mobMenu').classList.toggle('open'); });
window.addEventListener('load', function() {
  setTimeout(function() {
    addMessage(
      '👋 Welcome to **Bella Italia**! 🍕\n\nI\'m ChefBot — your AI food assistant.\n\n🔥 Today\'s Special: Family Feast for **$39.99**!\n\nWhat would you like to eat? 😋', false
    );
  }, 600);
});
