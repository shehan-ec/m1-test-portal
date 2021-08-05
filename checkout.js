const configuration= {
    endpoint: "http://m1astheckout-20210408113635-hostingbucket-dev.s3-website-ap-southeast-1.amazonaws.com/checkout",
    signClientSide: true
}

var secret = document.getElementById('merchant-secret');
var merchant = document.getElementById('merchant-selector');

var fail_signature = document.getElementById('fail_signature');

var custom_timestamp_check = document.getElementById('custom_timestamp_check');
var custom_timestamp_value = document.getElementById('custom_timestamp_value');
var custom_url_check = document.getElementById('custom_url');

var custom_localhost_check = document.getElementById('custom_local_check');
var custom_localhost_port = document.getElementById('custom_local_port');

var is_bnpl = document.getElementById('is_bnpl');

var total = order.total;


function run() {
    configuration['secret'] = secret.value;
    let date = new Date();


    if(custom_timestamp_check.checked){
        date = new Date(custom_timestamp_value.value)
        console.print("Overriding Date to: " + date + '\n');
    }

    sign(configuration,total,merchant.value,date)
    .then(signature=>{
        if(fail_signature.checked){
            console.print("Force Failing Signature \n")
            signature = "FAIL_SECRET";
        }
        console.print("Request Signature: " +  signature + '\n');
        
        let url;
        url = configuration.endpoint + '?';

        if(custom_localhost_check.checked){
            url = "http://localhost:" + custom_localhost_port.value +'/checkout?'
        }
        url += "merchant=" + merchant.value + "&";
        url += "total=" + order.total + "&";
        url += "timestamp=" + date.getTime() + "&";
        
        if(order.items){
            url += "items=" + encodeURIComponent(JSON.stringify(Object.values(order.items))) + "&";
        }
        console.log(custom_url.checked)
        if(custom_url_check.checked){
            url = prompt('Edit URL',url)
        }
        
        if(is_bnpl.checked) url += "BNPL=true&";
        url += "hmac=" + signature;
        let left = window.innerWidth/2 - 190
        console.print('Generated URL: \n' + url + "_blank" ,`height=800,width=380,left=${left} \n`)
        var popup = window.open(url, "_blank" ,`height=800,width=380,left=${left}`);
        console.print('\n\nTesting',true);

        var timer = setInterval(function(){
            if(popup.closed){
                console.print('\n\nPopup Closed.******************************************* \n')
                clearInterval(timer);
            }else{
                console.print(".",true)
            }
        },1000)
        
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
            console.print('Using Secret: ' + config.secret);
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

