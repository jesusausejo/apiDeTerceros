    function _cb_findItemsByKeywords(toor) {
      var items = toor.findItemsByKeywordsResponse[0].searchResult[0].item || [];
      var context = {
        item:[]
      };
        for (var i = 0; i < items.length; ++i) {
        var item     = items[i];
        var condition = item.condition[0].conditionDisplayName;
        var title    = item.title[0];
        var country    = item.country[0];
        var pic      = item.galleryURL[0];
        var viewitem = item.viewItemURL[0];
        var price = item.sellingStatus[0].convertedCurrentPrice[0].__value__;
        var units = item.sellingStatus[0].convertedCurrentPrice[0]["@currencyId"];
        context.item.push({
          item: item,
          title: title,
          country: country,
          pic: pic,
          viewitem: viewitem,
          condition: condition,
          price: price,
          units: units
        });
      }
      var HTML = Handlebars.templates.todo(context);
      document.getElementById("result").innerHTML = HTML;


    }  // End _cb_findItemsByKeywords() function
    

    // Create a JavaScript array of the item filters you want to use in your request
    var filterarray = [
      {"name":"MaxPrice", 
       "value":"10000", 
       "paramName":"Currency", 
       "paramValue":"USD"},
      {"name":"FreeShippingOnly", 
       "value":"true", 
       "paramName":"", 
       "paramValue":""},
      {"name":"ListingType", 
       "value":["AuctionWithBIN", "FixedPrice", "StoreInventory"], 
       "paramName":"", 
       "paramValue":""},
      ];


    // Define global variable for the URL filter
    var urlfilter = "";

    // Generates an indexed URL snippet from the array of item filters
    function  buildURLArray() {
      // Iterate through each filter in the array
      for(var i=0; i<filterarray.length; i++) {
        //Index each item filter in filterarray
        var itemfilter = filterarray[i];
        // Iterate through each parameter in each item filter
        for(var index in itemfilter) {
          // Check to see if the paramter has a value (some don't)
          if (itemfilter[index] !== "") {
            if (itemfilter[index] instanceof Array) {
              for(var r=0; r<itemfilter[index].length; r++) {
              var value = itemfilter[index][r];
              urlfilter += "&itemFilter\(" + i + "\)." + index + "\(" + r + "\)=" + value ;
              }
            } 
            else {
              urlfilter += "&itemFilter\(" + i + "\)." + index + "=" + itemfilter[index];
            }
          }
        }
      }
    }  // End buildURLArray() function

    // Execute the function to build the URL filter
    buildURLArray(filterarray);

    document.getElementById('btn').addEventListener("click", (function(){

        var search = document.getElementById('search').value;
        search = search.replace(" ","_");
        // Construct the request
        // Replace MyAppID with your Production AppID
        var url = "http://svcs.ebay.com/services/search/FindingService/v1";
            url += "?OPERATION-NAME=findItemsByKeywords";
            url += "&SERVICE-VERSION=1.0.0";
            url += "&SECURITY-APPNAME=JesusAus-useApiDW-PRD-a5d7504c4-3cc48de5";
            url += "&GLOBAL-ID=EBAY-ES";
            url += "&RESPONSE-DATA-FORMAT=JSON";
            // url += "&callback=_cb_findItemsByKeywords";
            url += "&REST-PAYLOAD";
            url += "&keywords="+search;
            url += "&paginationInput.entriesPerPage=5";
            url += urlfilter;


        // Submit the request 
        // s=document.createElement('script'); // create script element
        // s.src= url;
        // document.body.appendChild(s);

        $.get(url, _cb_findItemsByKeywords, "jsonp")
            .done(function() {
                alert("second success");
            })
            .fail(function(data) {
                alert("error");
            })
            .always(function(data) {
                     alert("");
            });
        // document.body.innerHTML+="<a href=\"" + url + "\">" + url + "</a>";
    }));
    

    // Display the request as a clickable link for testing
    // document.body.innerHTML+="<a href=\"" + url + "\">" + url + "</a>"
    // document.write("<a href=\"" + url + "\">" + url + "</a>");
