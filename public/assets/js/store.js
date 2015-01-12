/**
* main js for the browser-control of the stock
*/
prettyTime = moment;
prettyTime.lang("es");

var stock = stock || {
	/* parameters */
	searchON : false, 
	detailsURI : "details",
	searchURI : "/search",
	/* initializing instances */
	ticket : new Ticket(),
	item : new Item(),
	user : null,
	/* event triggers */
	$list : $("#list"), 
	$suggestionsHolder : $("#results"),
	$ticketList : $("#list-items"),
	$clock : $("#date"),
	$notice : $("#notice"),


	init :  function() {
		stock.getUser();
		stock.$clock.html(moment().format('LL'));
		stock.ticketUI.getTicketID();

	},

	getUser : function () {
		$.getJSON( "/current_user")
		.done(function(user) {
			stock.user = user;
			stock.ticket.user = user;
		});
	},

	/* get  item by its code */
	getItem :  function (code) {
		$.getJSON( stock.detailsURI, {
			code : code
		})
		.done(function(item) {
			if (item === null)
				throw stock.error.itemNotFound;
			else{
				stock.ticket.add(item);
				stock.$ticketList.append(stock.toHtml._item(item));
				stock.ticketUI.update();
			}
		});
	},

	/* list items to the stock grid */
	getItems : function (filter, sort) {
		$.getJSON(stock.searchURI, {
			q : filter,
			s : sort
		})
		.done (function (results) {
			if (results === null || results.length === 0)
				throw stock.error.noSearchResults;
			else {
				var html = stock.toHtml.itemGrid(results);
				stock.$list.html(html);
			}
				
		})
			

	},

	/* Instant search */
	instantSearch : function (query) {
		$.getJSON(stock.searchURI, {
			q : query
		})
		.done (function (results) {
			if (results === null || results.length === 0)
				stock.toHtml.showError(stock.error.noSearchResults)
			else {
				var html = stock.toHtml.suggestions(results);
				stock.$suggestionsHolder.empty().append(html);
			}
				
		})
	},

	toHtml : {
		_itemDetail :  function(item) {
			return "<a href='/items/" + item.slug +"'><div class='little item'><span class='number'>"+ item.id + '</span>'+
		      '<span class="code">'+ item.code+ '</span>'+
		      '<span class="description">' + item.description +'</span>'+
		      '<span class="saleI">' + item.sale +'</span>' +
		      '<span class="stock">' + item.stock +'</span>'+
		      '<span class="update">' + prettyTime(item.last_check).fromNow() +'</span></div></a>';
		},

		itemGrid : function (items) {
			var html = ""
			for(i = 0; i < items.length; i++) {
				html += stock.toHtml._itemDetail(items[i]); 
			}
			return html;
		},

		_item : function( item ) {
			return "<a data-item='" + JSON.stringify(item) +"'><div class='item'><span class='number'>"+ item.id + '</span>'+
		      '<span class="code">'+ item.code+ '</span>'+
		      '<span class="description">' + item.description +'</span>'+
		      '<span class="saleI">' + item.sale +'</span></div></a>';
		},

		_itemyze : function (item) {
			return "<li data='" + JSON.stringify(item)+ "'><span class='description'>" + item.description +"</span><strong class='sale'>" + item.sale +"</strong></li>"
		},

		suggestions : function (items) {
			var html = "";
			for (i = 0; i < items.length; i++ ) 
				html += stock.toHtml._itemyze(items[i]);
			return html;
		},

		toList :  function (item) {
			var html = "";
		},

		showError : function (error) {
			stock.$suggestionsHolder.html(error)
		},

		resetTicket : function () {
			$ticketList.empty();
			stock.ticket =  new Ticket();
		}

	},

	utils : {
		$hush : $("#hush"),
		$check : $("#last_check"),
		$destroy : $("#destroyItem"),

		newHash : function(size) {
			var s = 6;
			var hash = "";
			var seed = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLXCVBNM";
			if (typeof size !== "undefined" && size > s)
				s = size;
			
			for (var i = 0; i < s; i++) {
				hash += seed[Math.floor(Math.random() * seed.length)];
			};

			return hash;
		},

		now : function () {
			var date  = new Date();
			return date.toISOString();
		},

		newItem : function () {
			stock.utils.$hush.val(stock.utils.newHash());
			stock.utils.$check.val(stock.utils.now());
		},

		deleteItem :  function () {
			if(confirm("Deseas eliminar este elemento?")){
				var token = stock.utils.extractToken();
				var id = location.pathname.split("/").pop();
				$post = $.get("/items/"+id+"/delete", {
					authenticity_token :  token,
					hush : 	"ndrd",
				});
								console.log($post);

				$post.done(function(){
					alert("Articulo Eliminado");
					location.href="/stock";
				})
			}

		},

		extractToken : function () {
			var tokenContainer = document.getElementsByName("authenticity_token");
			var token = $(tokenContainer).val(); 
			return token;
		},
	},

	ticketUI : {
		/* triggers for the ticket ui */
		$total : $("#total"),
		$pay : $("#pay"),
		$change : $("#change"),
		$abort : $("#cancel"),
		$saveTicket : $("#sold"),

		update :  function () {
			stock.ticketUI.$total.text(stock.ticket.total);
		},

		getTicketID :  function () {
			$json  = $.getJSON("/tickets/new");
			$json.done(function(ticket){
				stock.$notice.text(ticket.id);
			});
		}
	},

	error : {
		itemNotFound : new Error ("404 Elemento no encontrado"),
		noSearchResults :  new Error("No hay resultados para esta busqueda"),
	}

};

$(function(){
	
	  $("nav").find("a").each(function(k,v){ 
	      loc = $(v).attr("href");
	      $(v).removeClass("active")
	      if(loc === location.pathname) {
	        $(v).addClass("active");
	      }
    });

	 $(".bar").find("a").each(function(k,v){ 
	 	  loc = location.protocol + "//" + location.host;
  	      loc += $(v).attr("href");
	      $(v).removeClass("current")
	      console.log(loc + " vs " + location.href.toString())
	      if(loc === location.href.toString()) {
	        $(v).addClass("current");
	      }
    });

	 stock.init();
});



