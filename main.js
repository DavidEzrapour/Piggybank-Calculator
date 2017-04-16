$(document).ready(function(){
    $("#form1").submit(function(data){
        
        data.preventDefault();
        
        
        var stockTic = $('#form1 input[name = "tic" ]').val();
        
        
        var source = "http://money.cnn.com/quote/forecast/forecast.html?symb="+ stockTic + "#wsod_forecasts"
        $("#theFrame").attr("src", source);
        var stockInfo = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22"+stockTic+"%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
        
        var revArr = [];
        var earnArr = [];
        var currentPrice, marketCap, numberShares, priceSales, nextEps
        var average = []
        var prevEps;
        
        function fn1(){
            console.log("1");
            $.get(stockInfo,function(data){
                data = data.query.results.quote;

                currentPrice = data.LastTradePriceOnly;
                marketCap = data.MarketCapitalization;
                
                end = marketCap.substring(marketCap.length-1,marketCap.length+1);
                marketCap = marketCap.substring(0,marketCap.length-1);
                
                marketCap = marketCap * 1000000;
                
                if(end = 'B')
                    marketCap = marketCap * 1000;
                
                numberShares = marketCap/currentPrice;
                priceSales = data.PriceSales;
                nextEps = data.EPSEstimateNextQuarter;
                fn2();
                
            }) // close get from yql
        }
        
        function fn2(){
            console.log("2");
            var revenue = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'https%3A%2F%2Fwww.google.com%2Ffinance%3Fq%3DNASDAQ%253A"+stockTic+"%26fstype%3Dii%26ei%3DVuXyWNi4KcG22Aac7ofwDQ'%20and%20xpath%3D'%2F%2F*%5B%40id%3D%22fs-table%22%5D%2Ftbody%2Ftr%5B1%5D'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
            $.get(revenue).then(function(data){
                if(data.query.results==null)
                    fn2();
                data = data.query.results.tr[0].td;
                
                for(var i = 1; i<=data.length-3;i++)
                    revArr.push(parseInt(data[i].content));
                console.log(revArr);
                if(revArr!=[])
                    fn3();
            });
        }
        
        function fn3(){   
            console.log("3");
            var earnings = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'https%3A%2F%2Fwww.google.com%2Ffinance%3Fq%3DNYSE%253A"+ stockTic +"%26fstype%3Dii%26ei%3Dl9_yWLnyNcKhjAGCzIKQAw'%20and%20xpath%3D'%2F%2F*%5B%40id%3D%22fs-table%22%5D%2Ftbody%2Ftr%5B25%5D'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"
            $.get(earnings).then(function(data){
                if(data.query.results==null)
                    fn3();
                data = data.query.results.tr[0].td;
                console.log(data);
                for(var i = 1; i<=data.length-3;i++)
                    if(data[i].content!=null)
                        earnArr.push(parseInt(data[i].content));
                    else
                        earnArr.push(parseInt(data[i].span.content));
                    
                    
                if(earnArr!=[])
                    fn4();
            });
        }
        
        function fn4(){
            
            var distance = [];
            
            distance.push(revArr[0] - earnArr[0]);
            distance.push(revArr[1] - earnArr[1]);
            distance.push(revArr[2] - earnArr[2]);
            
            var averageDistance =(distance[0]+ distance[1]+ distance[2])/ 3;
            
            var estimatedEarnings = (nextEps*numberShares);
                
            var nextRevenue =(averageDistance+estimatedEarnings);
            var newMarketCap = ((revArr[0]+revArr[1]+revArr[2]+estimatedEarnings)*priceSales);
            var newPrice = newMarketCap/ numberShares;
            var percentChange = (newPrice-currentPrice)/ currentPrice;
                 
            // console.log(marketCap/currentPrice);
            // console.log(marketCap);
            console.log(numberShares);
            
            $("#calc").text("Next Revenue: " + nextRevenue + "\n" + "New Market Cap: " + newMarketCap + "\n" + "Next Price: " + newPrice + '\n' + "Percent Change: " + percentChange)
            //print the new/ next variables
        }
        
        // var dfd = $.Deferred();
        
        // dfd.done(fn1(), fn2(), fn3());
        
        // dfd.resolve();
        
        fn1();

        }); //close form submit
    
    
     $("#com").text( );

    
});// cloy se document
    