function ajax(option){
    let url = option.url;
    let type = option.type;
    let content = option.content;
    let success = option.success;
    let xhr = new XMLHttpRequest();
    if (type == 'get') {
        let str = `${url}?${content}`
        xhr.open(type,str);
        xhr.send()
    }
   
    xhr.onreadystatechange = function () {
        if (xhr.readyState == '4') {
            if (xhr.status == '200') {
                success(JSON.parse(xhr.responseText))
            }
        }
    }

}