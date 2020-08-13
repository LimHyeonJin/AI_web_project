function call_ajax() {

    if (event.keyCode == 13) {
        // 서버쪽 프로그램을 호출해서 결과를 받아온다.
        // jQuery를 이용해 AJAX 처리를 해야한다.
        // ajax의 인자로 javascript 객체를 넣어준다.
        // javascript 객체는 => { key : value, key : value, ...}
        // data : 서버 프로그램에게 넘겨줄 데이터들...
        $("tbody").empty()
        var key = $("input[type=text]").val()
        var key_url = encodeURI(key)
        $.ajax({
            async: true, // ajax sync를 동기 방식으로 할지, 비동기 방식으로 할지  비동기 방식의 호출은 true!
            url: "http://seoji.nl.go.kr/landingPage/SearchApi.do?result_style=json&cert_key=de1cea5deb24a880b49386fde67eabff5322674203dde744fd9a13bbc56fb7ab&page_no=1&page_size=50&deposit_yn=Y&title="+ key,
            type: "GET",
            timeout: 3000,
            dataType: "json",  // 결과 JSON을 JavaScript객체로 변환
            success: function (result) {   // 서버가 주는 데이터 : result
                $.each(result.docs, function (idx,item) {  // for문과 동일한 방식이다. 각각의 result에 대해 function을 수행
                    var tr = $("<tr></tr>")
                    var imgTd = $("<td></td>")
                    var img = $("<img \>").attr("src", item.TITLE_URL)  //<img src= ~~~>
                    imgTd.append(img)

                    var titleTd = $("<td></td>").text(item.TITLE)
                    var authorTd = $("<td></td>").text(item.AUTHOR)
                    var priceTd = $("<td></td>").text(item.EA_ISBN)
                    infonaru(item.TITLE, item.EA_ISBN)
                    // var delTd = $("<td></td>")
                    // var delBtn = $("<input \>").attr({type :"button",value :"삭제"})
                    // delBtn.on("click",function () {
                    //     // 현재 클릭된 버튼에 대한 책 정보를 찾아서 삭제.
                    //     // this : 현재 이벤트가 발생된 객체를 지칭.
                    //     $(this).parent().parent().remove()
                    // }) // "(click)"할때 이벤트 처리(함수)
                    // delTd.append(delBtn)
                    //
                    // tr.append(imgTd)
                    // tr.append(titleTd)
                    // tr.append(authorTd)
                    // tr.append(priceTd)
                    // tr.append(delTd)
                    //
                    // $("tbody").append(tr)
                })

            },
            error:function(request,status,error){
                alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
                console.log(error)
            },
        })
    }
}

function infonaru(lib_name, ISBN){
    $.ajax({
        async: true, // ajax sync를 동기 방식으로 할지, 비동기 방식으로 할지  비동기 방식의 호출은 true!
        url: "http://data4library.kr/api/libSrchByBook?authKey=6933bb3911c27b1bb03b529fcf3e4789b8b2e91c9c059689910963272f861062&region=11&format=json&isbn="+ISBN,
        type: "GET",
        timeout: 3000,
        dataType: "json",  // 결과 JSON을 JavaScript객체로 변환
        success: function (result) {   // 서버가 주는 데이터 : result

            $.each(result.response.libs, function (idx,item) {  // for문과 동일한 방식이다. 각각의 result에 대해 function을 수행
                var tr = $("<tr></tr>")
                var imgTd = $("<td></td>")
                var img = $("<img \>").attr("src", )  //<img src= ~~~>
                imgTd.append(img)

                var titleTd = $("<td></td>").text(item.lib.libName)
                var authorTd = $("<td></td>").text(item.lib.address)
                var latitude = $("<td></td>").text(item.lib.latitude)
                var longitude = $("<td></td>").text(item.lib.longitude)

                var delTd = $("<td></td>")
                var delBtn = $("<input \>").attr({type :"button",value :"삭제"})
                delBtn.on("click",function () {
                    // 현재 클릭된 버튼에 대한 책 정보를 찾아서 삭제.
                    // this : 현재 이벤트가 발생된 객체를 지칭.
                    $(this).parent().parent().remove()
                }) // "(click)"할때 이벤트 처리(함수)
                delTd.append(delBtn)

                tr.append(lib_name)
                tr.append(titleTd)
                tr.append(authorTd)
                tr.append(latitude)
                tr.append(longitude)
                tr.append(delTd)

                $("tbody").append(tr)
            })

        },
        error:function(request,status,error){
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            console.log(error)
        },
    })
}


