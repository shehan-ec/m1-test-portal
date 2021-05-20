const configuration= {
    endpoint: "http://m1astheckout-20210408113635-hostingbucket-dev.s3-website-ap-southeast-1.amazonaws.com/checkout",
    signClientSide: true
}

var secret = document.getElementById('merchant-secret');
var merchant = document.getElementById('merchant-selector')
var total = order.total;


function run() {
    configuration['secret'] = secret.value;
    let date = new Date();
    sign(configuration,total,merchant.value,date)
    .then(signature=>{
        console.print("Request Signature: " +  signature + '\n');
        let url = configuration.endpoint + '?';
        url += "merchant=" + merchant.value + "&";
        url += "total=" + order.total + "&";
        url += "timestamp=" + date.getTime() + "&";
        
        if(order.items){
            url += "items=" + encodeURIComponent(JSON.stringify(Object.values(order.items))) + "&";
        }
        
        url += "hmac=" + signature;
        let left = window.innerWidth/2 - 190
        console.print('Generated URL: \n ' + url + "_blank" ,`height=800,width=380,left=${left}`)
        var popup = window.open(url, "_blank" ,`height=800,width=380,left=${left}`);
        popup.onclose = function(){console.print("Popup Closed")};
        order.items ={};
        order.total = 0;
    })
    .catch(console.print)

}

const sign = async (config,total,merchantId,date) => {
    const enc = new TextEncoder();
    
    let crypto = window.crypto;
    let signature = '';
    let stringToSign = merchantId+total+ date.getTime();
    
    if(crypto.subtle){
        try{
            let key = await crypto.subtle.importKey(
                'raw',
                enc.encode(config.secret),
                {
                    name: 'HMAC',
                    hash: {name:'SHA-512'}
                },
                false,
                ["sign","verify"]
            )

            let ab = await crypto.subtle.sign(
                "HMAC",
                key,
                enc.encode(stringToSign)
            )

            let b = new Uint8Array(ab);

            signature = Array.prototype.map.call(b, x => ('00'+x.toString(16)).slice(-2)).join("")
            
            return signature;



        }catch(e){
            console.print('Signing Failed');
        }
    }else{
        console.print('Cryptographic API not supported');
    }

};

