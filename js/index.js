ajax({
    url:'js/shoppingData.json',
    type:'get',
    content:"",
    success(resp){
        createDom(resp);
        addEvent();
        addSelectEvent()
    }
})
let tbody = document.querySelector('#shopping .product tbody');
let selectedTbody = document.querySelector('.selected tbody');
let totalMoneyDom = document.querySelector('.selected thead tr th strong');
let option = {};

function init () {
    option = JSON.parse(localStorage.getItem('buyStorage')) || {};
    renderProt(option)
}
init ()


function createDom (data) {
    let str = '';
  
     data.forEach( item => {
        let span ='';
        item.list.forEach((it)=>{
            span +=` <span data-id=${it.id}>${it.color}</span>`
        })

            str += `                <tr>
            <td>
                <img src=${item.list[0].img} />
            </td>
            <td>
                <p>${item.name}</p>
                <div class="color">
                   ${span}
                </div>
            </td>
            <td>${item.list[0].price}</td>
            <td>
                <span>-</span>
                <strong>0</strong>
                <span>+</span>
            </td>
            <td><button>加入购物车</button></td>
        </tr>`;
        tbody.innerHTML = str;
    });

    

}


function addEvent () {
    let trs = document.querySelectorAll('.product tbody tr');
    for (let i = 0; i < trs.length; i++) {
        let tds =  trs[i].children;
        let colors = tds[1].children[1].children;
        let img = tds[0].children[0];
        let imgSrc = '';
        let defaultSrc = `images/img_0${i+1}-1.png`;
        let name = tds[1].children[0].innerHTML;
        let spanBtn = tds[3].children;
        let priceTd = tds[2];
        let price = priceTd.innerHTML;
        let addBuy = tds[4].children;
        let curColor = '';
        let curspan = null;
        let num = 0;
        let last = null;

        
        for (let j = 0; j < colors.length; j++) {
            colors[j].onclick = function () {
                if (last&&(last!= this)) {
                    last.className = '';
                }
                    this.className = this.className ? '': 'active';
                    curColor = this.className ? this.dataset.id : '';
                    curspan = this.className ? this : '';
                    img.src = this.className ?`images/img_0${i+1}-${j+1}.png` :defaultSrc;         
                last = this;
                imgSrc =`images/img_0${i+1}-${j+1}.png`;
            }
        }
        for (let i = 0; i < addBuy.length; i++) {
            addBuy[i].onclick = function () {
                if (curColor&&(num>0)) {
                    spanBtn[1].innerHTML = 0;
                    curspan.className = '';
                    img.src =defaultSrc;         
                    option[curColor] = {
                        'name':name,
                        'src':imgSrc,
                        'color':curspan.innerHTML,
                        'num':num,
                        'id':curColor,
                        'price':price,
                        'time':null,
                    }
                    num = 0;
                    priceTd.innerHTML = price;
                    localStorage.setItem('buyStorage',JSON.stringify(option))
                    curColor = '';
                    renderProt(JSON.parse(localStorage.getItem('buyStorage')))
                    addSelectEvent()
                }else{
                    alert('请选择商品型号和数量')
                    return
                }
            }
        }
        spanBtn[0].onclick = function () {
            num--;
            if (num < 0) {
                num = 0;
            }
            priceTd.innerHTML = num*price;
            spanBtn[1].innerHTML = num;
        }
        spanBtn[2].onclick = function () {
            num++;
            spanBtn[1].innerHTML = num;
            priceTd.innerHTML = num*price;
        }

    }
}

function renderProt (data) {
    let str = '';
    let total = 0;
    let toPrice = 0;
    for (prop in data) {
        toPrice = Number(data[prop].price)*data[prop].num;
        str +=`                <tr>
        <td>
            <img src=${data[prop].src} />
        </td>
        <td>
            <p>${data[prop].name} </p>
        </td>
        <td>${data[prop].color}</td>
        <td>${toPrice}元</td>
        <td>x${data[prop].num} </td>
        <td><button data-id=${data[prop].id}>删除</button></td>
    </tr>`;
        total += toPrice;
        totalMoneyDom.innerHTML = total +'元';
    }
    selectedTbody.innerHTML = str;
}

function addSelectEvent () {
    let buttons = document.querySelectorAll('.selected tbody button');
    for (let i = 0; i < buttons.length; i++) {
       buttons[i].onclick = function () {
          delete option[this.dataset.id];
          localStorage.setItem('buyStorage',JSON.stringify(option))
        selectedTbody.removeChild(buttons[i].parentNode.parentNode)
        totalMoneyDom.innerHTML = parseInt(totalMoneyDom.innerHTML) - parseInt(buttons[i].parentNode.parentNode.children[3].innerHTML) +'元';
        }    
    }
}


