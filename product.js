const prodTable = document.getElementById('product-table');
const order = {
    items: {},
    total: 0
};

function addProduct(e) {
    e.preventDefault();
    var data = new FormData(e.target);
    if(order.items[data.get('id')]) {
        alert('Product already added.');
        throw new Error('PRODUCT_ID_MUST_BE_UNIQUE')
    }
    order.items[data.get('id')] = ({
        id:data.get('id'),
        description: data.get('name'),
        quantity: data.get('qty'),
        purchasePrice: data.get('price')
    });

    var totalVal = parseFloat(data.get('price')) * parseFloat(data.get('qty'));
    var row = document.createElement('tr');
    var id = document.createElement('td');
    var name = document.createElement('td');
    var qty = document.createElement('td');
    var price = document.createElement('td');
    var total = document.createElement('td');
    var del = document.createElement('button')
    del.innerHTML = "Remove"
    
    del.onclick = function(){
        row.remove();
        delete order.items[data.get('id')];
        console.print('Removed Product \n');
    };
    
    id.innerHTML = data.get('id');
    name.innerHTML = data.get('name');
    qty.innerHTML = data.get('qty');
    price.innerHTML = data.get('price');
    total.innerHTML = totalVal;
    order.total += totalVal;
    row.append(id,name,qty,price,total,del);
    prodTable.appendChild(row);
    console.print('Added Product \n');
}
