// EDIT THESE: your store details and products
var PHONE = "2349085836894"; // WhatsApp number, country code first, no + or spaces
var CURRENCY = "₦";
var PRODUCTS = [
  {id:1,name:"Logo Design",cat:"Graphics",price:15000,icon:"✏️",desc:"A custom logo with 3 concepts and files for print and web."},
  {id:2,name:"Flyer or Poster",cat:"Graphics",price:5000,icon:"📄",desc:"Print-ready design for events, sales and promotions."},
  {id:3,name:"Business Card",cat:"Graphics",price:5000,icon:"💳",desc:"Front and back design, ready to print."},
  {id:4,name:"Social Media Pack",cat:"Graphics",price:20000,icon:"📱",desc:"10 matching post designs for Instagram, Facebook or X."},
  {id:5,name:"Brand Kit",cat:"Graphics",price:45000,icon:"🎨",desc:"Logo, colours, fonts and a simple brand guide."},
  {id:6,name:"One-Page Website",cat:"Websites",price:60000,icon:"🖥️",desc:"A fast landing page with your contact and WhatsApp link."},
  {id:7,name:"Business Website",cat:"Websites",price:150000,icon:"🌐",desc:"Up to 5 pages, mobile friendly, ready to launch."},
  {id:8,name:"Online Store Website",cat:"Websites",price:250000,icon:"🛒",desc:"Product pages, cart and ordering for your shop."}
];
var cart = {}, filter = "All";
var $ = function(id){return document.getElementById(id)};
var money = function(n){return CURRENCY + n.toLocaleString()};

function renderFilters(){
  var cats = ["All"].concat(PRODUCTS.map(function(p){return p.cat}).filter(function(c,i,a){return a.indexOf(c)===i}));
  var el = $("filters");
  if(el) el.innerHTML = cats.map(function(c){return '<button class="chip" aria-pressed="'+(c===filter)+'" data-c="'+c+'">'+c+'</button>'}).join("");
}

function renderGrid(){
  var el = $("grid");
  if(el) el.innerHTML = PRODUCTS.filter(function(p){return filter==="All"||p.cat===filter}).map(function(p){
    return '<article class="card"><div class="thumb" aria-hidden="true">'+p.icon+'</div><h3>'+p.name+'</h3><p class="d">'+p.desc+'</p><div class="row"><span class="price">'+money(p.price)+'</span><button class="add" data-id="'+p.id+'">Add to order</button></div></article>';
  }).join("");
}

function renderCart(){
  var ids = Object.keys(cart), n = 0, t = 0, lines = [];
  var html = ids.map(function(id){
    var p = PRODUCTS.filter(function(x){return x.id==id})[0], q = cart[id];
    n += q; t += q*p.price; lines.push("• " + q + " x " + p.name + " (" + money(p.price * q) + ")");
    return '<div class="line"><div><b>'+p.name+'</b><br><span style="color:var(--muted)">'+money(p.price)+'</span></div><div class="qty"><button data-d="-1" data-id="'+id+'" aria-label="Remove one">−</button><span>'+q+'</span><button data-d="1" data-id="'+id+'" aria-label="Add one">+</button></div></div>';
  }).join("");
  
  var itemsEl = $("items"), countEl = $("count"), totalEl = $("total"), checkoutEl = $("checkout");
  
  if(itemsEl) itemsEl.innerHTML = html || '<p class="empty">Your order is empty. Add a service to get started.</p>';
  if(countEl) countEl.textContent = n; 
  if(totalEl) totalEl.textContent = money(t);
  
  if(checkoutEl) {
    // Beautifully formatted WhatsApp message with Bold titles
    var msg = "*📦 NEW ORDER REQUEST*\n\n" + lines.join("\n") + "\n\n*Total Amount:* " + money(t);
    checkoutEl.href = "https://wa.me"+PHONE+"?text="+encodeURIComponent(msg);
    checkoutEl.style.display = n ? "block" : "none";
  }
}

function setDrawer(open){
  var el = $("drawer");
  if(el) {
    el.classList.toggle("open", open);
    el.setAttribute("aria-hidden", !open);
  }
}

// Fixed Event Delegation using absolute Numeric parsing (+e.target.dataset.id)
var filtersEl = $("filters"), gridEl = $("grid"), itemsEl = $("items"), openCartEl = $("openCart"), closeCartEl = $("closeCart"), chatEl = $("chat"), yrEl = $("yr");

if(filtersEl) filtersEl.onclick = function(e){var c=e.target.dataset.c; if(c){filter=c;renderFilters();renderGrid()}};
if(gridEl) gridEl.onclick = function(e){
  var id=e.target.dataset.id; 
  if(id){
    id = +id; // Convert string key to number safely
    cart[id]=(cart[id]||0)+1; 
    renderCart(); 
    setDrawer(true);
  }
};
if(itemsEl) itemsEl.onclick = function(e){
  var id=e.target.dataset.id, d=e.target.dataset.d;
  if(id&&d){
    id = +id; // Convert string key to number safely
    cart[id]+=+d; 
    if(cart[id]<1) delete cart[id]; 
    renderCart();
  }
};

if(openCartEl) openCartEl.onclick = function(){setDrawer(true)};
if(closeCartEl) closeCartEl.onclick = function(){setDrawer(false)};
document.addEventListener("keydown",function(e){if(e.key==="Escape")setDrawer(false)});

if(chatEl) chatEl.href = "https://wa.me"+PHONE+"?text="+encodeURIComponent("Hello NOBLE Visuals, I have a design project I would like to discuss.");
if(yrEl) yrEl.textContent = new Date().getFullYear();

// Initial Run
renderFilters(); renderGrid(); renderCart();
